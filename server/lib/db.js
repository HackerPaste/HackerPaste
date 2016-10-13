var config = require('../../knexfile.js')

// Configure knex with the correct environment configuration
var env = process.env.NODE_ENV || 'development'
var db = require('knex')(config[env])

// Export the db object, which will be able to make database connections
module.exports = db

// Function for your testing suite
db.deleteEverything = function () {
  // Do nothing if we're not in the test suite
  if (env !== 'test') return Promise.reject();
  
  // If we're testing, empty our tables
  return Promise.all([
    db('favorites').truncate(),
    db('pasties_groups').truncate(),
    db('pasties_tags').truncate(),
    db('pasties').truncate(),
    db('users').truncate(),
    db('groups').truncate(),
    db('tags').truncate()
  ]);
}
