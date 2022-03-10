import { gql } from '@apollo/client';

export const REACHES = gql(`
query Reaches {
  reaches {
    id
    name
    class
    section
    gages {
      id
      name
      latestReading
      updatedAt
    }
  }
}
`);

export const REACH = gql(`
query Reach ($id: Int!) {
  reach(id: $id) {
    id
    name
    class
    section
    description
    features {
      id
      name
    }
    media {
      id
    }
    users {
      id
      firstName
      lastName
    }
  }
}
`);
