import React from 'react'
import $ from 'jquery'

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
        this.serverRequest = $.get(source, function (result) {
            this.setState({
                title: result.title,
                story: result.story
            });
        }.bind(this));
    },
    componentWillUnmount: function() {
        this.serverRequest.abort();
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
