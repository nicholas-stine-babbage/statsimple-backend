export const up = function(knex) {
  return knex.schema
    .createTable('users', t => {
        t.uuid('id').unique()
        t.string('email').unique()
        t.string('passhash')
        t.string('name')
        t.string('business')
  })
};

export const down = function(knex) {
  return knex.schema
    .dropTableIfExists('users')
};
