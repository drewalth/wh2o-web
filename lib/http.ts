import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3000',
})

http.interceptors.request.use((req) => {
  const token = localStorage.getItem('wh2o-auth-token')

  if (token) {
    req.headers['Authorization'] = `Bearer ${token}`
  }

  return req
})

export { http }
