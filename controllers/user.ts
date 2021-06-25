import { http } from 'lib'
import { IRiver } from 'interfaces'

export const getUser = (id: number | string) => {
  return http.get(`/users/id/${id}`).then((res) => res.data)
}

export const userBookmarkGage = async (
  userId: number,
  gageId: number,
  primary = false
) => {
  return http
    .post('users/add-gage', { userId, gageId, primary })
    .then((res) => res.data)
}

export const removeBookmarkGage = async (userId: number, gageId: number) => {
  return http
    .delete(`users/remove-gage/${userId}/${gageId}`)
    .then((res) => res.data)
}

export const userBookmarkRiver = async (
  userId: number,
  riverId: number,
  primary = false
) => {
  return http
    .post('users/reaches', { userId, riverId, primary })
    .then((res) => res.data)
}

export const removeBookmarkRiver = async (
  userId: number | undefined,
  riverId: number
) => {
  return http
    .delete(`users/rivers/${userId}/${riverId}`)
    .then((res) => res.data)
}

export const getUserRivers = async (
  userId: string | number
): Promise<IRiver[]> => {
  return http.get(`/users/rivers/${userId}`).then((res) => res.data)
}

export const createUserGageNotify = async (data: { userId: number }) => {
  return new Promise((resolve) => setTimeout(resolve, 2000))
}

export const deleteUser = async (userId: string | number) => {
  return http.delete(`/users/${userId}`).then((res) => res.data)
}
