import React from 'react'
import { shallow } from 'enzyme'
import { Lineup } from './lineup'

// https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#testing-components

it('renders without crashing', () => {
  shallow(<Lineup />);
})