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
  DAILY = 'DAILY',
  IMMEDIATE = 'IMMEDIATE',
}

export enum AlertCriteria {
  ABOVE = 'ABOVE',
  BELOW = 'BELOW',
  BETWEEN = 'BETWEEN',
}

export enum AlertChannel {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

export enum DateFormat {
  DDHHMMA = 'dd hh:mm a',
  LLLL = 'llll',
}

export enum GradeRating {
  I = 'I',
  II = 'II',
  II_PLUS = 'II+',
  III = 'III',
  III_PLUS = 'III+',
  IV = 'IV',
  IV_PLUS = 'IV+',
  V = 'V',
  V_PLUS = 'V+',
}
