var API = require('../lib/api-helpers')
var Pastie = require('../models/pastie')
var Favorite = require('../models/favorite')

var MeAPI = module.exports = require('express').Router();

// Require authentication for all /me routes
// Include the groups for all /me routes
MeAPI.use('/me', API.requireAuth, API.fetchGroups);

// Fetch groups, include the groups with the user in the response
MeAPI.get('/me', function(req, res) {
  res.send({
    user: req.user,
    groups: req.groups.map(Object.omit('info', 'school_uid'))
  });
});

MeAPI.get('/me/pasties', function(req, res) {
  Pastie.feedForUser(req.user.uid, req.groups.map(Object.pick('uid')))
    .then(API.prep(200, res))
    .catch(API.catchUnexpectedErrors);
})

// Requires the `Pastie.favorites()` method to get a list of favorites
MeAPI.get('/me/favorites', function(req, res) {
  Pastie.favoritedByUser(req.user.uid, req.groups.map(Object.pick('uid')))
    .then(API.prep(200, res))
    .catch(API.catchUnexpectedErrors);
});


MeAPI.put('/me/favorites/pasties/:pastie_id', function(req, res) {
  Favorite.create(req.params.pastie_id, req.user.uid, req.groups.map(Object.pick('uid')))
    .then(API.prep(200, res))
    .catch(Pastie.NotFound, API.prep(404, res))
    .catch(API.catchUnexpectedErrors);
});


MeAPI.delete('/me/favorites/pasties/:pastie_id', function(req, res) {
  Favorite.delete(req.params.pastie_id, req.user.uid)
    .then(API.prep(200, res))
    .catch(Pastie.NotFound, API.prep(404, res))
    .catch(API.catchUnexpectedErrors);
})
