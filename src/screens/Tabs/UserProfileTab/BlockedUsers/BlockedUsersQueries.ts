import gql from "graphql-tag";

export const GET_BLOCkED_USER = gql`
  query GetBlockedUser {
    getBlockedUser {
      blockedUsers {
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
