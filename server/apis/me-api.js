var API = require('../lib/api-helpers')
var Pastie = require('../models/pastie')

var MeAPI = module.exports = require('express').Router();

// Require authentication for all /me routes
MeAPI.use('/me', API.requireAuth);

// Fetch groups, include the groups with the user in the response
MeAPI.get('/me', API.fetchGroups, function(req, res) {
  res.send({ user: req.user, groups: req.groups });
});

MeAPI.get('/me/pasties', function(req, res) {
  Pastie.findForUser(req.user.uid)
    .then(API.prep(200, res))
    .catch(API.catchUnexpectedErrors);
})

// Requires the `Pastie.favorites()` method to get a list of favorites
MeAPI.get('/me/favorites', function(req, res) {
  Pastie.favorites(req.user.uid)
    .then(API.prep(200, res))
    .catch(API.catchUnexpectedErrors);
});

// Requires `Pastie.favorite()` as an action to save a favorite
MeAPI.put('/me/favorites/pasties/:pastie_id', function(req, res) {
  Pastie.favorite(req.params.pastie_id, req.user.uid)
    .then(API.prep(201, res))
    .catch(Pastie.NotFound, API.prep(404, res))
    .catch(API.catchUnexpectedErrors);
});

// Requires `Pastie.unfavorite()` as an action to remove a favorite
MeAPI.delete('/me/favorites/pasties/:pastie_id', function(req, res) {
  Pastie.unfavorite(req.params.pastie_id, req.user.uid)
    .then(API.prep(200, res))
    .catch(Pastie.NotFound, API.prep(404, res))
    .catch(API.catchUnexpectedErrors);
})
