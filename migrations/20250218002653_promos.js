export const up = (knex) => {
    return knex.schema
        .createTable('promos', (t) => {
            t.uuid('user_id').references('users.id').notNullable()
            t.string('code').notNullable()
            t.timestamps(true, true)
        })
}

export const down = (knex) => {
    return knex.schema
        .dropTableIfExists('promos')
}