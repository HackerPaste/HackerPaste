var http = require('axios');

var Share = module.exports;

Share.create = function (id, subjects) {
  // TODO: finalize endpoint
  return http.put(`/api/shares/pasties/${id}`, subjects);
};

Share.delete = funciton (id) {
  // TODO: finalize endpoint
  return http.delete(`/api/shares/pasties/${id}`);
};
