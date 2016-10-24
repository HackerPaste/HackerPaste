var React = require('react');
var ReactDOM = require('react-dom');

var NavProfile = require('./NavProfile')

const nav = module.exports = (props) => (
  <nav>
    <div className="container">
      <div className="nav-side">
        <a href="/" className="logo"><img src="/assets/hack-reactor-logo.png" /></a>
        <h1 className="title">Hacker Paste</h1>
      </div>
      {/*
        <form className="search-form">
        <input className="search" type="text" placeholder="Search pasties"></input>
        </form>
      */}
      <div className="nav-side">
        <a href="/create" className="create-button">New Pastie</a>
        {
          props.user
            ? <NavProfile user={props.user} />
          : <a href="/auth/makerpass" className="sign-in" id="signInBtn">Sign In</a>
        }
      </div>
    </div>
  </nav>
)
