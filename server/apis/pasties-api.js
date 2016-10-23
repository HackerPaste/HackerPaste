var API = require('../lib/api-helpers')
var Pastie = require('../models/pastie')
var Share = require('../models/share')
var PastiesAPI = module.exports = require('express').Router()

PastiesAPI.get('/pasties/:id', API.fetchGroups, function (req, res) {
  Pastie.find(req.params.id, req.user.uid, req.groups.map(Object.pick('uid')))
    .then(API.prep(200, res))
    .catch(Pastie.NotFound, API.prep(404, res))
    .catch(Pastie.PermissionDenied, API.prep(403, res))
    .catch(API.catchUnexpectedErrors)
})

PastiesAPI.get('/pasties', API.requireAuth, API.fetchGroups, function(req, res) {
  Pastie.feedForUser( req.user.uid, req.groups.map(Object.pick('uid')))
    .then( API.prep(200, res) )
    .catch( Pastie.NotFound, API.prep(404, res) )
    .catch( API.catchUnexpectedErrors )
})

PastiesAPI.get('/pasties/public', function(req, res) {
  Pastie.getPublic()
    .then(API.prep(200, res))
    .catch( API.catchUnexpectedErrors )
});

PastiesAPI.post('/pasties', function(req, res) {
  Pastie.create(req.body, req.user.uid)
    .then(API.prep(201, res))
    .catch(Pastie.InvalidFormat, API.prep(400, res))
    .catch(API.catchUnexpectedErrors)
});

PastiesAPI.put(
  '/groups/:group_uid/pasties/:pastie_id',
  API.requireAuth,
  API.fetchGroups,
  function (req, res) {
    // create an array of group_ids that the user can share with
    var shareableGroups = req.groups.reduce((res, group) => {
      if (group.user_role === 'instructor' || group.user_role === 'fellow') {
        res.push(group.uid)
      }
    }, []);

    if (~shareableGroups.indexOf(req.params.group_uid)) {
      Share.create(req.params.pastie_id, [{
        subject_type: 'Group',
        subject_uid: req.params.group_uid
      }])
      .then(() => res.status(200).send())
      .catch(Pastie.NotFound, API.prep(404, res))
      .catch(API.catchUnexpectedErrors)
    } else {
      API.prep(403, res)(new Pastie.PermissionDenied());
    }
  }
);

PastiesAPI.delete(
  '/groups/:group_uid/pasties/:pastie_id',
  API.requireAuth,
  API.fetchGroups,
  function (req, res) {
    var shareableGroups = req.groups.reduce((res, group) => {
      if (group.user_role === 'instructor' || group.user_role === 'fellow') {
        res.push(group.uid)
      }
    }, []);

    if (~shareableGroups.indexOf(req.params.group_uid)) {
      Share.delete(req.params.pastie_id, [{
        subject_type: 'Group',
        subject_uid: req.params.group_uid
      }])
      .then(() => res.status(200).send())
      .catch(API.catchUnexpectedErrors)
    } else {
      API.prep(403, res)(new Pastie.PermissionDenied());
    }
  }
);
