exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('pasties_subjects', function (table) {
      table.timestamp('created_at').defaultTo(knex.fn.now());
    }),
    knex.schema.table('favorites', function (table) {
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('pasties_subjects', function (table) {
      table.dropColumn('created_at');
    }),
    knex.schema.table('favorites', function (table) {
      table.dropColumn('created_at');
    })
  ]);
};
