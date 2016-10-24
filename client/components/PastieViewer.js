var React = require('react');
var ReactDOM = require('react-dom');
var Pastie = require('../models/pastie');

var PastieActionsAside = require('./PastieActionsAside');

module.exports = class PastieViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      pastie: null
    }
  }

  componentDidMount() {
    Pastie.find(this.props.pastie_id)
      .then(pastie => {
        this.setState({ pastie: pastie, loading: false });
      })
      .catch(err => {
        console.log(err)
        this.setState({ loading: false })
      })
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="content">
            {
              this.state.pastie
                ? <div className="pastie">
                  <h2>{this.state.pastie.title}</h2>
                  <pre>{this.state.pastie.contents}</pre>
                </div>
              : this.state.loading
                ? <div className="spinner"></div>
              : <div className="error">There was an error</div>
            }
          </div>
          <PastieActionsAside
            pastie={this.state.pastie}
            groups={this.props.groups}
            user={this.props.user}
          />
        </div>
      </div>
    )
  }
}
