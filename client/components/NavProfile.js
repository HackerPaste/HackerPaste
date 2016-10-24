var React = require('react');
var ReactDOM = require('react-dom');
var page = require('page');

var Link = require('./Link')

module.exports = class NavProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  render() {
    return (
      <div className="user-profile" onClick={e => this.setState({ open: !this.state.open })}>
        <img
          className="avatar"
          src={this.props.user.avatar_url}
        />
        <span className="user-name">{this.props.user.name}</span>
        <ul
          className={`nav-profile-dropdown ${this.state.open ? 'open' : 'closed'}`}
          onClick={e => e.stopPropagation()}
        >
          <li><Link href="/me">My Profile</Link></li>
          <li><Link href="/logout">Logout</Link></li>
        </ul>
      </div>
    )
  }
}
