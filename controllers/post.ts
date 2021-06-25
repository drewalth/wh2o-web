import { http } from 'lib'
import { IPost } from 'interfaces'

export const createPost = async (data: IPost): Promise<IPost> => {
  return http.post('/posts', data).then((res) => res.data)
}

export const getRiverPosts = async (
  riverId: string | number
): Promise<IPost[]> => {
  return http.get(`/posts/river/${riverId}`).then((res) => res.data)
}

export const deletePost = async (postId: number | string): Promise<IPost> => {
  return http.delete(`/posts/${postId}`).then((res) => res.data)
}
