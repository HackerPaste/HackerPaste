var http = require('axios');

var Share = module.exports;

Share.create = function (pastie_id, subject) {
  // TODO: finalize endpoint
  return http.put(`/api/${subject.subject_type}s/${subject.subject_uid}/pasties/${pastie_id}`)
    .then(res => res.data);
};

Share.delete = function (pastie_id, subject) {
  // TODO: finalize endpoint
  return http.delete(`/api/${subject.subject_type}s/${subject.subject_uid}/pasties/${pastie_id}`)
    .then(res => res.data);
};
