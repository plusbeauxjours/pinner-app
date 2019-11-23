import { gql } from "apollo-boost";

export const EMAIL_SIGN_IN = gql`
  mutation StartEmailVerification($emailAddress: String!) {
    startEmailVerification(emailAddress: $emailAddress) {
      ok
    }
  }
`;

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

export const PHONE_SIGN_IN = gql`
  mutation StartPhoneVerification($phoneNumber: String!) {
    startPhoneVerification(phoneNumber: $phoneNumber) {
      ok
    }
  }
`;
