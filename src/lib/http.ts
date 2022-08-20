import { getToken } from './token'

const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'

const getHeaders = () => {
  const defaultHeaders = {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': window.location.origin,
    },
  }

  const token = getToken()

  if (token) {
    defaultHeaders.headers = {
      ...defaultHeaders.headers,
      // @ts-ignore
      Authorization: `Bearer ${token}`,
    }
  }
  return defaultHeaders
}

const get = (url: string, options?: RequestInit) => {
  return fetch(baseUrl + url, {
    method: 'GET',
    ...getHeaders(),
    ...options,
  } as RequestInit)
}

const post = (url: string, options?: RequestInit) => {
  return fetch(baseUrl + url, {
    method: 'POST',
    ...getHeaders(),
    ...options,
  } as RequestInit)
}

const put = (url: string, options?: RequestInit) => {
  return fetch(baseUrl + url, {
    method: 'PUT',
    ...getHeaders(),
    ...options,
  } as RequestInit)
}

const http = {
  get,
  post,
  put,
  delete: (url: string, options?: RequestInit) => {
    return fetch(baseUrl + url, {
      method: 'DELETE',
      ...getHeaders(),
      ...options,
    } as RequestInit)
  },
}

export const checkResponse = async (res: Response) => {
  if (!res.ok) {
    const text = await res.text()

    throw new Error(text || res.statusText)
  }
  return res.json()
}

export default http
