import axios, { AxiosRequestConfig } from 'axios'
import { getToken } from './token'
/**
 * Use fallback baseURL for local development
 */
const config: AxiosRequestConfig = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    Accept: '*/*',
  },
}

const http = axios.create(config)

http.interceptors.request.use((request) => {
  const token = getToken()

  if (token) {
    // @ts-ignore
    request.headers['Authorization'] = `Bearer ${token}`
  }
  return request
})

export default http
