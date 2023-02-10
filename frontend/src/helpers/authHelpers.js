import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect'
import connectedAuthWrapper from 'redux-auth-wrapper/connectedAuthWrapper'
import { DO_LOGIN } from 'redux/modules/auth'
import { requestPending } from 'redux/api/request'
import { isAdmin, isManager } from './roleHelpers'
import LoggingIn from 'components/LoggingIn'

const locationHelper = locationHelperBuilder({})

export const isLoggingIn = state => requestPending(DO_LOGIN) === state.auth.status

const userIsAuthenticatedDefaults = {
  authenticatedSelector: state => state.auth.me !== null,
  authenticatingSelector: state => isLoggingIn(state),
  wrapperDisplayName: 'UserIsAuthenticated'
}

export const userIsAuthenticated = connectedAuthWrapper(userIsAuthenticatedDefaults)

export const userIsAuthenticatedRedir = connectedRouterRedirect({
  ...userIsAuthenticatedDefaults,
  AuthenticatingComponent: LoggingIn,
  redirectPath: '/login'
})

export const userIsAdminOrManagerRedir = connectedRouterRedirect({
  redirectPath: '/dashboard',
  allowRedirectBack: false,
  authenticatedSelector: state => state.auth.me !== null &&
    (isAdmin(state.auth.me) || isManager(state.auth.me)),
  predicate: user => isAdmin(user) || isManager(user),
  wrapperDisplayName: 'UserIsAdminOrManager'
})

const userIsNotAuthenticatedDefaults = {
  // Want to redirect the user when they are done LoggingIn and authenticated
  authenticatedSelector: state => state.auth.me === null && !isLoggingIn(state),
  wrapperDisplayName: 'UserIsNotAuthenticated'
}

export const userIsNotAuthenticated = connectedAuthWrapper(userIsNotAuthenticatedDefaults)

export const userIsNotAuthenticatedRedir = connectedRouterRedirect({
  ...userIsNotAuthenticatedDefaults,
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/dashboard',
  allowRedirectBack: false
})
