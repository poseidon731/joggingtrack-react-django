import React from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Form, FormGroup, Input, Label, Modal, ModalHeader, ModalBody,
  ModalFooter, Row, Table } from 'reactstrap'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { connectModal } from 'redux-modal'
import { createStructuredSelector } from 'reselect'
import { Field, reduxForm } from 'redux-form'
import DateTimeField from 'components/DateTimeField'
import { distanceUnit, getDateStr } from 'helpers'
import { getReport } from 'redux/modules/user'
import { reportSelector } from 'redux/selectors'

class ReportModal extends React.Component {
  static propTypes = {
    handleHide: PropTypes.func,
    handleSubmit: PropTypes.func,
    hide: PropTypes.func,
    report: PropTypes.object,
    show: PropTypes.bool,
    user: PropTypes.object
  };

  componentWillMount () {
    this.loadReport(this.props)
  }

  componentWillUpdate (nextProps, nextState) {
    if (this.props.user.id !== nextProps.user.id) {
      this.loadReport(nextProps)
    }
  }

  handleFilter = (values) => {
    const { getReport, user } = this.props
    getReport({
      id: user.id,
      params: {
        from: getDateStr(values.from),
        to: getDateStr(values.to)
      }
    })
  }

  loadReport (props) {
    const { getReport, user } = props
    user && getReport({ id: user.id })
  }

  render() {
    const { show, handleHide, handleSubmit, report, user } = this.props

    return (
      <Modal isOpen={show} toggle={handleHide} size='lg'>
        <ModalHeader toggle={this.toggle}>User Records Report</ModalHeader>
        <ModalBody>
          <Row>
            <Col xs={12} sm={4}>
              <FormGroup row>
                <Label sm={4}>Name:</Label>
                <Col sm={8}>
                  <Input static>
                    {user && user.first_name} {user && user.last_name}
                  </Input>
                </Col>
              </FormGroup>
            </Col>
            <Col xs={12} sm={8}>
              <Form inline onSubmit={handleSubmit(this.handleFilter)}>
                <Field
                  placeholder='From'
                  name='from'
                  dateFormat='YYYY-MM-DD'
                  timeFormat={false}
                  component={DateTimeField}
                />
                {' '}
                <Field
                  placeholder='To'
                  name='to'
                  dateFormat='YYYY-MM-DD'
                  timeFormat={false}
                  component={DateTimeField}
                />
                {' '}
                <Button color='secondary'>Filter</Button>
              </Form>
            </Col>
          </Row>
          {report && <Table striped responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>From</th>
                <th>To</th>
                <th>Distance</th>
                <th>Avg. Speed</th>
              </tr>
            </thead>
            <tbody>
              {report.weekly.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.from}</td>
                  <td>{item.to}</td>
                  <td>{distanceUnit(item.distance)}</td>
                  <td>{distanceUnit(item.avg_speed, '/s')}</td>
                </tr>
              ))}
            </tbody>
          </Table>}
          <Row>
            <Col xs={6}>
              <FormGroup row>
                <Label sm={4}>Avg. Speed:</Label>
                <Col sm={8}>
                  <Input static>
                    {report && distanceUnit(report.avg_speed, '/s')}
                  </Input>
                </Col>
              </FormGroup>
            </Col>
            <Col xs={6}>
              <FormGroup row>
                <Label sm={4}>Distance/week:</Label>
                <Col sm={8}>
                  <Input static>
                    {report && distanceUnit(report.distance_per_week)}
                  </Input>
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleHide}>Close</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

const selector = createStructuredSelector({
  report: reportSelector
})

const actions = {
  getReport
}

export default compose(
  connectModal({ name: 'reportModal', destroyOnHide: false }),
  connect(selector, actions),
  reduxForm({
    form: 'reportFilterForm',
    enableReinitialize: true
  }),
)(ReportModal)
