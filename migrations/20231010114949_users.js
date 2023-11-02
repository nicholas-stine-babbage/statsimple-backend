export const up = function(knex) {
  return knex.schema
    .createTable('users', t => {
        t.uuid('id')
        t.string('email')
        t.string('passhash')
        t.string('name')
        t.string('business')
  })
};

export const down = function(knex) {
  return knex.schema
    .dropTableIfExists('users')
};
