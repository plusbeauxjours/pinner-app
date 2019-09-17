import { gql } from "apollo-boost";

export const EMAIL_SIGN_IN = gql`
  mutation StartEmailVerification($emailAddress: String!) {
    startEmailVerification(emailAddress: $emailAddress) {
      ok
    }
  }
`;
