const tokenName = 'wh2o-token'

export const getToken = (): string => localStorage.getItem(tokenName) || ''

export const setToken = (token: string) =>
  localStorage.setItem(tokenName, token)

export const clearToken = () => localStorage.removeItem(tokenName)
