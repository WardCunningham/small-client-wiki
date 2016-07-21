import React from 'react'

export const PlainText = React.createClass({
  render: function() {
    return <span>{this.props.text}</span>
  }
})
