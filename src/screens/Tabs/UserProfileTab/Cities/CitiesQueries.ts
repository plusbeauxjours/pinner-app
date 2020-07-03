import gql from "graphql-tag";
import { CITY_FRAGMENT } from "../../../../fragmentQueries";

export const FREQUENT_VISITS = gql`
  query FrequentVisits($uuid: String!, $page: Int) {
    frequentVisits(uuid: $uuid, page: $page) {
      cities {
        count
        ...CityParts
      }
    }
  }
  ${CITY_FRAGMENT}
`;
