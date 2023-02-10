import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, Col, Form, FormFeedback, FormGroup, Label, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Field, reduxForm } from 'redux-form'
import { authStateSelector } from 'redux/selectors'
import { isFieldRequired } from 'helpers'
import { login, DO_LOGIN } from 'redux/modules/auth'
import { requestFail } from 'redux/api/request'

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error, warning }
}) => (
  <FormGroup color={touched && error ? 'danger' : ''}>
    <Label>
      {label}
    </Label>
    <input {...input} placeholder={label} type={type} className='form-control' />
    {touched && error && <FormFeedback>{error}</FormFeedback>}
  </FormGroup>
)

class Login extends Component {
  static propTypes = {
    auth: PropTypes.object,
    handleSubmit: PropTypes.func,
    login: PropTypes.func
  };

  handleLogin = (values) => {
    const { login } = this.props
    login({ body: values })
  }

  render() {
    const { auth, handleSubmit } = this.props

    return (
      <Row>
        <Col sm={12} md={{ size: 4, offset: 4 }}>
          {auth.status === requestFail(DO_LOGIN) &&
            <Alert color="danger">Invalid email or password!</Alert>
          }
          <h2 className='text-center mb-5'>Login</h2>
          <Form onSubmit={handleSubmit(this.handleLogin)}>
            <Field
              label='Email'
              name='email'
              type='email'
              validate={[isFieldRequired]}
              component={renderField}
            />
            <Field
              label='Password'
              name='password'
              type='password'
              validate={[isFieldRequired]}
              component={renderField}
            />
            <Button color='primary' type='submit'>Login</Button>
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
  login
}

export default compose(
  reduxForm({
    form: 'loginForm'
  }),
  connect(selector, actions)
)(Login)
