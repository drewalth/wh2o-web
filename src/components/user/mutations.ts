import { gql } from '@apollo/client';

export const UPDATE_USER = gql(`
mutation($updateUserInput: UpdateUserInput!) {
  updateUser(updateUserInput: $updateUserInput) {
    id
    firstName
    lastName
    gages {
      id
      name
      latestReading
      metric
      updatedAt
      readings {
        value
      }
    }
  }
}
`);

export const REMOVE_NOTIFICATION = gql(`
mutation RemoveNotification ($id: Int!) {
  removeNotification(id: $id) {
    id
  }
}
`);

export const CREATE_NOTIFICATION = gql(`
mutation ($createNotificationInput: CreateNotificationInput!) {
  createNotification(createNotificationInput: $createNotificationInput) {
    id
    name
    interval
    minimum
    maximum
    value
  }
}
`);
