export const up = function(knex) {
    return knex.schema
      .createTable('stripe', t => {
        t.uuid('user_id').unique().references('users.id')
        t.string('customer_id').unique()
      })
      .createTable('credits', t => {
        t.uuid('user_id').unique().references('users.id')
        t.integer('quantity').defaultsTo(0)
      })
  };
  
  export const down = function(knex) {
    return knex.schema
      .dropTableIfExists('stripe')
  };
  