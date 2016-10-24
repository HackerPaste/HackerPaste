var React = require('react');
var ReactDOM = require('react-dom');
var page = require('page');

var Link = module.exports = (props) => (
  <a {...props} onClick={(e) => (
    e.preventDefault(), page(props.href)
  )}>{props.children ? props.children : ''}</a>
)
Link.propTypes = {
  href: React.PropTypes.string.isRequired
}
