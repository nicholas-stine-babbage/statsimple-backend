
import Knex from 'knex'
import knexfile from '../knexfile.js'

const ARGS = ['setup', 'migrate', 'seed']

async function setup() {
    const arg = process.argv[2]
    if (!ARGS.includes(arg)) throw new Error('Expected one of the following args: ' + ARGS.toString())

    const { connection: { database, ...connection }} = knexfile
    const knexfile_no_db = { ...knexfile, connection: { ...connection, database: 'postgres' }}
    const knex_no_db = Knex(knexfile_no_db)

    await knex_no_db.raw('DROP DATABASE IF EXISTS agstat')
    await knex_no_db.raw('CREATE DATABASE agstat')

    const knex = Knex(knexfile)

    await migrate(knex)
    await seed(knex)
    
}

async function migrate(knex) {
    await knex.migrate.rollback(undefined, true)
    await knex.migrate.latest()
    console.log("MIGRATIONS COMPLETE")
}

async function seed(knex) {
    await knex.seed.run()
    console.log("SEEDING COMPLETE")
}

setup().then(() => {
    process.exit(0)
}).catch((err) => {
    console.error(err)
    process.exit(0)
})