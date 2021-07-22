import { http } from '../lib'

export const exportReachPDF = () => {
  return http.get('/exporter/pdf').then((res) => res.data)
}
