import { gql } from '@apollo/client'

export const LOGIN = gql(`
mutation AuthLogin($authLoginInput: AuthLoginInput!) {
  login (authLoginInput: $authLoginInput) {
    id
    email
    role
    token
  }
}
`)

export const REQUEST_ACCESS = gql(`
mutation RequestAccess($email:String!) {
  requestAccess(email: $email)
}
`)

export const FORGOT_PASSWORD = gql(`
mutation ForgotPassword($email:String!) {
  forgotPassword(email: $email)
}
`)

export const RESET_PASSWORD = gql(`
mutation ResetUserPassword($resetUserPasswordInput:ResetUserPasswordInput!) {
  resetUserPassword(resetUserPasswordInput: $resetUserPasswordInput)
}
`)
