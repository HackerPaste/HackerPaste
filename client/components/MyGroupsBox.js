var React = require('react');
var ReactDOM = require('react-dom');

const myGroupsBox = module.exports = (props) => (
  <div className="box">
    <div className="box-title">
      <h5>Groups</h5>
    </div>
    <div className="box-list-container">
      <ul className="box-list">
        {/*props.map(group => {
          <li><a href="#">{group}</a></li>
        })*/}
        <li>TEST</li>
      </ul>
    </div>
  </div>
)
