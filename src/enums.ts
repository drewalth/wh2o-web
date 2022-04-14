/* eslint-disable no-unused-vars */

export enum Endpoints {
  GAGE = '/gage',
  ALERT = '/alert',
  GAGE_SOURCES = '/gage-sources',
  SETTINGS = '/user',
  EXPORT = '/export',
  IMPORT = '/import',
  LIB = '/lib',
  AUTH = '/auth',
}

export enum AlertInterval {
  DAILY = 'daily',
  IMMEDIATE = 'immediate',
}

export enum AlertCriteria {
  ABOVE = 'above',
  BELOW = 'below',
  BETWEEN = 'between',
}

export enum AlertChannel {
  EMAIL = 'email',
  SMS = 'sms',
}
