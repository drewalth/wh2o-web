import { http } from '../lib'
import { Timezone } from '../interfaces'

export const getTimezones = async (): Promise<Timezone[]> => {
  return http.get('timezones').then((res) => res.data)
}
