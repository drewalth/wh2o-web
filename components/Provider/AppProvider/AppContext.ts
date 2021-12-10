import { createContext, useContext } from 'react'

export type AppContextData = {
  windowWidth: number
}

export const AppContext = createContext({} as AppContextData)

export const useAppContext = () => useContext(AppContext)
