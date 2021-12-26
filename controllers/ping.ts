import { http } from '../lib'

export const ping = () => {
  return http.get('/').then((res) => res.data)
}

export const webhookTest = async () => {
  return new Promise(resolve => setTimeout(resolve, 3000))
}
