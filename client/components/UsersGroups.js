var React = require('react');
var ReactDOM = require('react-dom');

var FeedList = require('./FeedList')
var MyProfileBox = require('./MyProfileBox')
var MyGroupsBox = require('./MyGroupsBox')

const UsersGroups = module.exports = (props) => (

  <div className="container">
    <div className="row">

      <div className="aside">
        <MyProfileBox />
        <MyGroupsBox />
      </div>

      <div className="content">
        <FeedList />
      </div>

    </div>
  </div>
)
