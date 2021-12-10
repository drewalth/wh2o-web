import { AppContext } from './AppContext'
import { ReactNode, useLayoutEffect, useState } from 'react'

type AppProviderProps = {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [windowWidth, setWindowWidth] = useState(0)

  const getWindowWidth = () => {
    setWindowWidth(window.innerWidth)
  }

  useLayoutEffect(() => {
    getWindowWidth()
    window.addEventListener('resize', getWindowWidth)
    return () => {
      window.removeEventListener('resize', getWindowWidth)
    }
  }, [])

  return (
    <AppContext.Provider value={{ windowWidth }}>
      {children}
    </AppContext.Provider>
  )
}
