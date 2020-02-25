import gql from "graphql-tag";

export const GET_NATIONALITY_USERS = gql`
  query GetNationalityUsers($countryCode: String!, $payload: String) {
    getNationalityUsers(countryCode: $countryCode, payload: $payload) {
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
