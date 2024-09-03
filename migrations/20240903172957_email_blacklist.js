export const up = (knex) => {
    return knex.schema
        .createTable('email_blacklist', (t) => {
            t.string('email').primary().unique()
            t.string('reason')
        })
}

export const down = (knex) => {
    return knex.schema
        .dropTableIfExists('email_blacklist')
}