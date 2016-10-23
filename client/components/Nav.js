var React = require('react');
var ReactDOM = require('react-dom');

const nav = module.exports = (props) => (
  <nav>
    <div className="container">
      <div className="nav-side">
        <a href="/" className="logo"><img src="/assets/hack-reactor-logo.png" /></a>
        <h1 className="title">Hacker Paste</h1>
      </div>
      <form className="search-form">
        <input className="search" type="text" placeholder="Search pasties"></input>
      </form>
      <div className="nav-side">
        <a href="/api/me" className="create-button">CREATE</a>
        <a href="/auth/makerpass" className="sign-in" id="signInBtn">SIGN IN</a>
      </div>
    </div>
  </nav>
)
