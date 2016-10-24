var http = require('axios');

var Pastie = module.exports;

Pastie.create = function (attrs) {
  // TODO: validation
  return http.post('/api/pasties', attrs)
    .then(res => res.data);
}

Pastie.find = function (id) {
  return http.get(`/api/pasties/${id}`)
    .then(res => res.data);
}

Pastie.feed = function () {
  return http.get('/api/pasties')
    .then(res => res.data);
}

Pastie.favorites = function () {
  return http.get('/api/me/favorites')
    .then(res => res.data);
}

Pastie.ownedByUser = function (uid) {
  return http.get(`/api/me/pasties`)
    .then(res => res.data);
}

Pastie.getPublic = function () {
  return http.get('/api/pasties/public')
    .then(res => {
      console.log(res.data);
      return res.data
    });
}
