import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import { reducer as modal } from 'redux-modal'

import auth from './modules/auth'
import tracking from './modules/tracking'
import user from './modules/user'

export default combineReducers({
  auth,
  form,
  modal,
  tracking,
  user
})
