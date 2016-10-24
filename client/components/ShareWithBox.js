var React = require('react');
var ReactDOM = require('react-dom');

var Share = require('../models/share');

module.exports = (props) => (
  <div className="box">
    <div className="box-title">
      <h5>Share With</h5>
    </div>
    <div className="box-list-container">
      <ul className="box-list">
        {
          props.groups.map((group, index) => (
            <Shareable key={index} group={group} pastie_id={props.pastie.id} />
          ))
        }
      </ul>
    </div>
  </div>
)

class Shareable extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      shared: false
    }
    this.handleShare = this.handleShare.bind(this);
  }

  handleShare(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!this.state.shared)
    this.setState({ loading: true });
    Share.create(this.props.pastie_id, {
      subject_type: 'Group',
      subject_uid: this.props.group.uid
    })
    .then(() => {
      this.setState({ loading: false, shared: true })
    })
    .catch(console.log)
  }

  render() {
    return (
      <li className={`shareable ${this.state.shared ? 'shared' : this.state.loading ? 'loading' : ''}`}>
        <a
          href='#'
          onClick={this.handleShare}
        >
          {this.props.group.name}
        </a>
      </li>
    )
  }
}
