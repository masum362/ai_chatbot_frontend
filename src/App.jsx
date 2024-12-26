import React from 'react'
import Router from './router/router'
import UserProvider from './context/user.context'

const App = () => {
  return (
    <UserProvider>
      <Router />
    </UserProvider>
  )
}

export default App