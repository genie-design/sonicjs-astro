import type { APIContext, APIRoute } from 'astro';
import { TussleCloudflareWorker } from '@tussle/middleware-cloudflareworker';
import { TussleStateMemory } from '@tussle/state-memory';
import { type R2UploadState, TussleStorageR2 } from '@tussle/storage-r2';
import { apiConfig } from '../../db/routes';
import {
  getOperationCreateResult,
  getApiAccessControlResult
} from '@/auth/auth-helpers';

const stateService = new TussleStateMemory<R2UploadState>();

// Helper function to cache completed upload response
async function cacheCompletedUploadResponse(
  request: Request,
  location: string,
  offset: number
) {
  const url = new URL(request.url);
  url.pathname = location;

  const cache = await caches.open('tus-uploads');
  await cache.put(
    url.toString(),
    new Response(null, {
      headers: {
        'Upload-Offset': offset.toString(10),
        'Upload-Length': offset.toString(10),
        'Tus-Resumable': '1.0.0',
        'Cache-Control': 'max-age=604800'
      }
    })
  );
}

// Helper function to handle GET requests
async function handleGET(request: Request, ctx: APIContext) {
  const pathname = new URL(request.url).pathname;
  const pathParts = pathname.split('/');
  let route = '';
  let fieldName = '';

  pathParts.forEach((part) => {
    if (part.startsWith('r_')) {
      route = part.replace('r_', '');
    }
    if (part.startsWith('f_')) {
      fieldName = part.replace('f_', '');
      if (fieldName.includes('[')) {
        fieldName = fieldName.split('[')[0];
      }
    }
  });

  const table = apiConfig.find((entry) => entry.route === route);
  if (!table) {
    return new Response('Not Found', { status: 404 });
  }

  if (table.hooks?.beforeOperation) {
    await table.hooks.beforeOperation(ctx, 'read', pathname);
  }

  const accessControlResult = await getApiAccessControlResult(
    table?.access?.operation?.read || true,
    table?.access?.filter?.read || true,
    table?.access?.item?.read || true,
    ctx,
    pathname,
    table.table
  );

  if (!accessControlResult) {
    return new Response('Unauthorized', { status: 401 });
  }

  const cache = await caches.open('tus-uploads');
  const cachedResponse = await cache.match(request.url + 'GET');

  if (cachedResponse) {
    if (table.hooks?.afterOperation) {
      await table.hooks.afterOperation(ctx, 'read', pathname, null, {
        pathname,
        cache: true
      });
    }
    return cachedResponse;
  }

  const field = table.fields?.[fieldName];
  if (field?.type === 'file' || field?.type === 'file[]') {
    const bucket = field.bucket(ctx);
    if (bucket) {
      const storage = new TussleStorageR2({
        stateService,
        bucket,
        skipMerge: false
      });

      try {
        const file = await storage.getFile(pathname);
        if (file) {
          const type = (file.metadata.type || file.metadata.filetype) as string;
          const response = new Response(file.body, {
            status: 200,
            headers: {
              'Content-Type': type
            }
          });

          await cache.put(request.url + 'GET', response.clone());

          if (table.hooks?.afterOperation) {
            await table.hooks.afterOperation(ctx, 'read', pathname, file, {
              pathname,
              cache: false
            });
          }

          return response;
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  if (table.hooks?.afterOperation) {
    await table.hooks.afterOperation(ctx, 'read', pathname, null, {
      pathname,
      cache: false
    });
  }

  return new Response('Not Found', { status: 404 });
}

export const all: APIRoute = async (ctx) => {
  const request = ctx.request;
  const route = request.headers.get('sonic-route');
  let fieldName = request.headers.get('sonic-field');
  if (fieldName?.includes('[')) {
    fieldName = fieldName.split('[')[0];
  }
  const mode = request.headers.get('sonic-mode') as 'create' | 'update';
  const id = request.headers.get('data-id');
  const table = apiConfig.find((entry) => entry.route === route);

  if (request.method === 'HEAD') {
    const cache = await caches.open('tus-uploads');
    const cachedResponse = await cache.match(request.url);
    if (cachedResponse) {
      return cachedResponse;
    }
  }

  if (request.method === 'GET') {
    return handleGET(request, ctx);
  }

  if (!fieldName) {
    return new Response('Not Found', { status: 404 });
  }

  if (!table) {
    return new Response('Not Implemented', { status: 501 });
  }

  const field = table.fields?.[fieldName];
  let bucket: R2Bucket | null = null;
  let path: string;

  if (field?.type === 'file' || field?.type === 'file[]') {
    bucket = field.bucket(ctx);
    if (typeof field.path === 'string') {
      path = field.path;
    } else if (typeof field.path === 'function') {
      path = field.path(ctx);
    } else {
      path = '';
    }

    if (path && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    if (path && !path.startsWith('/')) {
      path = '/' + path;
    }
    path += '/r_' + route + '/f_' + fieldName;
  }

  if (!bucket) {
    return new Response('Not Found', { status: 404 });
  }
  const storage = new TussleStorageR2({
    stateService,
    bucket,
    skipMerge: false
  });

  // Create TussleMiddleware instance with hooks
  const tussle = new TussleCloudflareWorker({
    hooks: {
      'before-create': async (_ctx, params) => {
        if (table.hooks?.beforeOperation) {
          await table.hooks.beforeOperation(ctx, mode, id, params);
        }

        const filename =
          params.uploadMetadata.filename || params.uploadMetadata.name;
        const fileExtension = '.' + filename.split('.').pop();

        let authorized = true;
        if (mode === 'create') {
          authorized = await getOperationCreateResult(
            table?.access?.operation?.create || true,
            ctx,
            params
          );
        } else {
          authorized = !!(await getApiAccessControlResult(
            table?.access?.operation?.update || true,
            table?.access?.filter?.update || true,
            table?.access?.item?.update || true,
            ctx,
            id,
            table.table,
            params
          ));
        }

        if (!authorized) {
          return new Response('Unauthorized', { status: 401 });
        }

        let uploadPath: string;
        switch (params.uploadConcat?.action) {
          case 'partial':
            uploadPath =
              params.path +
              path +
              '/segments/' +
              crypto.randomUUID() +
              fileExtension;
            break;
          case 'final':
          default:
            uploadPath =
              params.path + path + '/' + crypto.randomUUID() + fileExtension;
            break;
        }

        return {
          ...params,
          path: uploadPath
        };
      },
      'after-complete': async (ctx, params) => {
        if (table?.hooks?.afterOperation) {
          await table.hooks.afterOperation(ctx, mode, id, params, params);
        }
        const { location, offset } = params;
        await cacheCompletedUploadResponse(
          ctx.originalRequest,
          location,
          offset
        );
        return params;
      }
    },
    core: {
      storage
    }
  });

  try {
    const response = await tussle.handleRequest(request);
    if (response) {
      return response;
    }
  } catch (error) {
    console.error('Error handling TUS request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }

  return new Response('Not Implemented', { status: 501 });
};
