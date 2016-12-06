import React from 'react'
import { shallow, mount } from 'enzyme'
import { Lineup } from './lineup'

// https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#testing-components
describe ('lineup', () => {
  beforeEach (() => window.location.hash = '')

  it('has initial state with default site', () => {
    const wrapper = shallow(<Lineup />);
    expect(wrapper.state().lineup[0].site).toBe('small.bay.wiki.org')
  })

  it('has initial state refering to two sites', () => {
    window.location.hash = '#ward.bay.wiki.org/active-journal/forage.ward.fed.wiki.org/december-journal'
    const wrapper = shallow(<Lineup />);
    expect(wrapper.state().lineup[0].site).toBe('ward.bay.wiki.org')
    expect(wrapper.state().lineup[1].site).toBe('forage.ward.fed.wiki.org')
  })

  it('has initial state refering to two sites', (done) => {
    window.location.hash = '#ward.bay.wiki.org/active-journal/forage.ward.fed.wiki.org/december-journal'
    const wrapper = mount(<Lineup />);
    setTimeout(look, 3000)
    function look () {
      // console.log(wrapper.html().replace(/>/g, ">\n"))
      // console.log(wrapper.state())
      expect(wrapper.state().lineup[0].story).toBeDefined()
      expect(wrapper.state().lineup[1].story).toBeDefined()
      done()
    }
  })
})