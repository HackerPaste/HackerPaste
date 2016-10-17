var PastiesAPI = require('./pasties-api');
var MeAPI = require('./me-api');
var API = require('../lib/api-helpers');

var APIRouter = require('express').Router();
module.exports = APIRouter;

APIRouter.use('/', PastiesAPI);
APIRouter.use('/', MeAPI);
