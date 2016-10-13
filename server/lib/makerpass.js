//
// NOTE: This was copied verbatim from https://github.com/reactorcore/authport-makerpass
//       so it might require some modifications before it functions. 
//
var AuthPort = require('authport')
var MakerpassService = require('authport-makerpass')

if (! process.env.MAKERPASS_CLIENT_ID || ! process.env.MAKERPASS_CLIENT_SECRET) {
  throw new Error("Please set MAKERPASS_CLIENT_ID and MAKERPASS_CLIENT_SECRET")
}

AuthPort.registerService('makerpass', MakerpassService)

AuthPort.createServer({
  service: 'makerpass',
  id: process.env.MAKERPASS_CLIENT_ID,
  secret: process.env.MAKERPASS_CLIENT_SECRET,
  callbackURL: process.env.HOST + '/auth/makerpass/callback',
  // scope: 'admin.read admin.write',
})

AuthPort.on('auth', function(req, res, data) {
  console.log("OAuth success!", data)
  req.session.accessToken = data.token
  res.redirect('/')
})

AuthPort.on('error', function(req, res, data) {
  console.log("OAuth failed.", data)
  res.status(500).send({ error: 'oauth_failed' })
})
