import React from 'react'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { Container } from 'reactstrap'
import Dashboard from './Dashboard'
import Header from 'containers/Header'
import Login from './Login'
import Profile from './Profile'
import Records from './Records'
import Signup from './Signup'
import Users from './Users'
import { userIsAuthenticatedRedir, userIsNotAuthenticatedRedir, userIsAdminOrManagerRedir }
  from 'helpers/authHelpers'
import 'styles/core.scss'

const routes = ({ isAuthenticated }) => (
  <Router>
    <div>
      <Header />
      <Container className='main-content'>
        <Route exact path='/' render={() => (
          isAuthenticated ? (
            <Redirect to="/dashboard"/>
          ) : (
            <Redirect to="/login"/>
          )
        )} />
        <Route path='/login' component={userIsNotAuthenticatedRedir(Login)} />
        <Route path='/signup' component={userIsNotAuthenticatedRedir(Signup)} />
        <Route path='/dashboard' component={userIsAuthenticatedRedir(Dashboard)} />
        <Route path='/profile' component={userIsAuthenticatedRedir(Profile)} />
        <Route path='/users' component={userIsAuthenticatedRedir(
          userIsAdminOrManagerRedir(Users)
        )} />
        <Route path='/records' component={userIsAuthenticatedRedir(Records)} />
      </Container>
    </div>
  </Router>
)

const selector = (state) => ({
  isAuthenticated: !!state.auth.me
})

export default connect(selector)(routes)
