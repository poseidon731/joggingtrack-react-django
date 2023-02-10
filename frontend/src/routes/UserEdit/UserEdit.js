import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, Col, Form, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Field, reduxForm } from 'redux-form'
import { filter } from 'lodash'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { createUser, getUser, updateUser, CREATE_USER, UPDATE_USER } from 'redux/modules/user'
import { isAdmin, isManager } from 'helpers/roleHelpers'
import { isFieldRequired, ucFirst } from 'helpers'
import { requestFail, requestSuccess } from 'redux/api/request'
import * as selectors from 'redux/selectors'
import InputField from 'components/InputField'

const roleOptions = [
  {
    value: 'user',
    label: 'User',
    roles: ['admin', 'manager']
  },
  {
    value: 'manager',
    label: 'Manager',
    roles: ['admin', 'manager']
  },
  {
    value: 'admin',
    label: 'Admin',
    roles: ['admin']
  }
]

const getRoleOptions = ({ role }) =>
  filter(roleOptions, (item) => item.roles.includes(role))

const requestIsFailed = ({ status }) =>
  status === requestFail(CREATE_USER) || status === requestFail(UPDATE_USER)

const requestIsSuccess = ({ status }) =>
  status === requestSuccess(CREATE_USER) || status === requestSuccess(UPDATE_USER)

class UserEdit extends Component {
  static propTypes = {
    createUser: PropTypes.func,
    getUser: PropTypes.func,
    handleSubmit: PropTypes.func,
    history: PropTypes.object,
    initialValues: PropTypes.object,
    profile: PropTypes.object,
    updateUser: PropTypes.func,
    userState: PropTypes.object
  };

  componentWillMount () {
    const { getUser, match: { params } } = this.props
    params.id && getUser({ id: params.id })
  }

  handleSave = (values) => {
    const { createUser, updateUser, match: { params }, history } = this.props
    params.id
    ? updateUser({
      id: params.id,
      body: values
    })
    : createUser({
      body: values,
      success: () => history.push('/users')
    })
  }

  get errorText () {
    const { userState: { error } } = this.props
    return error
    ? Object.keys(error.data).map((key) => (
      <div key={key}>{ucFirst(error.data[key].toString())}</div>
    ))
    : ''
  }

  render() {
    const { userState, handleSubmit, initialValues, match: { params },
      profile } = this.props
    const shouldShowRoleField = (isAdmin(profile) || isManager(profile)) &&
      initialValues && profile.id !== initialValues.id

    return (
      <Row>
        <Col sm={12} md={{ size: 4, offset: 4 }}>
          {requestIsFailed(userState) &&
            <Alert color='danger'>{this.errorText}</Alert>
          }
          {requestIsSuccess(userState) &&
            <Alert color='success'>Updated successfully!</Alert>
          }
          <h2 className='text-center mb-5'>
            {params.id ? 'Edit User' : 'Add New User'}
          </h2>
          <Form onSubmit={handleSubmit(this.handleSave)}>
            <Field
              label='First Name'
              name='first_name'
              type='text'
              required
              validate={[isFieldRequired]}
              component={InputField}
            />
            <Field
              label='Last Name'
              name='last_name'
              type='text'
              required
              validate={[isFieldRequired]}
              component={InputField}
            />
            <Field
              label='Email'
              name='email'
              type='email'
              required
              validate={[isFieldRequired]}
              component={InputField}
            />
            {shouldShowRoleField && <Field
              label='Role'
              name='role'
              type='select'
              required
              validate={[isFieldRequired]}
              component={InputField}
              options={getRoleOptions(profile)}
            />}
            <Field
              label='Password'
              name='password'
              type='password'
              placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;'
              required={!params.id}
              validate={!params.id ? [isFieldRequired] : undefined}
              component={InputField}
            />
            <Row>
              <Col xs={6}>
                <Link to='/users' className='btn btn-secondary'>
                  Cancel
                </Link>
              </Col>
              <Col className='text-right'>
                <Button color='primary' type='submit'>Save</Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    )
  }
}

const selector = createStructuredSelector({
  profile: selectors.profileSelector,
  initialValues: (state, props) =>
    props.match.params.id ? selectors.userDetailSelector(state) : {},
  userState: selectors.userStateSelector
})

const actions = {
  createUser,
  getUser,
  updateUser
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
    form: 'userForm',
    enableReinitialize: true,
    validate
  }),
  withRouter
)(UserEdit)
