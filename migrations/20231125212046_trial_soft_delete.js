export const up = function(knex) {
    return knex.schema
        .alterTable('trials', t => {
            t.enum('status', ['active', 'inactive']).defaultTo('active')
        })
  };
  
  export const down = function(knex) {
    return knex.schema
        .alterTable('trials', t => {
            t.dropColumn('status')
        })
  };