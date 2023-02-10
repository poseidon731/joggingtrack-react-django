import { all } from 'redux-saga/effects'
import auth from './auth'
import tracking from './tracking'
import user from './user'

export default function* rootSaga () {
  yield all([
    auth(),
    tracking(),
    user()
  ])
}
