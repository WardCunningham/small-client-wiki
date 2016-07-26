import React from 'react'
import { PlainText} from '../plaintext'
import { ExternalLink } from '../externallink'
import { InternalLink } from '../internallink'

function splitText(text) {
  return text.split(/(\[https?:.*? .*?\]|\[\[.*?\]\])/)
}

function span(split, index) {
  if (split.startsWith('[[')) {
    return <InternalLink key={index} text={split} />
  }
  else if (split.startsWith('[')) {
    return <ExternalLink key={index} text={split} />
  } else {
    return <PlainText key={index} text={split} />
  }
}

export const Paragraph = React.createClass({
    render: function(){
        var spans = splitText(this.props.item.text)
        return (
          <div className='item' className={this.props.item.type}>
              <p>{spans.map(span)}</p>
          </div>
        );
    }
})
