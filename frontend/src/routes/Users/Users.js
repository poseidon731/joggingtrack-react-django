import React from 'react'
import { Route } from 'react-router-dom'
import UserEdit from '../UserEdit'
import UsersList from '../UsersList'

export default () => (
  <div>
    <Route path='/users' exact component={UsersList} />
    <Route path='/users/edit/:id' component={UserEdit} />
    <Route path='/users/new' component={UserEdit} />
  </div>
)
