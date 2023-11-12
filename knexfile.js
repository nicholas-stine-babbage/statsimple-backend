// const ssl = process.env.DB_SSL ? { encryption: false}
import dotenv from 'dotenv'

let ssl = {}
if (process.env.PRODUCTION) {
  dotenv.config({ path: '.production.env'})
  ssl = { rejectUnauthorized: false }
}
console.log("SSL IN THIS BEEEEEEEEEEACH: ", ssl)

let dbobject = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    database: process.env.DB_NAME || 'agstat',
    password: process.env.DB_PASS || 'password',
    ssl,
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations'
  }
};

if (!process.env.PRODUCTION) delete dbobject['connection']['ssl']

console.log(dbobject)

export default dbobject
