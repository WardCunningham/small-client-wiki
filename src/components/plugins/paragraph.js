import React from 'react'
import { PlainText} from '../plaintext'
import { ExternalLink } from '../externallink'

export const Paragraph = React.createClass({
    render: function(){
        function splitText(text) {
          return text.split(/(\[https?:.*? .*?\])/)
        }

        function span(split, index) {
          if (split[0] == "[") {
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
