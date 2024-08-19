export const up = function(knex) {
    return knex.schema
      .createView('user_credits', (v) => {
        v.columns(['user_id', 'name']) // , 'used', 'expired'
        v.as(knex('users as u')
            .join('credits as c', 'u.id', 'c.user_id')
            .select('u.id as user_id', 'name', 'c.status')
            .count('c.status')
            .groupBy('u.id', 'name', 'c.status')
        )
      })
  };
  
  export const down = function(knex) {
    return knex.schema
      .dropViewIfExists('user_credits')
  };
  