import React from 'react'
import { Provider } from 'react-redux'
import store from 'redux/store'
import Routes from 'routes'

export default () => (
  <Provider store={store}>
    <div style={{ height: '100%' }}>
      <Routes />
    </div>
  </Provider>
)
