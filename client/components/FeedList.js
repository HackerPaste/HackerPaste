var React = require('react');
var ReactDOM = require('react-dom');

// var Pastie = require('../models/pastie')

const FeedList = module.exports = (props) => {
  return <div className="feed">
    <ul className="tab-nav">
      <li><a href="#" className="active">Feed</a></li>
      <li><a href="#" className="">Favorites</a></li>
      <li><a href="#" className="">Public</a></li>
    </ul>

    <ul className="feed-list">
      {/*props.pasties.map(pastie => {
        <FeedListItem
          pastie={pastie}
        />
    })*/}
      <li>TEST</li>
    </ul>

  </div>
}

// const FeedListItem = module.exports = (props) => (
//   <li><a href="#">{props.title}</a> posted by <a href="#">{props.user}</a>
//     <p>{props.content}</p>
//   </li>
// )
