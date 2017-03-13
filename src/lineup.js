import React from 'react'
import $ from 'jquery'
import { ResolvedText, InternalLink } from './text'
import { Paragraph } from './plugins/paragraph'

export const Lineup = React.createClass({
  createInstance: function(context, site, slug, title, story) {
    return {
      id: Math.floor(Math.random() * 1000000000),
      context: context,
      site: site,
      slug: slug,
      title: title,
      story: story
    }
  },
  instancesFromUrl: function(lineupString) {
    var instances = []
    var segments = lineupString.split("/")
    for (var i = 0; i < segments.length; i += 2) {
      instances.push(this.createInstance(undefined, segments[i], segments[i + 1]))
    }
    return instances
  },
  urlFromInstances: function(instances) {
    return instances.map(function(instance) {
      return instance.site + "/" + instance.slug
    }).join("/")
  },
  alignInstances: function(original, replacement) {
    for (var i = 0; i < replacement.length; i++) {
      var o = original[i]
      var r = replacement[i]
      if (o == undefined || r.site != o.site || r.slug != o.slug) {
        break
      }
      replacement[i] = o
    }
    return replacement
  },
  getInitialState: function() {
    var initial = window.location.hash.replace("#", "")
    if (initial == "") {
      initial = "small.bay.wiki.org/welcome-visitors"
      window.location.hash = "#" + initial
    }

    return {
      lineup: this.instancesFromUrl(initial)
    }
  },
  appendToLineup: function(event) {
    var detail = event.detail
    console.log("Detail: " + detail)
    var newLineup = this.state.lineup.slice(0);
    newLineup.push(this.createInstance(detail.context, detail.site, detail.slug, detail.title))
    this.setState({ lineup: newLineup, ready: 'append' })
  },
  replaceInLineup: function(event) {
    var detail = event.detail
    var lastDesiredIndex = this.state.lineup.findIndex(function(item) { return item.id == detail.instance.id})
    var newLineup = this.state.lineup.slice(0, lastDesiredIndex + 1);
    newLineup.push(this.createInstance(detail.context, detail.site, detail.slug, detail.title))
    this.setState({ lineup: newLineup, ready: 'replace' })
  },
  pageAvailable: function(event) {
    var detail = event.detail
    var that = this
    var newLineup = this.state.lineup.map(function(item) {
        if (item.id == detail.id) {
          return that.createInstance(detail.context, detail.site, detail.slug, detail.title, detail.story)
        }
        else {
          return item
        }
    })

    this.setState({ lineup: newLineup })
  },
  onPopstate: function(event) {
    var newLineup = this.instancesFromUrl(window.location.hash.replace("#", ""))
    this.alignInstances(this.state.lineup, newLineup)
    this.setState({ lineup: newLineup })
  },
  componentDidMount: function() {
    window.addEventListener("appendToLineup", this.appendToLineup, false)
    window.addEventListener("replaceInLineup", this.replaceInLineup, false)
    window.addEventListener("pageAvailable", this.pageAvailable, false)
    window.addEventListener("popstate", this.onPopstate, false)
  },
  componentDidUpdate: function() {
    var loading = this.state.lineup.find(function(item) { return item.site == undefined })

    if (!loading) {
      window.location.hash = "#" + this.urlFromInstances(this.state.lineup)
      this.state.ready = 'done'
    }
  },
  render: function() {
    function toSegment(instance) {
      if (instance.story) {
        return <Page key={instance.id} instance={instance} />
      }
      else if (instance.site == undefined) {
        return <Resolution key={instance.id} instance={instance} />
      }
      else {
        return <Remote key={instance.id} instance={instance} />
      }
    }

    return <div>
        <div className="lineup">{this.state.lineup.map(toSegment)}</div>
        <div className="ready">{this.state.ready||"starting"}</div>
        </div>
  }
})

var Resolution = React.createClass({
    resolve: function(context, slug, i) {
      if (i >= context.length) {
        return;
      }

      var site = context[i]
      var source = 'http://' + site + '/' + slug + '.json'
      var that = this;

      var ammend = function(sum) {
        return function(each) {
          if (each.site != undefined && sum.indexOf(each.site) == -1) {
            sum.push(each.site)
          }
        }
      }

      this.serverRequest = $.getJSON(source)
        .done( function (result) {
            var resolvedContext = [site]
            var journal = result.journal || []
            journal.reverse().forEach(ammend(resolvedContext))

            var detail = { id: that.props.instance.id, context: resolvedContext,
                           site: site, slug: that.props.instance.slug,
                           title: result.title, story: result.story }
            var event = new CustomEvent('pageAvailable', { detail: detail })
            window.dispatchEvent(event)})
        .fail(function (result) {
            that.resolve(context, slug, ++i)
      });
    },
    componentDidMount: function() {
      this.resolve(this.props.instance.context, this.props.instance.slug, 0)
    },
    render: function(){
      return <Page instance={this.props.instance} />
    }
})

var Remote = React.createClass({
    componentDidMount: function() {
        var ammend = function(sum) {
          return function(each) {
            if (each.site != undefined && sum.indexOf(each.site) == -1) {
              sum.push(each.site)
            }
          }
        }

        var source = 'http://' + this.props.instance.site + '/' + this.props.instance.slug + '.json'
        this.serverRequest = $.getJSON(source)
            .done( function (result) {
              var context = [this.props.instance.site]
              var journal = result.journal || []
              journal.reverse().forEach(ammend(context))
              var detail = { id: this.props.instance.id, context: context,
                             site: this.props.instance.site, slug: this.props.instance.slug,
                             title: result.title, story: result.story }
              var event = new CustomEvent('pageAvailable', { detail: detail })
              window.dispatchEvent(event)
            }.bind(this));
    },
    componentWillUnmount: function() {
        this.serverRequest.abort();
    },
    render: function(){
        return <Page instance={this.props.instance} />
    }
});

