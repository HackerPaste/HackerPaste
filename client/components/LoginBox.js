var React = require('react');
var ReactDOM = require('react-dom');

var Link = require('./Link');
module.exports = props => (
  <div className="box login-box">
    <Link href="/auth/makerpass">Sign in</Link> to share and favorite pasties!
  </div>
)
