var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios')

module.exports =  class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {value: ""};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert("Text field value is: '" + this.state.value + "'");
    //TODO
    console.log("this.state.value: ", this.state.value)
    axios({
      method: 'post',
      url: '/api/pasties',
      data: this.state.value //ERROR
      })
  }

  render() {
    return <div className="container">
    <button type="submit" onClick={this.handleSubmit}>Submit</button>
    <textarea className="text-input" type="text" placeholder="enter text"
      value={this.state.value} onChange={this.handleChange}>
    </textarea>
  </div>
  }

}
