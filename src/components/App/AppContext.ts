import { createContext, useContext } from 'react'

export type NodeEnv = 'development' | 'production'

export type AppContextData = {
  env: NodeEnv
}

export const AppContext = createContext({} as AppContextData)

export const useAppContext = () => {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error('must use context inside valid provider')
  }

  return context
}
