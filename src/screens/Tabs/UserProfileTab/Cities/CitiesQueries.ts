import gql from "graphql-tag";
import { CITY_FRAGMENT } from "../../../../fragmentQueries";

export const FREQUENT_VISITS = gql`
  query FrequentVisits($userName: String!, $page: Int) {
    frequentVisits(userName: $userName, page: $page) {
      page
      hasNextPage
      cities {
        count
        diff
        ...CityParts
      }
    }
  }
  ${CITY_FRAGMENT}
`;
