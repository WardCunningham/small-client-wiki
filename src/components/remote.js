import React from 'react'
require('es6-promise').polyfill()
require('isomorphic-fetch')

import { Page } from './page'
import { Footer } from './footer'

export const Remote = React.createClass({
    // https://facebook.github.io/react/tips/initial-ajax.html
    getInitialState: function() {
        return {
          title: this.props.slug,
          story: []
        };
      },
    componentDidMount: function() {
        var source = 'http://' + this.props.site + '/' + this.props.slug + '.json'
        fetch(source)
          .then((result) => result.json())
          .then((result) => {
            this.setState({
                title: result.title,
                story: result.story
            });
        })
    },
    render: function(){
        return (
            <div>
                <Page
                    title={this.state.title}
                    story={this.state.story} />
                <Footer
                    details={[this.props.site, this.props.slug]} />
            </div>
        );
    }
});
