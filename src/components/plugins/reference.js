import React from 'react'

export const Reference = React.createClass({
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
