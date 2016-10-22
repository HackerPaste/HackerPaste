var http = require('axios');

var Pastie = module.exports;

Pastie.create = function (attrs) {
  // TODO: validation
  return http.post('/api/pasties', attrs);
}

Pastie.find = function (id) {
  return http.get(`/api/pasties/${id}`);
}

Pastie.feed = function () {
  return http.get('/api/pasties');
}

Pastie.favorites = function () {
  return http.get('/api/me/favorites');
}

Pastie.ownedByUser = function (uid) {
  return http.get(`/api/users/${uid}/pasties`);
}

Pastie.getPublic = function () {
  return http.get('/api/pasties/public');
}
