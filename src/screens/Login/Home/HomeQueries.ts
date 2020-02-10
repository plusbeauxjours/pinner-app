import gql from "graphql-tag";

export const EMAIL_SIGN_IN = gql`
  mutation StartEmailVerification($emailAddress: String!) {
    startEmailVerification(emailAddress: $emailAddress) {
      ok
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

export const COMPLETE_PHONE_SIGN_IN = gql`
  mutation CompletePhoneVerification(
    $key: String!
    $phoneNumber: String!
    $countryPhoneNumber: String!
    $countryPhoneCode: String!
    $cityId: String!
  ) {
    completePhoneVerification(
      key: $key
      phoneNumber: $phoneNumber
      countryPhoneNumber: $countryPhoneNumber
      countryPhoneCode: $countryPhoneCode
      cityId: $cityId
    ) {
      ok
      token
    }
  }
`;
