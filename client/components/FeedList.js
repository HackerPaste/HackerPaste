var React = require('react');
var ReactDOM = require('react-dom');

var Pastie = require('../models/pastie')
var Link = require('./Link')

module.exports = class FeedList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.loading = false;
    this.state.pasties = [];

    this.changeTab = this.changeTab.bind(this);
    this.tabs = [];

    if (props.user) {
      this.tabs.push({
        text: 'Feed',
        link: '/',
        fetch: Pastie.feed,
      });
      this.tabs.push({
        text: 'Favorites',
        link: '/favorites',
        fetch: Pastie.favorites,
      });
    }

    this.tabs.push({
      text: 'Public',
      link: '/public',
      fetch: Pastie.getPublic,
    });
  }

  componentDidMount() {
    this.changeTab(this.tabs.filter(tab => tab.text === this.props.selected)[0])
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected !== this.props.selected) {
      this.changeTab(this.tabs.filter(tab => tab.text === nextProps.selected)[0])
    }
  }

  changeTab(tab) {
    this.setState({ selected: tab.text, loading: true });
    tab.fetch(this.props.user ? this.props.user.uid : '')
      .then(pasties => {
        this.setState({ pasties: pasties, loading: false });
      })
      .catch(console.log);
  }

  render() {
    return (
      <div className="feed">
        <ul className="tab-nav">
          {
            this.tabs.map(tab => (
              <li key={tab.text}>
                <Link
                  href={tab.link}
                  className={tab.text === this.props.selected ? 'active' : ''}
                >
                  {tab.text}
                </Link>
              </li>
            ))
          }
        </ul>
        {
          this.state.loading
            ? (<div className="spinner"></div>)
          :(<ul className="feed-list">
            {
              this.state.pasties.length
                ? this.state.pasties.map(pastie => <FeedListItem key={pastie.id} pastie={pastie} />)
              : <li>There are no pasties in this feed</li>
            }
          </ul>)
        }

      </div>
    )
  }
}

const FeedListItem = ({pastie}) => (
  <li><Link href={`/pasties/${pastie.id}`}>{pastie.title}</Link>
    <p>{pastie.contents}</p>
  </li>
)
