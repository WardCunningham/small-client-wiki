import React from 'react'

export const ExternalLink = ({ text }) => {
  var m = text.match(/\[(https?:.*?) (.*?)\]/)
  return <a href={m[1]}>{m[2]} <img src='external-link-ltr-icon.png' /></a>
}
