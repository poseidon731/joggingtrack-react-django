import { get } from 'lodash'

export const authStateSelector = (state) =>
  get(state, 'auth')

export const profileSelector = (state) =>
  get(state, 'auth.me', null)

export const userDetailSelector = (state) =>
  get(state, 'user.user', {})

export const usersListSelector = (state) =>
  get(state, 'user.users', [])

export const recordDetailSelector = (state) =>
  get(state, 'tracking.record', {})

export const recordsListSelector = (state) =>
  get(state, 'tracking.records', [])

export const trackingStateSelector = (state) =>
  get(state, 'tracking', {})

export const userStateSelector = (state) =>
  get(state, 'user', {})

export const reportSelector = (state) =>
  get(state, 'user.report', {})

export const recordsParamsSelector = (state) =>
  get(state, 'tracking.params', {})

export const usersParamsSelector = (state) =>
  get(state, 'user.params', {})
