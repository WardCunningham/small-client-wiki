import React from 'react'

const handleClick = () => {
  alert('lert')
}

export const InternalLink = ({ text }) => {
  const m = text.match(/\[\[(.*?)\]\]/)
  return <a href="#" onClick={handleClick}>{m[1]}</a>
}
