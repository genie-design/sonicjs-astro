import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { auditSchema } from './audit';
import type { ApiConfig } from '../routes';
import { isAdmin } from '../config-helpers';
import { relations } from 'drizzle-orm';
import * as users from './users';

export const icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
</svg>`;

export const tableName = 'user_comments';
export const route = 'user-comments';
export const name = 'User Comments';

export const definition = {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  userId: text('userId')
};

export const table = sqliteTable(tableName, {
  ...definition,
  ...auditSchema
});

export const relation = relations(table, ({ one }) => ({
  user: one(users.table, {
    fields: [table.userId],
    references: [users.table.id]
  })
}));

export const access: ApiConfig['access'] = {
  operation: {
    read: isAdmin,
    create: true,
    update: isAdmin,
    delete: isAdmin
  }
};

export const fields: ApiConfig['fields'] = {
  message: {
    type: 'textArea'
  }
};
