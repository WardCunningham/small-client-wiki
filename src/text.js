import React from 'react'
import showdown from 'showdown'

export const PlainText = React.createClass({
  render: function() {
    return <span>{this.props.text}</span>
  }
})

export const ExternalLink = React.createClass({
  render: function() {
    var m = this.props.text.match(/\[(https?:.*?) (.*?)\]/)
    return <a href={m[1]}>{m[2]} <img src="external-link-ltr-icon.png" /></a>
  }
})

export const InternalLink = React.createClass({
  asSlug: function(title) {
    return title.replace(/\s/g, '-').replace(/[^A-Za-z0-9-]/g, '').toLowerCase()
  },
  handleClick: function(click) {
    var detail = { context: this.props.context, instance: this.props.instance, title: this.props.text, slug: this.asSlug(this.props.text) }
    var eventType = click.nativeEvent.shiftKey ? 'appendToLineup' : 'replaceInLineup'
    var event = new CustomEvent(eventType, { detail: detail })
    window.dispatchEvent(event)
    click.preventDefault()
  },
  render: function() {
    var contextTitle = this.props.context.join(" ⇒ ")
    return <a href="#" className="internal" title={contextTitle} onClick={this.handleClick}>{this.props.text}</a>
  }
})

export const ResolvedText = React.createClass({
    render: function(){
        function splitText(text) {
          return text.split(/(\[https?:.*? .*?\]|\[\[.*?\]\])/)
        }

        function span(props) {
          return function (split, index) {
            if (split.startsWith("[[")) {
              return <InternalLink key={index} {...props} text={split.slice(2, -2)} />
            }
            else if (split.startsWith("[")) {
              return <ExternalLink key={index} {...props} text={split} />
            }
            else {
              return <PlainText key={index} {...props} text={split} />
            }
          }
        }

        var spans = splitText(this.props.text)
        return <span>{spans.map(span(this.props))}</span>
    }
})


export const MarkdownText = React.createClass({
    rawMarkup: function() {
        var context = this.props.context
        var wikiLinks = function () {
            return [
                {
                    type:   'lang',
                    regex:  /\[(https?:.*?) (.*?)\]/g,
                    replace: function (match, url, linkText) {
                        return '<a href="' + url + '" target="_blank">' + linkText + ' <img src="external-link-ltr-icon.png" /></a>'
                    }
                },
                {
                    type:   'lang',
                    regex:  /\[\[(.*?)\]\]/g,
                    replace: function (match, linkText) {
                        var asSlug = function(title) {
                            return title.replace(/\s/g, '-').replace(/[^A-Za-z0-9-]/g, '').toLowerCase()
                        }
                        var contextTitle = context.join(" ⇒ ")
                        return '<a href="#" class="internal" title="' + contextTitle + '" data-page-name="' + asSlug(linkText) + '">' + linkText + '</a>'
                    }
                }
            ]
        }
        
        var converter = new showdown.Converter({
            headerLevelStart: 3,
            tasklists: true,
            extensions: [ wikiLinks ]
        })
        var rawMarkup = converter.makeHtml(this.props.text)
        return { __html: rawMarkup}
    },
    
    onClick: function(e) {
        var target = e.target
        if (target.tagName.toLowerCase() === 'a' && target.className.toLowerCase() === 'internal') {
            var detail = { context: this.props.context, instance: this.props.instance, title: target.getAttribute('title'), slug: target.getAttribute('data-page-name') }
            var eventType = e.nativeEvent.shiftKey ? 'appendToLineup' : 'replaceInLineup'
            var event = new CustomEvent(eventType, { detail: detail })
            window.dispatchEvent(event)
            e.preventDefault()
        }
    },

    render: function() {
        return <span onClick={this.onClick} dangerouslySetInnerHTML={this.rawMarkup()} />
    }
})
