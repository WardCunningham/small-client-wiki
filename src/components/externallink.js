import React from 'react'

export const ExternalLink = React.createClass({
  render: function() {
    var m = this.props.text.match(/\[(https?:.*?) (.*?)\]/)
    return <a href={m[1]}>{m[2]} <img src="external-link-ltr-icon.png" /></a>
  }
})
