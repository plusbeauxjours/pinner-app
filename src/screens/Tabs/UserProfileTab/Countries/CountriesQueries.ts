import gql from "graphql-tag";
import { COUNTRY_FRAGMENT } from "../../../../fragmentQueries";

export const TOP_COUNTRIES = gql`
  query TopCountries($uuid: String!, $page: Int) {
    topCountries(uuid: $uuid, page: $page) {
      countries {
        count
        diff
        ...CountryParts
      }
    }
  }
  ${COUNTRY_FRAGMENT}
`;
