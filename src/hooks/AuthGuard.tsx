import { ReactNode } from 'react'
import { useLocalNavGuard } from './useLocalNavGuard'

export type AuthGuardProps = {
  children: ReactNode
}
export const AuthGuard = ({ children }: AuthGuardProps) => {
  useLocalNavGuard()

  return <>{children}</>
}
