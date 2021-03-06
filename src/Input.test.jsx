import React from 'react';
import { mount } from 'enzyme';
import Form, {
  Input,
} from '../src';

describe('Input', () => {
  /*
  it('should be able to create input', (done) => {
    const value = {
      inputValue: 123,
    };

    function onChange(state) {
      expect(state.inputValue).toBe('222');
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <Input name="inputValue" />
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('input').props().value).toBe(123);
    expect(wrapper.find('input').get(0).value).toBe('123');

    wrapper.find('input').simulate('change', { target: {
      value: '222',
    } });
  });

  it('should be able to create standard input', (done) => {
    const value = {
      inputValue: 123,
    };

    function onChange(state) {
      expect(state.inputValue).toBe('222');
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <input name="inputValue" />
      </Form>
    ));

    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('input').props().value).toBe(123);
    expect(wrapper.find('input').get(0).value).toBe('123');

    wrapper.find('input').simulate('change', { target: {
      value: '222',
    } });
  });

  it('should be able to use onChange event', (done) => {
    const value = {
      inputValue: 123,
    };

    let onChangeInputCalled = false;

    function onChange(state) {
      expect(state.inputValue).toBe('222');
      onChangeInputCalled = true;
    }

    function onChangeInput(evn) {
      expect(evn.target.value).toBe('222');
      expect(onChangeInputCalled).toBe(true);
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <input name="inputValue" onChange={onChangeInput} />
      </Form>
    ));

    wrapper.find('input').simulate('change', { target: {
      value: '222',
    } });
  });
*/
  it('should be able to use group on radio buttons', (done) => {
    const value = {
      options: [{ 
        value: 1,
      }, { 
        value: 2,
        isSelected: true,
      }, { 
        value: 3,
      }],
    };

    let onChangeInputCalled = false;

    function onChange(state) {
      onChangeInputCalled = true;
      expect(state.options[2].isSelected).toBe(true);
    }

    function onChangeInput(evn) {
      expect(onChangeInputCalled).toBe(true);
      done();
    }

    const wrapper = mount((
      <Form value={value} onChange={onChange}>
        <fieldset name="options">
          <input type="radio" group=".." name="isSelected" onChange={onChangeInput} />
        </fieldset>
      </Form>
    ));

    wrapper.find('input').at(2).simulate('change', { target: {
      value: true,
    } });
  });
});
