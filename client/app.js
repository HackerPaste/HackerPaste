const React = require('react');
const ReactDOM = require('react-dom');

const Auth = require('./lib/auth');
const Nav = require('./components/Nav');
// const Router = require('./components/Router');

const App = () => (
  <div>
    <Nav />
    {/* <Router /> */}
  </div>
);

ReactDOM.render(<App />, document.getElementById('app'));
