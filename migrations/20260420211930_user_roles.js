export const up = function(knex) {
    return knex.schema
        .alterTable('users', t => {
            t.string('role').defaultTo('standard')
        })
};

export const down = function(knex) {
    return knex.schema
        .alterTable('users', t => {
            t.dropColumn('role')
        })
};
