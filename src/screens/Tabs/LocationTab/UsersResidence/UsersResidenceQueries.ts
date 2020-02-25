import gql from "graphql-tag";

export const GET_RESIDENCE_USERS = gql`
  query GetResidenceUsers($countryCode: String!, $payload: String) {
    getResidenceUsers(countryCode: $countryCode, payload: $payload) {
      users {
        id
        uuid
        username
        avatarUrl
        appAvatarUrl
        isSelf
        currentCity {
          cityName
          country {
            countryName
          }
        }
      }
    }
  }
`;
