
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.string('id').primary();
    }),
    knex.schema.createTable('groups', function(table) {
      table.string('id').primary();
    }),
    knex.schema.createTable('sessions', function(table) {
      table.string('id').primary();
      table.string('user_id').references('users.id');
    }),
    knex.schema.createTable('pasties', function(table) {
      table.string('id').primary();
      table.string('user_id');
      table.string('title');
      table.text('contents');
      table.string('type', 10);
      table.boolean('public').defaultTo(false);
      table.timestamps(false, true);
    }),
    knex.schema.createTable('tags', function(table) {
      table.increments('id');
      table.string('name');
    }),
    knex.schema.createTable('pasties_groups', function(table) {
      table.string('pastie_id').references('pasties.id');
      table.string('group_id').references('groups.id');
    }),
    knex.schema.createTable('favorites', function(table) {
      table.string('user_id').references('users.id');
      table.string('pastie_id').references('pasties.id');
    }),
    knex.schema.createTable('pasties_tags', function(table) {
      table.string('pastie_id').references('pasties.id');
      table.integer('tag_id').references('tags.id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('pasties_tags'),
    knex.schema.dropTable('favorites'),
    knex.schema.dropTable('pasties_groups'),
    knex.schema.dropTable('tags'),
    knex.schema.dropTable('groups'),
    knex.schema.dropTable('sessions'),
    knex.schema.dropTable('pasties'),
    knex.schema.dropTable('users')
  ]);
};
