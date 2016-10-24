var React = require('react');
var ReactDOM = require('react-dom');

module.exports = (props) => (
  <div className="box">
    <div className="box-title">
      <h5>Groups</h5>
    </div>
    <div className="box-list-container">
      <ul className="box-list">
        {props.groups.map((group, index) => {
          return <li key={group.uid}><a href={`/groups/${group.uid}`}>{group.name}</a></li>
        })}
      </ul>
    </div>
  </div>
)
