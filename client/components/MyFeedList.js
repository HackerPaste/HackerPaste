var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('./Link')
var Pastie = require('../models/pastie')

module.exports = class FeedList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      pasties: [],
    }
  }

  componentDidMount() {
    Pastie.ownedByUser(this.props.user.uid)
      .then(pasties => {
        this.setState({ pasties: pasties});
      })
      .catch(console.log);
  }

  render () {
    return (
      <div className="feed">
      <h3>My Pasties</h3>
      <ul className="feed-list">
        {
          this.state.pasties.map(pastie => {
            return <li><Link href='#'>{pastie.title}</Link>
              <p>{pastie.contents}</p>
            </li>
          })
        }
      </ul>
      </div>
    )
  }
}
