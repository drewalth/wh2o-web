import { gql } from '@apollo/client';

export const WHO_AM_I = gql(`
query WhoAmI{
  whoAmI {
    id
    firstName
    lastName
    email
  }
}
`);

export const USER = gql(`
query User($email: String!) {
  user(email: $email) {
    id
    firstName
    lastName
    createdAt
    updatedAt
    deletedAt
    email
    timezone
    role
    reaches {
      id
      name
      section
    }
    notifications {
      id
      name
      interval
      metric
      channel
      criteria
      minimum
      maximum
      value
      alertTime
      lastSent
      gage {
        id
        name
      }
    }
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

export const USER_GAGES = gql(`
query User($email: String!) {
  user(email: $email) {
    id
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
