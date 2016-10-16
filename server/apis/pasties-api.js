var API = require('../lib/api-helpers')
var Pastie = require('../models/pastie')

var PastiesAPI = module.exports = require('express').Router()

PastiesAPI.get('/pasties/:id', function (req, res) {

  Pastie.find( req.params.id )
    .then( API.prep(200, res) )
    .catch( Pastie.NotFound, API.prep(404, res) )
    .catch( API.catchUnexpectedErrors )
})


PastiesAPI.get('/pasties', function(req, res) {
  
  Pastie.feedForUser( req.user.uid, req.query )
    .then( API.prep(200, res) )
    .catch( Pastie.NotFound, API.prep(404, res) )
    .catch( API.catchUnexpectedErrors )
})


PastiesAPI.get('/pasties/public', function(req, res) {
  
  Pastie.getPublic( req.query )
    .then( API.prep(200, res) )
    .catch( Pastie.NotFound, API.prep(404, res) )
    .catch( API.catchUnexpectedErrors )
})

PastiesAPI.post('/pasties', function(req, res) {
  
  Pastie.create( req.body )
    .then( API.prep(201, res) )
    .catch( Pastie.InvalidFormat, API.prep(400, res) )
    .catch( API.catchUnexpectedErrors)
})

// PastiesAPI.post('/groups/:id/pasties') {

// 	Pastie.create(req.body)
// 		.then(API.prep(200, res))
// 		.catch( API.catchUnexpectedErrors)
// }