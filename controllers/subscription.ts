import axios from 'axios'
import { SubscriptionPrice } from 'types'

export const initSubscription = async (priceId: SubscriptionPrice) => {
  return axios.post('/api/checkout_sessions', { priceId })
}
