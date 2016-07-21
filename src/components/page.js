import React from 'react'

import { Paragraph } from './plugins/paragraph'
import { Reference } from './plugins/reference'

const plugins = {
  'paragraph': Paragraph,
  'reference': Reference,
}

export const Page = React.createClass({
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
