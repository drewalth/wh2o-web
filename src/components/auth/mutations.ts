import { gql } from '@apollo/client';

export const LOGIN = gql(`
mutation($authLoginInput: AuthLoginInput!) {
  login (authLoginInput: $authLoginInput) {
    id
    email
    role
    token
  }
}
`);
