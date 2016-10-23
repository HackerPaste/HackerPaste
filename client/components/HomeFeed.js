var React = require('react');
var ReactDOM = require('react-dom');

var FeedList = require('./FeedList')
var MyPastiesBox = require('./MyPastiesBox')
var MyGroupsBox = require('./MyGroupsBox')

const HomeFeed = module.exports = (props) => {

  return <div className="container">
    <div className="row">
      <div className="content">
        <FeedList /> //FeedList link
      </div>

      <div className="aside">
        <MyGroupsBox /> //GroupBox link
        <MyPastiesBox />
      </div>

    </div>
  </div>

}
