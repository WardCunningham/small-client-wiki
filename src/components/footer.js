import React from 'react'

function li (detail, index) {
  return (<li key={index}>{detail}</li>)
}

export const Footer = ({ details }) => <div>{details.map(li)}</div>
