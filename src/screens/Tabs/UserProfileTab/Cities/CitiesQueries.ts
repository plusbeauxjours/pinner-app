import gql from "graphql-tag";
import { CITY_FRAGMENT } from "src/fragmentQueries";

export const FREQUENT_VISITS = gql`
  query FrequentVisits($userName: String!) {
    frequentVisits(userName: $userName) {
      cities {
        count
        diff
        ...CityParts
      }
    }
  }
  ${CITY_FRAGMENT}
`;
