import { gql } from '@apollo/client';

export const UPDATE_REACH = gql(`
 mutation UpdateReach ($updateReachInput: UpdateReachInput!) {
  updateReach(updateReachInput:$updateReachInput) {
    id
    description
    name
    section
    class
  }
}`);
