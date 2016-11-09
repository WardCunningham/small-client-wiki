import React from 'react'

import { Remote } from './remote'

export const Lineup = React.createClass({
  render: function() {
    var segments = this.props.lineup.split('/')
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
