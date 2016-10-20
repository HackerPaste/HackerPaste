var db = require('../lib/db');

var Favorite = module.exports;

Favorite.create = function(pastie_id, user_id){
  return db('favorites').insert({
    user_uid: user_id,
    pastie_id: pastie_id,

  }).then(result => result);
}

Favorite.delete = function(pastie_id, user_id){
  return db('favorites').where({
  user_uid: user_id,
  pastie_id: pastie_id,
  }).del().then(result => result);
}