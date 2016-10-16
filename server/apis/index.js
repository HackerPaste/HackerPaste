var PastiesAPI = require('./pasties-api');
var MeAPI = require('./me-api');

var APIRouter = require('express').Router();
module.exports = APIRouter;

APIRouter.use('/me', MeAPI);
APIRouter.use('/', PastiesAPI);
