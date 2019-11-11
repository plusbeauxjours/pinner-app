import gql from "graphql-tag";
import { COUNTRY_FRAGMENT } from "../../../../fragmentQueries";

export const TOP_COUNTRIES = gql`
  query TopCountries($userName: String!, $page: Int) {
    topCountries(userName: $userName, page: $page) {
      page
      hasNextPage
      countries {
        count
        diff
        ...CountryParts
      }
    }
  }
  ${COUNTRY_FRAGMENT}
`;
