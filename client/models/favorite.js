var http = require('axios');

var Favorite = module.exports;

Favorite.create = function (id) {
  return http.put(`/api/me/favorites/pasties/${id}`);
};

Favorite.delete = funciton (id) {
  return http.delete(`/api/me/favorites/pasties/${id}`);
};
