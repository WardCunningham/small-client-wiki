import React from 'react'
import { shallow, mount } from 'enzyme'
import { PlainText, ResolvedText } from './text'

describe ('plain text', () => {
  it('it renders text with necessary escapes', () => {
    const wrapper = shallow(<PlainText text='Cunningham & Cunningham, Inc.' />);
    expect(wrapper.html()).toBe('<span>Cunningham &amp; Cunningham, Inc.</span>')
  })
})
