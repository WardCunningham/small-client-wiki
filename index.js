import React from 'react'
import { render } from 'react-dom'
import $ from 'jquery'

require('./style/index.css')

var Lineup = React.createClass({
  render: function() {
    var segments = this.props.lineup.split("/")
    var pairs = []
    for (var i = 0; i < segments.length; i += 2) {
      pairs.push([segments[i], segments[i + 1]])
    }

    return (
      <div>
        { pairs.map((pair) => <Remote key={pair[1]} site={pair[0]} slug={pair[1]} />) }
      </div>
    )
  }
})

var Remote = React.createClass({
    // https://facebook.github.io/react/tips/initial-ajax.html
    getInitialState: function() {
        return {
          title: this.props.slug,
          story: []
        };
      },
    componentDidMount: function() {
        var source = 'http://' + this.props.site + '/' + this.props.slug + '.json'
        this.serverRequest = $.get(source, function (result) {
            this.setState({
                title: result.title,
                story: result.story
            });
        }.bind(this));
    },
    componentWillUnmount: function() {
        this.serverRequest.abort();
    },
    render: function(){
        return (
            <div>
                <Page
                    title={this.state.title}
                    story={this.state.story} />
                <Footer
                    details={[this.props.site, this.props.slug]} />
            </div>
        );
    }
});

var Page = React.createClass({
    render: function(){
        function item (item, index){
          var I = plugins[item.type] || Paragraph
          return (<I key={item.id} item={item} />);
        }

        return (
            <div className="page">
                <h2>{this.props.title}</h2>
                {this.props.story.map(item)}
            </div>
        );
    }
});

var Paragraph = React.createClass({
    render: function(){
        function splitText(text) {
          return text.split(/(\[https?:.*? .*?\]|\[\[.*?\]\])/)
        }

        function span(split, index) {
          if (split.startsWith("[[")) {
            return <InternalLink key={index} text={split} />
          }
          else if (split.startsWith("[")) {
            return <ExternalLink key={index} text={split} />
          }
          else {
            return <PlainText key={index} text={split} />
          }
        }

        var spans = splitText(this.props.item.text)
        return (
            <div className="item" className={this.props.item.type}>
                <p>{spans.map(span)}</p>
            </div>
        );
    }
})

var Reference = React.createClass({
  render: function () {
    return (
        <p>
          <a href=''>
            <img style={{width: 16, marginRight: 5}} src={'http://' + this.props.item.site + '/favicon.png'}  />
            {this.props.item.title}</a> — {this.props.item.text}
        </p>
    )
  }
})
var plugins = {
  "paragraph": Paragraph,
  "reference": Reference
}

var PlainText = React.createClass({
  render: function() {
    return <span>{this.props.text}</span>
  }
})

var ExternalLink = React.createClass({
  render: function() {
    var m = this.props.text.match(/\[(https?:.*?) (.*?)\]/)
    return <a href={m[1]}>{m[2]} <img src="external-link-ltr-icon.png" /></a>
  }
})

var InternalLink = React.createClass({
  handleClick: function() {
    alert('lert')
  },

  render: function() {
    var m = this.props.text.match(/\[\[(.*?)\]\]/)
    return <a href="#" onClick={this.handleClick}>{m[1]}</a>
  }
})

var Footer = React.createClass({
    render: function(){
        function li (detail, index){ return (<li key={index}>{detail}</li>); }
        return (
        	<div>
            	{this.props.details.map(li)}
          </div>
        );
    }
});

render(
  <Lineup lineup={window.location.hash.replace("#", "")} />,
  document.getElementById('federated-wiki')
);
