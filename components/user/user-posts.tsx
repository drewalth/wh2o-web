import { IPost } from '../../interfaces'

interface UserPostsProps {
  userId: number
  posts: IPost[]
}

export const UserPosts = (props: UserPostsProps) => {
  return <div>yo!</div>
}
