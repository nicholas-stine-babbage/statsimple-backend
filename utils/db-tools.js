
import Knex from 'knex'
import knexfile from '../knexfile.js'

const ARGS = ['setup', 'latest', 'seed']

async function setup() {
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

async function seed(knex=undefined) {
    if (!knex) Knex(knexfile).seed.run() 
    else await knex.seed.run()
    console.log("SEEDING COMPLETE")
}

async function latest() {
    console.log("LATEST MIGRATION STARTED")

    const knex = Knex(knexfile)
    await knex.migrate.latest()

    console.log("LATEST MIGRATION RUN")
}

async function run() {
    const arg = process.argv[2]
    if (!ARGS.includes(arg)) throw new Error('Expected one of the following args: ' + ARGS.toString())

    switch (arg) {
        case 'setup':
            await setup()
            break
        case 'latest':
            await latest()
            break
        case 'seed':
            await seed()
            break
    }
}

run().then(() => {
    process.exit(0)
}).catch((err) => {
    console.error(err)
    process.exit(0)
})