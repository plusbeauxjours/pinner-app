import gql from "graphql-tag";
import { CONTINENT_FRAGMENT } from "src/fragmentQueries";

export const TOP_CONTINENTS = gql`
  query TopContinents($userName: String!) {
    topContinents(userName: $userName) {
      continents {
        count
        diff
        ...ContinentParts
      }
    }
  }
  ${CONTINENT_FRAGMENT}
`;
