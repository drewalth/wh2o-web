import { http } from 'lib'
import { UpdateUserDto, User } from '../interfaces'

export const getUser = (id: number | string) => {
  return http.get(`/users/id/${id}`).then((res) => res.data)
}

export const updateUser = async (
  id: number,
  payload: UpdateUserDto
): Promise<User> => {
  return http.patch(`/users/${id}`, payload).then((res) => res.data)
}

export const userBookmarkGage = async (
  userId: number,
  gageId: number,
  primary = false
) => {
  return http
    .post('user-gages', { userId, gageId, primary })
    .then((res) => res.data)
}

export const removeBookmarkGage = async (userId: number, gageId: number) => {
  return http.delete(`user-gages/${userId}/${gageId}`).then((res) => res.data)
}

export const userBookmarkRiver = async (
  userId: number,
  reachId: number,
  primary = false
) => {
  return http
    .post('/reach-users', { userId, reachId, primary })
    .then((res) => res.data)
}

export const removeBookmarkRiver = async (
  userId: number | undefined,
  reachId: number
) => {
  return http
    .delete(`/reach-users/${userId}/${reachId}`)
    .then((res) => res.data)
}

export const createUserGageNotify = async (data: { userId: number }) => {
  return new Promise((resolve) => setTimeout(resolve, 2000))
}

export const deleteUser = async (userId: string | number) => {
  return http.delete(`/users/${userId}`).then((res) => res.data)
}

export const verifyUser = async (id: number, token: string) => {
  return http.post('/users/verify', { id, token }).then((res) => res.data)
}

export const forgotPassword = async (payload: { email: string }) => {
  return http.post('/users/forgot', payload).then((res) => res.data)
}

export const resetPassword = async (payload: {
  id: number
  newPassword: string
  token: string
}) => {
  return http.post('/users/reset', payload).then((res) => res.data)
}
