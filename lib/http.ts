import axios from 'axios'

const http = axios.create({
  baseURL: process.env.apiBaseUrl,
})

http.interceptors.request.use((req) => {
  const token = localStorage.getItem('wh2o-auth-token')

  if (token) {
    req.headers['Authorization'] = `Bearer ${token}`
  }

  return req
})

export { http }
