
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('pasties_subjects', function (table) {
      table.dropColumn('pastie_id');
    }).then(() => knex.schema.table('pasties_subjects', function (table) {
      table.integer('pastie_id');
      table.foreign('pastie_id').references('pasties.id');
    })),
    knex.schema.table('favorites', function (table) {
      table.dropColumn('pastie_id');
    }).then(() => knex.schema.table('favorites', function (table) {
      table.integer('pastie_id');
      table.foreign('pastie_id').references('pasties.id');
    }))
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('pasties_subjects', function (table) {
      table.dropForeign('pastie_id');
      table.dropColumn('pastie_id');
    }).then(() => knex.schema.table('pasties_subjects', function (table) {
      table.string('pastie_id');
    })),
    knex.schema.table('favorites', function (table) {
      table.dropForeign('pastie_id');
      table.dropColumn('pastie_id');
    }).then(() => knex.schema.table('favorites', function (table) {
      table.string('pastie_id');
    }))
  ]);
};
