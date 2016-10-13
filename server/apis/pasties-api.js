var API = require('../lib/api-helpers')
var Pastie = require('../models/pastie')

var PastiesAPI = module.exports = require('express').Router()

PastiesAPI.get('/pasties/:id', function (req, res) {

  Pastie.find( req.params.id )
    .then( API.prep(200, res) )
    .catch( Pastie.NotFound, API.prep(404, res) )
    .catch( API.catchUnexpectedErrors )
})
