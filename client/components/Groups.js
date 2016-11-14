var React = require('react');
var ReactDOM = require('react-dom');

var MyFeedList = require('./MyFeedList')
var MyProfileBox = require('./MyProfileBox')
var MyGroupsBox = require('./MyGroupsBox')

var Link = require('./Link')
var Pastie = require('../models/pastie')

module.exports = class FeedList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      pasties: [],
      loading: false
    }
  }

  componentDidMount() {
    this.setState({ loading:true})
    Pastie.getSharedWithGroup(this.props.group.uid)
      .then(pasties => {
        this.setState({ pasties: pasties, loading:false});
      })
      .catch(console.log);
  }

  render() {
    return (
      <div className="container">
        <div className="row">

          <div className="aside">
            <div className="box">
              <div className="box-title">
                <h3>{this.props.group.name}</h3>
              </div>
            </div>
            {/*TO DO: Add box for users in group*/}
          </div>

          <div className="content">
            <div className="feed">
              <h3>Group Pasties</h3>
              <ul className="feed-list">
                {
                  this.state.loading
                  ? (<div className="spinner"></div>)
                  :(<ul className="feed-list">
                    {
                      this.state.pasties.length
                      ? this.state.pasties.map(pastie =>
                        <li key={pastie.id}><Link href={`/pasties/${pastie.id}`}>{pastie.title}</Link>
                          <div className="preview">{pastie.contents}</div>
                        </li>)
                      : <li>There are no pasties in this feed</li>
                    }
                  </ul>)
                }
              </ul>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
