var React = require('react');
var ReactDOM = require('react-dom');
var Link = require('./Link');
var Pastie = require('../models/pastie');

module.exports = class FeedList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      pasties: [],
    }
  }

  componentDidMount() {
    Pastie.ownedByUser(this.props.user.uid)
      .then(pasties => {
        this.setState({ loading: false, pasties: pasties });
      })
      .catch(console.log);
  }

  render () {
    return (
      <div className="feed">
        <h3>My Pasties</h3>
        {
          this.state.loading ?
            <div className="spinner"></div>
          : (
            <ul className="feed-list">
              {
                this.state.pasties.map(pastie => {
                  return <li key={pastie.id}><Link href={`/pasties/${pastie.id}`}>{pastie.title}</Link>
                    <div className="preview">{pastie.contents}</div>
                  </li>
                })
              }
            </ul>
          )
        }
      </div>
    )
  }
}
