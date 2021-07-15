export enum postType {
  ALERT = 'ALERT',
  INFO = 'INFO',
  NEWS = 'NEWS',
  COMMENT = 'COMMENT',
}

export interface Post {
  published: boolean
  id: number
  userId: number
  reachId: number
  private: boolean
  content: string
  createdAt: Date
  updatedAt?: Date
  postType: postType
  title: string
  subtitle: string
}

export const PostModel: Post = {
  id: 0,
  userId: 0,
  reachId: 0,
  private: true,
  published: false,
  content: '',
  createdAt: new Date(),
  postType: postType.INFO,
  title: '',
  subtitle: '',
}
