import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, Col, Form, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { withRouter } from 'react-router'
import { saveProfile, SAVE_PROFILE } from 'redux/modules/auth'
import { requestFail } from 'redux/api/request'
import { isFieldRequired, ucFirst } from 'helpers'
import InputField from 'components/InputField'

class Profile extends Component {
  static propTypes = {
    auth: PropTypes.object,
    handleSubmit: PropTypes.func,
    history: PropTypes.object,
    saveProfile: PropTypes.func
  };

  handleSave = (values) => {
    const { history, saveProfile } = this.props
    saveProfile({
      body: values,
      success: () => history.push('/dashboard')
    })
  }

  handleCancel = (values) => {
    const { history } = this.props
    history.push('/dashboard')
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
          {auth.status === requestFail(SAVE_PROFILE) &&
            <Alert color='danger'>{this.errorText}</Alert>
          }
          <h2 className='text-center mb-5'>Edit Your Profile</h2>
          <Form onSubmit={handleSubmit(this.handleSave)}>
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
                  placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;'
                  component={InputField}
                />
              </Col>
              <Col sm={6} xs={12}>
                <Field
                  label='Confirm Password'
                  name='confirm_password'
                  type='password'
                  placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;'
                  component={InputField}
                />
              </Col>
            </Row>
            <div className='text-center'>
              <Button color='primary' type='submit'>Save Profile</Button>
              {' '}
              <Button color='default' type='button' onClick={this.handleCancel}>Cancel</Button>
            </div>
          </Form>
        </Col>
      </Row>
    )
  }
}

const selector = (state) => ({
  auth: state.auth,
  initialValues: state.auth.me
})

const actions = {
  saveProfile
}

const validate = values => {
  const errors = {}
  if (values.password !== values.confirm_password) {
    errors.confirm_password = 'Confirm Password should match with Password field.'
  }
  return errors
}

export default compose(
  connect(selector, actions),
  reduxForm({
    form: 'profileForm',
    validate
  }),
  withRouter
)(Profile)
