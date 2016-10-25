// Include knex
var db = require('../lib/db');
var Promise = require('bluebird');

var Pastie = module.exports;

// TODO: Find multiple pasties by user, group, tags, and/or search terms

// For finding a single pastie from a given id
Pastie.find = function (pastie_id, user_uid, group_uids) {
  return db('pasties').where('id', pastie_id)
    .then(rows => {
      if (!rows.length) {
        throw new Pastie.NotFound(pastie_id);
      }

      var pastie = rows[0]
      var oneMonth = 30 * 24 * 60 * 60 * 1000
      if(pastie.user_uid === null && pastie.created_at < new Date().getTime() - (oneMonth)) {
        return db('pasties').where('id', pastie_id).del()
        .then(function() {
          throw new Pastie.NotFound(pastie_id)
        })
      }

      if (pastie.public || pastie.user_uid === user_uid) {
        return pastie;
      }

      if (!user_uid) {
        throw new Pastie.PermissionDenied();
      }

      return db('pasties_subjects').where('pastie_id', pastie_id)
        .andWhere(function () {
          this.where(function () {
            this.where('subject_type', 'User')
              .andWhere('subject_uid', user_uid)
          })
          .orWhere(function () {
            this.where('subject_type', 'Group')
              .whereIn('subject_uid', group_uids)
          });
        }).then(rows => {
          if (!rows.length) {
            throw new Pastie.PermissionDenied();
          }
          return pastie;
        });
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

Pastie.create = function (attrs, user_uid){
  if(attrs === undefined || attrs.title === undefined || attrs.contents === undefined){
    return Promise.reject(new Pastie.InvalidFormat());
  }
  if(user_uid === undefined){attrs.public = true}
  if(typeof attrs.public !== 'boolean'){attrs.public = true}
  if(attrs.file_type === undefined){attrs.file_type = 'txt'}
  if(attrs.tags === undefined){attrs.tags = []}
    return db('pasties').returning('*').insert({
    user_uid: user_uid,
    title: attrs.title,
    contents: attrs.contents,
    contents_parsed: attrs.contents,
    file_type: attrs.file_type,
    tags: attrs.tags,
    public: attrs.public,
  })
    .then(function (rows) {
      return rows[0];
    })
};


Pastie.getPublic = function () {
  return db('pasties').where({public: true}).limit(4).orderBy('id', 'desc')
    .then(function (rows) {
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


Pastie.ownedByUser = function (user_uid) {
  if(user_uid === undefined){throw new Pastie.InvalidArgument(user_uid)}
  return db('pasties').where({user_uid: user_uid})
    .then(function (rows) {
      return rows;
    });
};


Pastie.sharedWithGroup = function (group_uid) {
  return db('pasties').join('pasties_subjects', { 'pasties.id': 'pasties_subjects.pastie_id' })
    .where('pasties_subjects.subject_type', 'Group')
    .andWhere('pasties_subjects.subject_uid', group_uid)
    .select('pasties.*')
    .then(rows => rows);
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


Pastie.InvalidArgument = class InvalidArgument extends Error {
  constructor(argName) {
    super()
    this.name = 'InvalidArgument'
    this.message = 'invalid_argument'
    this.details = { reason: argName + ' is required' }
  }
};

Pastie.PermissionDenied = class PermissionDenied extends Error {
  constructor() {
    super()
    this.name = 'PermissionDenied'
    this.message = 'permission_denied'
    this.details = { reason: 'not_authorized' }
  }
};

Pastie.InvalidFormat = class InvalidFormat extends Error {
  constructor(user_uid) {
    super()
    this.name = 'InvalidFormat'
    this.message = 'invalid_format'
    this.details = { reason: 'invalid_request_format' }
  }
};
