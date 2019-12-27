import gql from "graphql-tag";

export const APPLE_CONNECT = gql`
  mutation AppleConnect(
    $firstName: String
    $lastName: String
    $email: String
    $cityId: String!
    $countryCode: String!
    $appleId: String!
  ) {
    appleConnect(
      firstName: $firstName
      lastName: $lastName
      email: $email
      cityId: $cityId
      countryCode: $countryCode
      appleId: $appleId
    ) {
      token
    }
  }
`;
