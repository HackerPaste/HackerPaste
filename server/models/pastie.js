// Include knex
var db = require('../lib/db');

var Pastie = module.exports;

// TODO: Find multiple pasties by user, group, tags, and/or search terms

// For finding a single pastie from a given id
Pastie.find = function (id) {
  return db('pasties').where({id: id}).limit(1)
    .then(function (rows) {
      // if no pastie is found with this id, throw an error
      if (rows.length === 0) { throw new Pastie.NotFound(id) }
      return rows[0]
    });
};


Pastie.create = function (attrs){
  return db('pasties').returning('*').insert({
    user_uid: attrs.user_uid,
    title: attrs.title,
    contents: attrs.contents,
    contents_parsed: 'TODO',
    file_type: attrs.file_type,
    tags: attrs.tags,
    public: attrs.public,
  })
    .then(function (rows) {
      return rows[0];
    })
};


Pastie.public = function () {
  return db('pasties').where({public: true}).limit(4).orderBy('id', 'desc')
    .then(function (rows) {
      
        rows.forEach(function(row){
          console.log(row.contents);
        });
      return rows;
    });
};





// Error class for when a pastie isn't found
Pastie.NotFound = class NotFound extends Error {
  constructor(id) {
    super()
    this.name = 'NotFound'
    this.message = 'pastie_not_found'
    this.details = { id: id }
  }
};
