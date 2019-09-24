import gql from "graphql-tag";
import { COUNTRY_FRAGMENT } from "../../../../fragmentQueries";

export const TOP_COUNTRIES = gql`
  query TopCountries($userName: String!) {
    topCountries(userName: $userName) {
      countries {
        count
        diff
        ...CountryParts
      }
    }
  }
  ${COUNTRY_FRAGMENT}
`;
