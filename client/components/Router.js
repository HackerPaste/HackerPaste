var React = require('react')
var ReactDOM = require('react-dom')
var route = require('page')
var HomeFeed = require('./HomeFeed')
var UsersGroups = require('./UsersGroups')
var Create = require('./Create')
var View = require('./View')

module.exports =  class Router extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      component: HomeFeed
    }
  }

  componentDidMount() {
    var self = this;

    route('/', function () {
      self.setState({ component: HomeFeed });
    });

    route('/users', function () {
      self.setState({ component: UsersGroups });
    });

    route('/create', function () {
      self.setState({ component: Create });
    });

    route('/view', function () {
      self.setState({ component: View });
    });

    route.start();
  }

  render () {
    var Component = this.state.component
    return <Component />
  }

}
