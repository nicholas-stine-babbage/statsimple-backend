export const up = function(knex) {
    return knex.schema
      .dropTableIfExists('credits')
      .createTable('credits', t => {
        t.uuid('id').primary()
        t.uuid('user_id').references('users.id')
        t.string('token')
        t.enum('status', ['active', 'used', 'expired'])
        t.timestamps(true, true)
      })

      .alterTable('users', t => {
        t.timestamps(true, true)
      })
  };
  
  export const down = function(knex) {
    return knex.schema
      .dropTableIfExists('credits')
  };
  