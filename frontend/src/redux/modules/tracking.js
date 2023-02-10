import { createAction, handleActions } from 'redux-actions'
import { requestSuccess, requestFail } from 'redux/api/request'
import { omit, reject } from 'lodash'

// ------------------------------------
// Constants
// ------------------------------------
export const GET_RECORD = 'GET_RECORD'
export const GET_RECORDS = 'GET_RECORDS'
export const CREATE_RECORD = 'CREATE_RECORD'
export const UPDATE_RECORD = 'UPDATE_RECORD'
export const DELETE_RECORD = 'DELETE_RECORD'
export const SET_RECORDS_PAGINATION = 'SET_RECORDS_PAGINATION'

// ------------------------------------
// Actions
// ------------------------------------

export const getRecord = createAction(GET_RECORD)
export const getRecords = createAction(GET_RECORDS)
export const createRecord = createAction(CREATE_RECORD)
export const updateRecord = createAction(UPDATE_RECORD)
export const deleteRecord = createAction(DELETE_RECORD)

const initialState = {
  record: null,
  status: 'INIT',
  records: [],
  params: {
    count: 0,
    previous: null,
    next: null,
    page_size: 10,
    page: 1
  },
}

// ------------------------------------
// Reducer
// ------------------------------------
export default handleActions({
  [requestSuccess(GET_RECORD)]: (state, { payload }) => ({
    ...state,
    status: requestSuccess(GET_RECORD),
    record: payload,
    error: null
  }),

  [requestFail(GET_RECORD)]: (state, { payload }) => ({
    ...state,
    status: requestFail(GET_RECORD),
    error: payload
  }),

  [requestSuccess(GET_RECORDS)]: (state, { payload }) => ({
    ...state,
    status: requestSuccess(GET_RECORDS),
    records: payload.results,
    params: {
      ...state.params,
      ...omit(payload, 'results')
    },
    error: null
  }),

  [requestFail(GET_RECORDS)]: (state, { payload }) => ({
    ...state,
    status: requestFail(GET_RECORDS),
    error: payload
  }),

  [requestSuccess(CREATE_RECORD)]: (state, { payload }) => ({
    ...state,
    status: requestSuccess(CREATE_RECORD),
    record: payload,
    error: null
  }),

  [requestFail(CREATE_RECORD)]: (state, { payload }) => ({
    ...state,
    status: requestFail(CREATE_RECORD),
    error: payload
  }),

  [requestSuccess(UPDATE_RECORD)]: (state, { payload }) => ({
    ...state,
    status: requestSuccess(UPDATE_RECORD),
    record: payload,
    error: null
  }),

  [requestFail(UPDATE_RECORD)]: (state, { payload }) => ({
    ...state,
    status: requestFail(UPDATE_RECORD),
    error: payload
  }),

  [requestSuccess(DELETE_RECORD)]: (state, { payload }) => ({
    ...state,
    status: requestSuccess(DELETE_RECORD),
    records: reject(state.records, { id: payload.id }),
    params: {
      ...state.params,
      count: Math.max(state.params.count - 1, 0),
    },
    error: null
  }),

  [requestFail(DELETE_RECORD)]: (state, { payload }) => ({
    ...state,
    status: requestFail(DELETE_RECORD),
    error: payload
  }),

}, initialState)
