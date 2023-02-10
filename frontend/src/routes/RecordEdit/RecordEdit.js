import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, Col, Form, FormGroup, Label, Input, Row } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Field, formValueSelector, reduxForm } from 'redux-form'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { createRecord, getRecord, updateRecord, CREATE_RECORD, UPDATE_RECORD }
  from 'redux/modules/tracking'
import { distanceUnit, getDateStr, isFieldRequired, ucFirst } from 'helpers'
import { getUsers } from 'redux/modules/user'
import { isUser } from 'helpers/roleHelpers'
import { requestFail, requestSuccess } from 'redux/api/request'
import * as selectors from 'redux/selectors'
import DateTimeField from 'components/DateTimeField'
import DurationField from 'components/DurationField'
import InputField from 'components/InputField'
import InputGroupField from 'components/InputGroupField'

const getUserOptions = (userList) => {
  const userOptions = (userList ? userList.map((user, index) => ({
    label: user.first_name + ' ' + user.last_name,
    value: user.id
  })) : [])
  userOptions.unshift({
    label: '- Select User -',
    value: ''
  })
  return userOptions
}

const requeestIsFail = ({ status }) =>
  status === requestFail(UPDATE_RECORD) || status === requestFail(CREATE_RECORD)

const requeestIsSuccess = ({ status }) =>
  status === requestSuccess(UPDATE_RECORD) || status === requestSuccess(CREATE_RECORD)

class RecordEdit extends Component {
  static propTypes = {
    createRecord: PropTypes.func,
    getRecord: PropTypes.func,
    getUsers: PropTypes.func,
    handleSubmit: PropTypes.func,
    history: PropTypes.object,
    initialValues: PropTypes.object,
    profile: PropTypes.object,
    trackingState: PropTypes.object,
    updateRecord: PropTypes.func,
    usersList: PropTypes.array
  };

  componentWillMount () {
    const { getRecord, getUsers, match: { params }, profile } = this.props
    params.id && getRecord({ id: params.id })
    !isUser(profile) && getUsers()
  }

  handleSave = (values) => {
    const { createRecord, updateRecord, match: { params }, history, profile } = this.props
    const finalValues = {
      ...values,
      date_recorded: getDateStr(values.date_recorded),
      user: isUser(profile) ? profile.id : values.user
    }

    params.id
    ? updateRecord({
      id: params.id,
      body: finalValues
    })
    : createRecord({
      body: finalValues,
      success: () => history.push('/records')
    })
  }

  get errorText () {
    const { trackingState: { error } } = this.props
    return error
    ? Object.keys(error.data).map((key) => (
      <div key={key}>{ucFirst(error.data[key].toString())}</div>
    ))
    : ''
  }

  render() {
    const { trackingState, handleSubmit, match: { params }, profile,
      usersList, formValues } = this.props

    return (
      <Row>
        <Col sm={12} md={{ size: 4, offset: 4 }}>
          {requeestIsFail(trackingState) &&
            <Alert color='danger'>{this.errorText}</Alert>
          }
          {requeestIsSuccess(trackingState) &&
            <Alert color='success'>Updated successfully!</Alert>
          }
          <h2 className='text-center mb-5'>
            {params.id ? 'Edit Jogging Record' : 'Add New Jogging Record'}
          </h2>
          <Form onSubmit={handleSubmit(this.handleSave)}>
            <Field
              label='Date'
              name='date_recorded'
              type='text'
              required
              placeholder='YYYY-MM-DD'
              dateFormat='YYYY-MM-DD'
              timeFormat={false}
              validate={[isFieldRequired]}
              component={DateTimeField}
            />
            <Field
              label='Duration'
              name='duration'
              type='number'
              required
              validate={[isFieldRequired]}
              suffix='seconds'
              component={DurationField}
            />
            <Field
              label='Distance'
              name='distance'
              type='number'
              required
              validate={[isFieldRequired]}
              suffix='meters'
              component={InputGroupField}
            />
            <FormGroup>
              <Label for="exampleEmail">Avg. Speed</Label>
              <Input static>
                {distanceUnit((formValues.distance || 0) / (formValues.duration || 1), '/s')}
              </Input>
            </FormGroup>
            {!isUser(profile) && <Field
              label='User'
              name='user'
              type='select'
              required
              validate={[isFieldRequired]}
              component={InputField}
              options={getUserOptions(usersList)}
            />}
            <Row>
              <Col xs={6}>
                <Link to='/records' className='btn btn-secondary'>
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
  initialValues: (state, props) => (
    props.match.params.id ? selectors.recordDetailSelector(state) : {}
  ),
  trackingState: selectors.trackingStateSelector,
  usersList: selectors.usersListSelector,
  formValues: (state) => formValueSelector('recordForm')(state, 'duration', 'distance')
})

const actions = {
  createRecord,
  getRecord,
  updateRecord,
  getUsers
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
    form: 'recordForm',
    enableReinitialize: true,
    validate
  }),
  withRouter
)(RecordEdit)
