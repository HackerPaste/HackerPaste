require('./extras')
var API = module.exports
var MP = require('node-makerpass');

API.prep = function (statusCode, response) {
  return function (input) {
    response.status(statusCode).send(input)
  }
}

// fetch groups for a user and attach them to the `req` object
API.fetchGroups = function (req, res, next) {
  MP.me.groups(req.makerpassToken)
    .then(groups => {
      req.groups = groups;
      next();
    })
    .catch( err => {
      req.groups = [];
      next()
    });
}

// Use this to verify that a user has been logged in
// each of these properties on the `req` object should be
// set upon successful makerpass authentication
API.requireAuth = function(req, res, next) {
  if (req.user && req.scopes && req.makerpassToken) {
    return next();
  }
  res.status(401).send( { reason: 'not_logged_in' } );
};
