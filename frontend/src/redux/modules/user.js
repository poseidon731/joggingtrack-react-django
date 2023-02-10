import { createAction, handleActions } from 'redux-actions'
import { requestSuccess, requestFail } from 'redux/api/request'
import { omit, reject } from 'lodash'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_USER = 'GET_USER'
export const GET_USERS = 'GET_USERS'
export const CREATE_USER = 'CREATE_USER'
export const UPDATE_USER = 'UPDATE_USER'
export const DELETE_USER = 'DELETE_USER'
export const GET_USER_REPORT = 'GET_USER_REPORT'

// ------------------------------------
// Actions
// ------------------------------------

export const getUser = createAction(GET_USER)
export const getUsers = createAction(GET_USERS)
export const createUser = createAction(CREATE_USER)
export const updateUser = createAction(UPDATE_USER)
export const deleteUser = createAction(DELETE_USER)
export const getReport = createAction(GET_USER_REPORT)

const initialState = {
  user: null,
  status: 'INIT',
  users: [],
  params: {
    count: 0,
    previous: null,
    next: null,
    page_size: 10,
    page: 1
  },
  report: null
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [requestSuccess(GET_USER)]: (state, { payload }) => ({
    ...state,
    status: requestSuccess(GET_USER),
    user: payload,
    error: null
  }),

  [requestFail(GET_USER)]: (state, { payload }) => ({
    ...state,
    status: requestFail(GET_USER),
    error: payload
  }),

  [requestSuccess(GET_USERS)]: (state, { payload }) => ({
    ...state,
    status: requestSuccess(GET_USERS),
    users: payload.results,
    params: {
      ...state.params,
      ...omit(payload, 'results')
    },
    error: null
  }),

  [requestFail(GET_USERS)]: (state, { payload }) => ({
    ...state,
    status: requestFail(GET_USERS),
    error: payload
  }),

  [requestSuccess(CREATE_USER)]: (state, { payload }) => ({
    ...state,
    status: requestSuccess(CREATE_USER),
    user: payload,
    error: null
  }),

  [requestFail(CREATE_USER)]: (state, { payload }) => ({
    ...state,
    status: requestFail(CREATE_USER),
    error: payload
  }),

  [requestSuccess(UPDATE_USER)]: (state, { payload }) => ({
    ...state,
    status: requestSuccess(UPDATE_USER),
    user: payload,
    error: null
  }),

  [requestFail(UPDATE_USER)]: (state, { payload }) => ({
    ...state,
    status: requestFail(UPDATE_USER),
    error: payload
  }),

  [requestSuccess(DELETE_USER)]: (state, { payload }) => ({
    ...state,
    status: requestSuccess(DELETE_USER),
    users: reject(state.users, { id: payload.id }),
    params: {
      ...state.params,
      count: Math.max(state.params.count - 1, 0),
    },
    error: null
  }),

  [requestFail(DELETE_USER)]: (state, { payload }) => ({
    ...state,
    status: requestFail(DELETE_USER),
    error: payload
  }),

  [requestSuccess(GET_USER_REPORT)]: (state, { payload }) => ({
    ...state,
    report: payload
  }),

  [requestFail(GET_USER_REPORT)]: (state) => ({
    ...state,
    report: null
  })

}, initialState)
