import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, Col, Form, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Field, reduxForm } from 'redux-form'
import { authStateSelector } from 'redux/selectors'
import { isFieldRequired, ucFirst } from 'helpers'
import { pick } from 'lodash'
import { requestFail } from 'redux/api/request'
import { signup, DO_SIGNUP, login } from 'redux/modules/auth'
import InputField from 'components/InputField'

class Signup extends Component {
  static propTypes = {
    auth: PropTypes.object,
    handleSubmit: PropTypes.func,
    signup: PropTypes.func
  };

  handleSignup = (values) => {
    const { login, signup } = this.props
    signup({
      body: values,
      success: () => login({
        body: pick(values, ['email', 'password'])
      })
    })
  }

  get errorText () {
    const { auth: { error } } = this.props
    return error
    ? Object.keys(error.data).map((key) => (
      <div key={key}>{ucFirst(error.data[key].toString())}</div>
    ))
    : ''
  }

  render() {
    const { auth, handleSubmit } = this.props

    return (
      <Row>
        <Col sm={12} md={{ size: 6, offset: 3 }}>
          {auth.status === requestFail(DO_SIGNUP) &&
            <Alert color='danger'>{this.errorText}</Alert>
          }
          <h2 className='text-center mb-5'>New User Signup</h2>
          <Form onSubmit={handleSubmit(this.handleSignup)}>
            <Row>
              <Col sm={6} xs={12}>
                <Field
                  label='First Name'
                  name='first_name'
                  type='text'
                  required
                  validate={[isFieldRequired]}
                  component={InputField}
                />
              </Col>
              <Col sm={6} xs={12}>
                <Field
                  label='Last Name'
                  name='last_name'
                  type='text'
                  required
                  validate={[isFieldRequired]}
                  component={InputField}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>    
                <Field
                  label='Email'
                  name='email'
                  type='email'
                  required
                  validate={[isFieldRequired]}
                  component={InputField}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={6} xs={12}>
                <Field
                  label='Password'
                  name='password'
                  type='password'
                  required
                  validate={[isFieldRequired]}
                  component={InputField}
                />
              </Col>
              <Col sm={6} xs={12}>
                <Field
                  label='Confirm Password'
                  name='confirm_password'
                  type='password'
                  required
                  validate={[isFieldRequired]}
                  component={InputField}
                />
              </Col>
            </Row>
            <Button color='primary' type='submit'>Signup</Button>
          </Form>
        </Col>
      </Row>
    )
  }
}

const selector = createStructuredSelector({
  auth: authStateSelector
})

const actions = {
  login,
  signup
}

const validate = values => {
  const errors = {}
  if (values.password !== values.confirm_password) {
    errors.confirm_password = 'Confirm Password should match with Password field.'
  }
  return errors
}

export default compose(
  reduxForm({
    form: 'signupForm',
    validate
  }),
  connect(selector, actions)
)(Signup)
