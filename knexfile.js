import dotenv from './src/dotenv.js'

let dbobject = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'testuser',
    database: process.env.DB_NAME || 'agstat',
    password: process.env.DB_PASS || 'password',
    ssl: process.env.PRODUCTION ? { rejectUnauthorized: false } : {}
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations'
  },
  seeds: {
    directory: './seeds'
  }
};

if (!process.env.PRODUCTION) delete dbobject['connection']['ssl']

console.log(dbobject)

export default dbobject

