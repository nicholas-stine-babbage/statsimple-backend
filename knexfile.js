import dotenv from './src/dotenv.js'

let psqlURL = process.env.POSTGRES_URL && new URL(process.env.POSTGRES_URL)
psqlURL?.searchParams?.delete('sslmode')

console.log("PSQL NO SSL: ", psqlURL.toString())
let dbobject = {
  client: 'pg',
  connection:  {
    connectionString: psqlURL?.toString(),
    host: process.env.POSTGRES_HOST || 'localhost',
    user: process.env.POSTGRES_USER || 'testuser',
    database: process.env.POSTGRES_DATABASE || 'agstat',
    password: process.env.POSTGRES_PASSWORD || 'password',
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

