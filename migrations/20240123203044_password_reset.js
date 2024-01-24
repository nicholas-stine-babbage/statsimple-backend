export const up = function(knex) {
    return knex.schema
      .createTable('password_reset', t => {
        t.uuid('user_id').unique().references('users.id')
        t.string('token')
      })
  };
  
  export const down = function(knex) {
    return knex.schema
      .dropTableIfExists('password_reset')
  };
  