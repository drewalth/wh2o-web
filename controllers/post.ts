import { http } from 'lib'
import { CreatePostDto, Post } from 'types'

export const createPost = async (data: CreatePostDto): Promise<Post> => {
  return http.post('/posts', data).then((res) => res.data)
}

export const updatePost = async (post: Post): Promise<Post> => {
  return http.patch(`/posts/${post.id}`, post).then((res) => res.data)
}

export const getRiverPosts = async (
  riverId: string | number
): Promise<Post[]> => {
  return http.get(`/posts/river/${riverId}`).then((res) => res.data)
}

export const deletePost = async (postId: number | string): Promise<Post> => {
  return http.delete(`/posts/${postId}`).then((res) => res.data)
}
