import gql from "graphql-tag";
import { CONTINENT_FRAGMENT } from "../../../../fragmentQueries";

export const TOP_CONTINENTS = gql`
  query TopContinents($uuid: String!, $page: Int) {
    topContinents(uuid: $uuid, page: $page) {
      continents {
        count
        ...ContinentParts
      }
    }
  }
  ${CONTINENT_FRAGMENT}
`;
