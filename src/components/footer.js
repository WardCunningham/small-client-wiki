import React from 'react'

export const Footer = React.createClass({
    render: function(){
        function li (detail, index){ return (<li key={index}>{detail}</li>); }
        return (
        	<div>
            	{this.props.details.map(li)}
          </div>
        );
    }
});
