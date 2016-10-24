var React = require('react');
var ReactDOM = require('react-dom');
var axios = require('axios')
var route = require('page')

module.exports =  class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contents: "",
      title: "",
      public: false,
      loading: false
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
    this.setState({loading: true})
    axios({
      method: 'post',
      url: '/api/pasties',
      data: {
        contents: this.state.contents,
        title: this.state.title,
        public: this.state.public
      }
      })
      .then(function(pastie) {
        console.log("paste: ", pastie.data.id)
        route.redirect(`/pasties/${pastie.data.id}`)
      })
      .catch(function(err) {
        this.setState({loading: false})
        console.log(err)
      })
  }

  render() {
    return (
      <div className="row">
        <div className="content">

          <input disabled={this.state.loading} type="text" className="pastieTitle" placeholder="enter title" onChange={this.handleTitleChange}/>
          <input disabled={this.state.loading} type="checkbox" className="pastiePublic" checked={this.state.public} onChange={this.handlePublicChange}/>
            <textarea disabled={this.state.loading} className="text-input" type="text" placeholder="enter text"
                value={this.state.value} onChange={this.handleContentsChange}>
            </textarea>
        </div>
        <div className="aside">
          <button disabled={this.state.loading} type="submit" className="pastieSubmit" onClick={this.handleSubmit}>Submit</button>
        </div>
      </div>
    )
  }

}
