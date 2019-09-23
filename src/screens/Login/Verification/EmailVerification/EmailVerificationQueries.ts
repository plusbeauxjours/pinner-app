import { gql } from "apollo-boost";

export const COMPLETE_EMAIL_SIGN_IN = gql`
  mutation CompleteEmailVerification($key: String!, $cityId: String!) {
    completeEmailVerification(key: $key, cityId: $cityId) {
      ok
      token
      user {
        username
        profile {
          avatarUrl
          appAvatarUrl
          currentCity {
            cityId
            cityName
          }
        }
      }
    }
  }
`;
