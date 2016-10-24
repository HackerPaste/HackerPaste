var http = require('axios');

var Auth = module.exports;

Auth.user = null;
Auth.groups = null;
Auth.authenticate = function () {
  return http.get('/api/me')
    .then(response => {
      Auth.user = response.data.user;
      Auth.groups = response.data.groups;
    })
    .catch(err => {
      Auth.user = null;
      Auth.groups = null;
    });
};
