import React, { ReactNode } from 'react'
import { GageProvider } from '../Provider/GageProvider'
import { UserProvider } from '../User/UserProvider'

type AppProviderProps = {
  children: ReactNode
}

const AppProvider = ({ children }: AppProviderProps): JSX.Element => {
  return (
    <UserProvider>
      <GageProvider>{children}</GageProvider>
    </UserProvider>
  )
}

export default AppProvider
