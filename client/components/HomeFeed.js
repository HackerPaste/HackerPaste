var React = require('react');
var ReactDOM = require('react-dom');

var FeedList = require('./FeedList')
var MyPastiesBox = require('./MyPastiesBox')
var MyGroupsBox = require('./MyGroupsBox')

module.exports = (props) => (
  <div className="container">
    <div className="row">
      <div className="content">
        <FeedList user={props.user} selected={props.selected ? props.selected : 'Feed'} />
      </div>
      {
        props.user ?
          <div className="aside">
            <MyGroupsBox groups={props.groups} />
            <MyPastiesBox user={props.user} />
          </div>
        :
        <div className="aside">
          {/*<SideLoginBox />*/}
        </div>
      }
    </div>
  </div>
)
