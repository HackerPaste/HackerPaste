// Include knex
var db = require('../lib/db');

var Pastie = module.exports;



// For finding a single pastie from a given id
Pastie.find = function (id) {
  return db('pasties').where({id: id}).limit(1)
    .then(function (rows) {
      // if no pastie is found with this id, throw an error
      if (rows.length === 0) { throw new Pastie.NotFound(id) }
      return rows[0]
    });
};

//For getting a feed of pasties that belong to a particular user id
Pastie.feedForUser = function (userId, groupIds, obj ) {
  return db('pasties').join('pasties_subjects', {'pasties_subjects.pastie_id': 'pasties.id'})
    .where(function(){
      this.where({'pasties_subjects.subject_uid': userId, 'pasties_subjects.subject_type': 'User'})
    })
    .orWhere(function(){
      this.where({'pasties_subjects.subject_type': 'Group'})
      .whereIn('pasties_subjects.subject_uid', groupIds)
    })
    .select('pasties.*')
    .orderBy('pasties_subjects.created_at', 'desc')
    // .limit(10)   NUMBER OF PASTIES IN USER FEED STILL UNDECIDED
    
    .then(function(rows){
      return rows;
    });
}


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


Pastie.favoritedByUser = function(id, groupIds){
  return db('favorites').join('pasties', {'pasties.id': 'favorites.pastie_id'})
    .where('favorites.user_uid', id)
    .andWhere(function () {
      this.where('pasties.public', true)
        .orWhere('pasties.user_uid', id)
        .orWhere(function () {
          this.whereExists(function () {
            this.from('pasties_subjects')
            .whereRaw('pasties_subjects.pastie_id = pasties.id')
            .andWhere(function () {
              this.where(function() {
                this.where('subject_type', 'User')
                .andWhere('subject_uid', id)
              })
              .orWhere(function () {
                this.where('subject_type', 'Group')
                .whereIn('subject_uid', groupIds)
              })
            })
          })
        })
    })
    .select('pasties.*')
    .then(function(rows) {
      return rows;
    })
}


// Error class for when a pastie isn't found
Pastie.NotFound = class NotFound extends Error {
  constructor(id) {
    super()
    this.name = 'NotFound'
    this.message = 'pastie_not_found'
    this.details = { id: id }
  }
};
