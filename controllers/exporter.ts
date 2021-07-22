import { http } from '../lib'

export const exportReachPDF = (reachID: number) => {
  return http.get(`/exporter/pdf?reachId=${reachID}`).then((res) => res.data)
}
