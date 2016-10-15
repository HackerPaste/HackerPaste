exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('pasties', function(table) {
      table.increments('id');
      table.string('user_uid'); // Makerpass user_uid
      table.string('title');
      table.text('contents'); // raw text input from user
      table.text('contents_parsed') // For server-side parsing and storing the result
      table.string('file_type', 10); // Potential future for syntax highlighting/parsing
      table.specificType('tags', 'varchar[]'); // array data type in postgres
      table.boolean('public').defaultTo(false); // flag for publicly viewable
      table.timestamps(false, true); // datetime columns with defaults
    }),
    knex.schema.createTable('pasties_subjects', function(table) {
      table.string('pastie_id');
      table.string('subject_uid'); // group_/user_uid from Makerpass, depends on subject_type
      table.string('subject_type'); // 'Group' for now, 'User' and more in the future
    }),
    knex.schema.createTable('favorites', function(table) {
      table.string('user_uid')
      table.string('pastie_id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('favorites'),
    knex.schema.dropTable('pasties_subjects'),
    knex.schema.dropTable('pasties')
  ]);
};
