
export const up = function(knex) {
  return knex.schema
    .createTable('trials', t => {
        t.uuid('id')
        t.uuid('user_id')
        t.string('name')
        t.json('data')
        t.json('headers')
        t.integer('treatments')
        t.integer('repetitions')
    })
};

export const down = function(knex) {
  return knex.schema
    .dropTableIfExists('trials')
};