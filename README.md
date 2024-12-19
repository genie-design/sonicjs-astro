Prerequisites:

Node.js and npm: Ensure you have Node.js (version 18 or higher) and npm installed on your system. You can download them from the official website: https://nodejs.org/

Cloudflare Account: You have created a Cloudflare account. (free)

1. run npm install
2. login to cloudflare with wrangler `npx wrangler login`
3. Create the database `npx wrangler d1 create bdb`
You should get a printout like

✅ Successfully created DB 'bdb' in region WNAM
Created your new D1 database.

[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "bdb"
database_id = "data-base-id-is-here"

4. Copy the output to wrangler.toml (replace the existing contents)
5. run `npm run db:migrate:local`
	- Enter 'Y' to apply 5 migrations
	- this will run the sql files to create the db
6. Run `npm run dev`
	- the app will now be running at localhost:4321
7. Go to http://localhost:4321/admin/register to create an account
	- Since it is the first account it will be the admin account
8. You will be redirected to http://localhost:4321/admin/login to login
9. You will also be logged in at http://localhost:4321
10. You can open a private/incognito window to create and login to a new account
11. From the admin account you can see the database data, like if the form at http://localhost:4321/contact is submitted you can see it at http://localhost:4321/admin/tables/user-comments
12. Or you can run sql commands from the command line, like `npx wrangler d1 execute bdb --command="SELECT * FROM user_comments;"`

