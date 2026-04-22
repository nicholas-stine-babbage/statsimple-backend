import dotenv from './src/dotenv.js'

let dbobject = {
  client: 'pg',
  connection: {
    ...(!!process.env.POSTGRES_URL ? {
      connectionString: process.env.POSTGRES_URL
    } : {
    host: process.env.POSTGRES_HOST || 'localhost',
    user: process.env.POSTGRES_USER || 'testuser',
    database: process.env.POSTGRES_DATABASE || 'agstat',
    password: process.env.POSTGRES_PASSWORD || 'password',
    ssl: process.env.PRODUCTION ? { rejectUnauthorized: false } : {}
    })
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

