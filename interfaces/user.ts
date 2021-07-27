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

export const UserModel: CreateUserDto = {
  firstName: '',
  lastName: '',
  email: '',
  telephone: '',
  timezone: 'America/Denver',
  password: '',
}

export interface CreateUserDto {
  firstName?: string
  lastName?: string
  telephone?: string
  password: string
  email: string
  timezone: string
}

export interface UpdateUserDto {
  firstName?: string
  lastName?: string
  email: string
  timezone: string
  telephone?: string
}

export interface User {
  verified: boolean
  media: Media[]
  role: user_role
  id: number
  firstName?: string
  lastName?: string
  password?: string
  telephone?: string
  email: string
  timezone: string
  gages: Gage[]
  posts: Post[]
  reaches: River[]
  notifications: Notification[]
  createdAt?: Date
  updatedAt?: Date
}
