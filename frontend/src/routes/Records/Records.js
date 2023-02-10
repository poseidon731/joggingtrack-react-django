import React from 'react'
import { Route } from 'react-router-dom'
import RecordEdit from '../RecordEdit'
import RecordsList from '../RecordsList'

export default () => (
  <div>
    <Route path='/records' exact component={RecordsList} />
    <Route path='/records/edit/:id' component={RecordEdit} />
    <Route path='/records/new' component={RecordEdit} />
  </div>
)
