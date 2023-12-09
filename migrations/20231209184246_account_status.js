export const up = function(knex) {
    return knex.schema
        .alterTable('users', t => {
            t.enum('status', ['pending', 'active', 'inactive']).defaultTo('pending')
        })
};

export const down = function(knex) {
  return
};