var Page = React.createClass({
    getInitialState: function() {
      return {
        position: {
          top: 0,
          left: 0
        }
      }
    },
    handleTouchStart: function(event) {
      var changedTouch = event.nativeEvent.changedTouches[0]

      var newState = Object.assign({}, this.state)
      newState.touch = {
        original: Object.assign({}, this.state.position),
        clientX: changedTouch.clientX,
        clientY: changedTouch.clientY
      }
      this.setState(newState)
    },
    handleTouchMove: function(event) {
      var changedTouch = event.nativeEvent.changedTouches[0]

      var deltaX = changedTouch.clientX - this.state.touch.clientX
      var deltaY = changedTouch.clientY - this.state.touch.clientY

      var newState = Object.assign({}, this.state)
      newState.position = {
        top: this.state.touch.original.top + deltaY,
        left: this.state.touch.original.left + deltaX
      }
      this.setState(newState)
      event.preventDefault()
    },
    render: function(){
        function item(instance) {
          return function(item, index){
            var I = plugins[item.type] || MissingPlugin
            return (<I key={item.id} item={item} instance={instance} {...instance} />);
          }
        }

        var items = this.props.instance.story || []
        var context = this.props.instance.context || [this.props.instance.site]

        return (
            <div onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove} style={this.state.position} className="page">
                <h2>
                  <img style={{width: 18, marginRight: 5}} src={'http://' + this.props.instance.site + '/favicon.png'}  />
                  {this.props.instance.title || this.props.instance.slug}
                </h2>
                {items.map(item(this.props.instance))}
                <Footer details={[context.join(" ⇒ ")]} />
            </div>
        );
    }
});

var Image = React.createClass({
  render: function() {
    return (
    <div className="item surround">
      <img src={this.props.item.url} />
      <div className="caption">{this.props.item.text || this.props.item.caption}</div>
    </div>
    )
  }
})

var Markdown = React.createClass({
  render: function() {
    return (
      <div className="item" className={this.props.item.type}>
        <MarkdownText {...this.props} text={this.props.item.text} />
      </div>
    )
  }
})

var PageFold = React.createClass({
  render: function() {
    return <div className="item pagefold">
             <span>{this.props.item.text}</span>
           </div>
  }
})

var Reference = React.createClass({
  render: function () {
    var referenceContext = this.props.context
    if (referenceContext.indexOf(this.props.item.site) == -1) {
      referenceContext = referenceContext.concat(this.props.item.site)
    }

    return (
        <div className="item" className={this.props.item.type}>
          <p>
            <a href=''><img style={{width: 12, marginRight: 5}} src={'http://' + this.props.item.site + '/favicon.png'}  /></a>
            <InternalLink key={1} {...this.props} context={referenceContext} site={this.props.item.site} text={this.props.item.title} /> — <ResolvedText {...this.props} context={referenceContext} text={this.props.item.text} />
          </p>
        </div>
    )
  }
})

var Video = React.createClass({
  render: function() {
    var parse = function(text) {
      var result = { caption: "" }
      var lines = text.split(/\r\n?|\n/)
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i]
        var match = line.match(/^\s*([A-Z0-9]+)\s+([\w\.\-\/+0-9]+)\s*$/)
        if (match) {
          result.player = match[1]
          result.key = match[2]
        }
        else {
          match = line.match(/^\s*([A-Z0-9]+)\s+([A-Za-z\,]+)\s+([\w\.\-\/+0-9]+)\s*$/)
          if (match) {
            result.player = match[1] + '/' + match[2]
            result.key = match[3]
          }
          else {
            result.caption += line + " "
          }
        }
      }
      return result;
    }

    var players = {
      "YOUTUBE": "http://www.youtube-nocookie.com/embed/#{key}?rel=0",
      "YOUTUBE/PLAYLIST": "https://www.youtube-nocookie.com/embed/videoseries?list=#{key}",
      "VIMEO": "http://player.vimeo.com/video/#{key}?title=0&amp;byline=0&amp;portrait=0",
      "TED": "https://embed-ssl.ted.com/talks/#{key}.html"
    }

    var lookupUrl = function(result) {
      
      var template = players[result.player]
      if (template == undefined)
        return undefined

      return template.replace("#{key}", result.key)
    }

    var result = parse(this.props.item.text)
    var url = lookupUrl(result)
    var player = url ?
      <iframe src={url} frameBorder="0" allowFullScreen /> :
      <div className="surround">{result.player + " " + result.key}</div>

    return (
      <div className="item">
        {player}
        <i><ResolvedText text={result.caption} {...this.props} /></i>
      </div>
    )
  }
})

var MissingPlugin = React.createClass({
  render: function() {
    return (
      <div className="item missing">
        Missing '{this.props.item.type}' plugin
      </div>
    )
  }
})

var plugins = {
  "image": Image,
  "markdown": Markdown,
  "pagefold": PageFold,
  "paragraph": Paragraph,
  "reference": Reference,
  "video": Video
}

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
