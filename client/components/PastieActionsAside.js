var React = require('react');
var ReactDOM = require('react-dom');

var LoginBox = require('./LoginBox');
var ShareWithBox = require('./ShareWithBox');

module.exports = (props) => {
  if (props.pastie) {
    return (
      <div className="aside">
        {
          props.user
            ? <ShareWithBox groups={props.groups} pastie={props.pastie} />
          : <LoginBox />
        }
      </div>
    )
  }
  return <div />
}
