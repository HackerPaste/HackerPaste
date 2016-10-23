var React = require('react');
var ReactDOM = require('react-dom');

const myPastiesBox = module.exports = (props) => (
  <div className="box">
    <div className="box-title">
      <h5>My Pasties</h5>
    </div>
    <div className="box-list-container">
      <ul className="box-list">
        {/*props.pasties.map(pastie => {
          <li><a href="#">{pastie.title}</a></li>
        })*/}
        <li>TEST</li>
      </ul>
    </div>
  </div>
)
