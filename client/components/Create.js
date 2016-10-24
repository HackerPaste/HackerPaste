var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios')

module.exports =  class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contents: "",
      title: "",
      public: false
    };
    this.handleContentsChange = this.handleContentsChange.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handlePublicChange = this.handlePublicChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleContentsChange(event) {
    this.setState({contents: event.target.value});
  }

  handleTitleChange(event) {
    this.setState({title: event.target.value});
  }

  handlePublicChange(event) {
    this.setState({public: !this.state.public});
  }

  handleSubmit(event) {
    axios({
      method: 'post',
      url: '/api/pasties',
      data: {
        contents: this.state.contents,
        title: this.state.title,
        public: this.state.public
      }
      })
  }

  render() {
    return (
      <div className="container">
        <button type="submit" onClick={this.handleSubmit}>Submit</button>
        <input type="text" className="pastieTitle" placeholder="enter title" onChange={this.handleTitleChange}/>
        <input type="checkbox" className="pastiePublic" checked={this.state.public} onChange={this.handlePublicChange}/>
        <textarea className="text-input" type="text" placeholder="enter text"
            value={this.state.value} onChange={this.handleContentsChange}>
        </textarea>
      </div>
    )
  }

}
