import gql from "graphql-tag";
import { CONTINENT_FRAGMENT } from "../../../../fragmentQueries";

export const TOP_CONTINENTS = gql`
  query TopContinents($userName: String!, $page: Int) {
    topContinents(userName: $userName, page: $page) {
      continents {
        count
        diff
        ...ContinentParts
      }
    }
  }
  ${CONTINENT_FRAGMENT}
`;
