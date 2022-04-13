import axios, { AxiosRequestConfig } from 'axios'
import { getToken } from './token'
import * as qs from 'qs'
/**
 * Use fallback baseURL for local development
 */
const config: AxiosRequestConfig = {
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
}

const http = axios.create(config)

http.interceptors.request.use((request) => {
  const token = getToken()

  if (token) {
    // @ts-ignore
    request.headers['Authorization'] = `Bearer ${token}`
  }

  if (request.method === 'PUT') {
    // @ts-ignore
    request.headers['content-type'] = 'application/x-www-form-urlencoded'
    const dataRef = request.data
    request.data = qs.stringify(dataRef)
  }

  return request
})

export default http