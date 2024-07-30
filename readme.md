
## run npm db-latest on the production database
cross-env PRODUCTION=true DB_HOST=stat-simple-test-db.cm77zzcdkdwp.us-east-2.rds.amazonaws.com DB_PASS="<password>" DB_USER=statsimpleuser npx knex migrate:latest --knexfile=./knexfile.js