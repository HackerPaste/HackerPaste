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
      <div className="box">
      <div className="box-title">
        <h5>My Pasties</h5>
      </div>
      <div className="box-list-container">
        <ul className="box-list">
          {
            this.state.pasties.map(pastie => {
              return <li><Link href={`/pasties/${pastie.id}`}>{pastie.title}</Link>
                <p>{pastie.contents}</p>
              </li>
            })
          }
        </ul>
      </div>
      </div>
    )
  }
}
