import React, { ReactNode } from 'react'
import { GageProvider } from '../Provider/GageProvider'
import { UserProvider } from '../User/UserProvider'
import { AppContext, NodeEnv } from './AppContext'

type AppProviderProps = {
  children: ReactNode
}

const AppProvider = ({ children }: AppProviderProps): JSX.Element => {
  return (
    <AppContext.Provider
      value={{
        env: process.env.NODE_ENV as NodeEnv,
      }}
    >
      <UserProvider>
        <GageProvider>{children}</GageProvider>
      </UserProvider>
    </AppContext.Provider>
  )
}

export default AppProvider
