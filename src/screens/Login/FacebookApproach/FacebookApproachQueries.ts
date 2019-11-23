import gql from "graphql-tag";

export const FACEBOOK_CONNECT = gql`
  mutation FacebookConnect(
    $firstName: String
    $lastName: String
    $email: String
    $gender: String
    $cityId: String!
    $countryCode: String!
    $fbId: String!
  ) {
    facebookConnect(
      firstName: $firstName
      lastName: $lastName
      email: $email
      gender: $gender
      cityId: $cityId
      countryCode: $countryCode
      fbId: $fbId
    ) {
      token
    }
  }
`;
