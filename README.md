# React controlled form

This is a React controlled form components. More about controlled components [here](https://facebook.github.io/react/docs/forms.html#why-controlled-components). The main idea is to create a simple forms as possible. Look on the next example.

# What?

```js
import React, { Component } from 'react';
import Form from 'react-form-controlled';

export default class Component extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      firstName: null,
      lastName: null
    };
  }

  handleChange(state) {
    this.setState(state);
  }

  handleSubmit(state) {
    alert(`Hi ${state.firstName} ${state.lastName}`);
  }

  render() {
    const formData = this.state;

    return (
      <Form value={formData} onChange={this.handleChange.bind(this)} onSubmit={this.handleSubmit.bind(this)}>
        <label>
          <input type="text" name="firstName" placeholder="First name"/>
        </label>

        <label>
          <input type="text" name="lastName" placeholder="Last name"/>
        </label>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

# Where is the input value?

Value is automatically added as prop to the inputs. When you will change it it will reload whole form (controlled form, but this is the work for React).

# Arrays

```js
import React, { Component } from 'react';
import Form from 'react-form-controlled';

export default class Component extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      users: [{
        firstName: 'Zlatko'
      }, {
        name: 'Livia'
      }]
    };
  }

  handleChange(state) {
    this.setState(state);
  }

  handleSubmit(state) {
    alert(`Hi ${state.firstName} ${state.lastName}`);
  }

  render() {
    const formData = this.state;

    return (
      <Form value={formData} onChange={this.handleChange.bind(this)} onSubmit={this.handleSubmit.bind(this)}>
        <fieldset name="users">
          <label>
            <input type="text" name="firstName" placeholder="First name" />
          </label>
        </fieldset>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

# Complex objects

If you want to use complex names you can use dot or array notation.

```js
import React, { Component } from 'react';
import Form from 'react-form-controlled';

export default class Component extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      users: [{
        firstName: 'Zlatko',
        stats: {
          followers: 10,
        },
      }, {
        name: 'Livia',
        stats: {
          followers: 22,
        },
      }]
    };
  }

  handleChange(state) {
    this.setState(state);
  }

  handleSubmit(state) {
    alert(`Hi ${state.firstName} ${state.lastName}`);
  }

  render() {
    const formData = this.state;

    return (
      <Form value={formData} onChange={this.handleChange.bind(this)} onSubmit={this.handleSubmit.bind(this)}>
        <fieldset name="users">
          <label>
            <input type="text" name="firstName" placeholder="First name" />
          </label>
          <label>
            <input type="text" name="stats.followers" placeholder="Followers" />
          </label>
        </fieldset>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

or you can use one more fieldset

```js
import React, { Component } from 'react';
import Form from 'react-form-controlled';

export default class Component extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      users: [{
        firstName: 'Zlatko',
        stats: {
          followers: 10,
        },
      }, {
        name: 'Livia',
        stats: {
          followers: 22,
        },
      }]
    };
  }

  handleChange(state) {
    this.setState(state);
  }

  handleSubmit(state) {
    alert(`Hi ${state.firstName} ${state.lastName}`);
  }

  render() {
    const formData = this.state;

    return (
      <Form value={formData} onChange={this.handleChange.bind(this)} onSubmit={this.handleSubmit.bind(this)}>
        <fieldset name="users">
          <label>
            <input type="text" name="firstName" placeholder="First name" />
          </label>
          <fieldset name="stats">
            <label>
              <input type="text" name="followers" placeholder="Followers" />
            </label>
          </fieldset>
        </fieldset>

        <button type="submit">Submit</button>
      </Form>
    );
  }
}
```

# Support for schemas and validation?

Yes, you can use JSON schema as property to the form. Why JSON schema? Because it is a standard.
```js

const schema = {
  type: "object",
  properties: {
    firstName: {
      type: "string"
    },
    lastName: {
      type: "string"
    }
  }
};

<Form schema={schema} ref="form">

const hasError = form.hasError('firstName'); //true
const isValid = from.isValid('firstName'); //false
const errors = form.getErrors(); //[{path: 'firstName', error: '...'}]
```

# Prons

It will render a valid html form on the server(isomprhic application) which you can use without javascript as well on the client.

## Credits

[Zlatko Fedor](http://github.com/seeden)

