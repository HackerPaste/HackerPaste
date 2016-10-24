var React = require('react');
var ReactDOM = require('react-dom');

var MyFeedList = require('./MyFeedList')
var MyProfileBox = require('./MyProfileBox')
var MyGroupsBox = require('./MyGroupsBox')

module.exports = (props) => (

  <div className="container">
    <div className="row">

      <div className="aside">
        <MyProfileBox user={props.user}/>
        <MyGroupsBox groups={props.groups}/>
      </div>

      <div className="content">
        <MyFeedList user={props.user}/>
      </div>

    </div>
  </div>
)
