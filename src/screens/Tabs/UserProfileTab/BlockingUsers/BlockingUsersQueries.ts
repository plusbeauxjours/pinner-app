import gql from "graphql-tag";

export const GET_BLOCKING_USER = gql`
  query GetBlockingUser {
    getBlockingUser {
      blockingUsers {
        id
        uuid
        username
        appAvatarUrl
        currentCity {
          cityName
          country {
            countryName
          }
        }
        isSelf
      }
    }
  }
`;
