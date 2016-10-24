if (!process.env.MAKERPASS_CLIENT_ID || !process.env.MAKERPASS_CLIENT_SECRET) {
  require('dotenv').config();
}
var browserify = require('browserify-middleware')
var express = require('express')
var cookieSession = require('cookie-session');
var Path = require('path')
var LESS = require('node-less-endpoint');
var AuthPort = require('./lib/makerpass');
var MP = require('node-makerpass')

var routes = express.Router()

//
// Use cookies to store sessions
//
routes.use(cookieSession({
  name: 'hackerpaste_session',
  secret: 'super duper secret'
}));

//
// Provide a browserified file at a specified path
//
routes.get('/app-bundle.js', browserify('./client/app.js', {
  transform: [
    ['babelify', { presets: ['es2015', 'react'] }]
  ]
}));

routes.get('/style.css', LESS.serve('./client/less/index.less', {
  debug: true,
  watchDir: './client/less'
}));

//
// Use AuthPort for authentication routes.
// Route to /auth/makerpass from the frontend
// to utilize this authentication
//
routes.get('/auth/:service', AuthPort.app);
routes.get('/logout', function(req, res) {
  req.session = null;
  res.redirect('/');
})

// Attempt to authenticate the user then use the API endpoints
// Any authenticated users will have `req.user` and `req.scopes` set
routes.use('/api', MP.authWithSession({ required: false }), function (req, res, next) {
  req.user = req.user || {};
  next();
}, require('./apis'));


//
// Static assets (html, etc.)
//
var assetFolder = Path.resolve(__dirname, '../client/public')
routes.use(express.static(assetFolder))


if (process.env.NODE_ENV !== 'test') {
  //
  // The Catch-all Route
  // This is for supporting browser history pushstate.
  // NOTE: Make sure this route is always LAST.
  //
  routes.get('/*', function(req, res){
    res.sendFile( assetFolder + '/index.html' )
  })

  //
  // We're in development or production mode;
  // create and run a real server.
  //
  var app = express()

  // Parse incoming request bodies as JSON
  app.use( require('body-parser').json() )

  // Mount our main router
  app.use('/', routes)

  // Start the server!
  var port = process.env.PORT || 4000
  app.listen(port)
  console.log("Listening on port", port)
}
else {
  // We're in test mode; make this file importable instead.
  module.exports = routes
}
