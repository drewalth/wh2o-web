import { Gage, GageReadingMetric } from './gage'

export enum NotificationInterval {
  IMMEDIATE = 'IMMEDIATE',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum NotificationCriteria {
  ABOVE = 'ABOVE',
  BELOW = 'BELOW',
  BETWEEN = 'BETWEEN',
  DISABLED = 'DISABLED',
}

export enum NotificationChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
}

export interface CreateNotificationDto {
  criteria: NotificationCriteria
  gageDisabled: boolean
  metric: GageReadingMetric
  channel: NotificationChannel
  interval: NotificationInterval
  alertTime?: Date
  name?: string
  userId: number
  gageId: number
  primary: boolean
  minimum?: number
  maximum?: number
}

export interface Notification {
  id: number
  criteria: NotificationCriteria
  gageDisabled: boolean
  active: boolean // user paused
  metric: GageReadingMetric
  channel: NotificationChannel
  interval: NotificationInterval
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
  alertTime: Date
  name?: string
  userId: number
  gages: Gage[]
  primary: boolean
  minimum?: number
  maximum?: number
  count: number
}
