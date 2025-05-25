export const up = function(knex) {
    return knex.schema
      .createView('user_credits', (v) => {
        v.columns(['user_id']) // , 'used', 'expired'
        v.as(knex('users as u')
            .join('credits as c', 'u.id', 'c.user_id')
            .join('stripe as s', 'u.id', 's.user_id')
            .select('u.id as user_id', 's.customer_id', 'email', 'name', 'c.status')
            .count('c.status')
            .groupBy('u.id', 's.customer_id', 'u.email', 'u.name', 'c.status')
        )
      })
  };
  
  export const down = function(knex) {
    return knex.schema
      .dropViewIfExists('user_credits')
  };
  