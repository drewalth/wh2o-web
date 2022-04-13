const tokenName = 'wh2o-token'

export const getToken = (): string => {
  return localStorage.getItem(tokenName) || ''
}

export const setToken = (token: string) => {
  localStorage.setItem(tokenName, token)
}
