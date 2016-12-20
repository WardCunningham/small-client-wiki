import React from 'react'
import { ResolvedText } from '../../text'

export const Paragraph = React.createClass({
    render: function(){
      return (
            <div className="item" className={this.props.item.type}>
              <p>
                <ResolvedText {...this.props} text={this.props.item.text} />
              </p>
            </div>
        );
    }
})

