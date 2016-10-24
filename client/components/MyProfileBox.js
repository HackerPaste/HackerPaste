var React = require('react');
var ReactDOM = require('react-dom');

module.exports = (props) => (
  <div className="box">
    <div className="box-title">
      <img className="avatar" src={props.user.avatar_url}/>
      <h5>{props.user.name}</h5>
    </div>
  </div>
)
