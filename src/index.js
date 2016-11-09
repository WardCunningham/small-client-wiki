import React from 'react'
import { render } from 'react-dom'

require('../style/index.css')
import { Lineup } from './components/lineup'

render(
  <Lineup lineup={window.location.hash.replace('#', '')} />,
  document.getElementById('federated-wiki')
);
