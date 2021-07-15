import { http } from 'lib'
import { CreateNotificationDto } from '../interfaces'

export const createNotification = async (
  payload: CreateNotificationDto
): Promise<Notification> => {
  return http.post('/notifications', payload).then((res) => res.data)
}

export const deleteNotification = async (
  notificationId: number,
  gageId: number
): Promise<number> => {
  return http
    .delete(`/notifications/${notificationId}/${gageId}`)
    .then((res) => res.data)
}
