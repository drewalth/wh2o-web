import { Notification, Gage, Media, Post, River } from './index'

export enum user_role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPERADMIN = 'SUPERADMIN',
  EDITOR = 'EDITOR',
}

export interface UserLogin {
  email: string
  password: string
}

export interface UserLoginResponse {
  access_token: string
  user: User
}

export const UserModel: User = {
  firstName: '',
  lastName: '',
  email: '',
  gages: [],
  reaches: [],
  media: [],
  notifications: [],
  posts: [],
  verified: false,
  role: user_role.USER,
}

export interface User {
  verified: boolean
  media: Media[]
  role: user_role
  id?: number
  firstName?: string
  lastName?: string
  password?: string
  email: string
  gages: Gage[]
  posts: Post[]
  reaches: River[]
  notifications: Notification[]
  createdAt?: Date
  updatedAt?: Date
}
