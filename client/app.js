var React = require('react')
var ReactDOM = require('react-dom')
var route = require('page')

var Auth = require('./lib/auth');
var Nav = require('./components/Nav');
var Link = require('./components/Link');
var HomeFeed = require('./components/HomeFeed');
var PastieViewer = require('./components/PastieViewer');
var Create = require('./components/Create');
var Me = require('./components/Users');
var Groups = require('./components/Groups');

class Router extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      component: <div />,
      firstLoad: true
    }
  }

  componentDidMount() {
    var self = this;

    route((ctx, next) => {
      if(this.state.firstLoad) {
        Auth.authenticate()
        .then(() => {
          ctx.user = Auth.user;
          ctx.groups = Auth.groups;
          this.setState({
            firstLoad: false,
            user: Auth.user,
            groups: Auth.groups
          });
          next();
        })
      } else {
        ctx.user = Auth.user;
        ctx.groups = Auth.groups;
        next();
      }
    });

    route('/', ctx => {
      if (!ctx.user) {
        return route.redirect('/public');
      }
      this.setState({
        component: <HomeFeed user={ctx.user} groups={ctx.groups} />
      });
    });

    route('/favorites', ctx => {
      this.setState({
        component: <HomeFeed user={ctx.user} groups={ctx.groups} selected='Favorites' />
      });
    });

    route('/public', ctx => {
      this.setState({
        component: <HomeFeed user={ctx.user} groups={ctx.groups} selected='Public' />
      });
    });

    route('/pasties/:pastie_id', ctx => {
      this.setState({
        component: <PastieViewer user={ctx.user} pastie_id={ctx.params.pastie_id} />
      })
    });

    route('/me', ctx => {
      this.setState({
        component: <Me user={ctx.user} groups={ctx.groups} />
      })
    });

    route('/groups/:group_id', ctx => {
      var group = ctx.groups.filter(v => {
        return v.uid === ctx.params.group_id
      })[0]
      this.setState({
        component: <Groups group={group} />
      })
    });

    route('/create', ctx => {
      this.setState({
        component: <Create user={ctx.user} groups={ctx.groups} />
      });
    });

    route.start();
  }

  render () {
    if (this.state.firstLoad) {
      return <div />
    }
    return (
      <div className="main">
        <Nav user={this.state.user} groups={this.state.groups} />
        {this.state.component}
      </div>
    )
  }

}

ReactDOM.render(<Router />, document.getElementById('app'));
