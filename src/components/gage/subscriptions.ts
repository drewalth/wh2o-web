import { gql } from '@apollo/client';

export const GAGES_UPDATED_SUB = gql(`
subscription {
  gagesUpdated
}
`);
