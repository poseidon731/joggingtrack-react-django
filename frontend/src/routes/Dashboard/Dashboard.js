import React from 'react'
import { Button, ButtonGroup, Col, Jumbotron, Row } from 'reactstrap'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { show } from 'redux-modal'
import { createStructuredSelector } from 'reselect'
import { canManageUsers } from 'helpers/roleHelpers'
import { profileSelector } from 'redux/selectors'
import ReportModal from 'containers/ReportModal'
import './Dashboard.scss'

const Dashboard = ({ profile, show }) => (
  <Row>
    <Col xs={12} md={{ size: 6, offset: 3 }}>
      <Jumbotron>
        <h1>Welcome, {profile.first_name}!</h1>
        <p className="lead">
          Thanks for using Jogging Tracker. <br />
          Please use the following navigations to use this app.
        </p>
        <ButtonGroup vertical className='btn-block'>
          {canManageUsers(profile) &&
            <Button tag={Link} to='/users' className='text-left'>Manage Users</Button>
          }
          <Button tag={Link} to='/records' className='text-left'>
            Manage Jogging Tracking Records
          </Button>
          <Button onClick={()=> show('reportModal')} className='text-left'>View My Report</Button>
          <Button tag={Link} to='/profile' className='text-left'>Edit Your Profile</Button>
        </ButtonGroup>
      </Jumbotron>
      <ReportModal user={profile} />
    </Col>
  </Row>
)

const selector = createStructuredSelector({
  profile: profileSelector
})

const actions = {
  show
}

export default connect(selector, actions)(Dashboard)
