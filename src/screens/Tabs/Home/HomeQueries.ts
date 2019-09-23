import gql from "graphql-tag";
import {
  MATCH_FRAGMENT,
  PROFILE_FRAGMENT,
  CITY_FRAGMENT
} from "../../..//fragmentQueries";

export const RECOMMEND_USERS = gql`
  query RecommendUsers($page: Int) {
    recommendUsers(page: $page) {
      page
      hasNextPage
      users {
        ...ProfileParts
      }
    }
  }
  ${PROFILE_FRAGMENT}
`;

export const RECOMMEND_LOCATIONS = gql`
  query RecommendLocations($page: Int) {
    recommendLocations(page: $page) {
      page
      hasNextPage
      cities {
        ...CityParts
      }
    }
  }
  ${CITY_FRAGMENT}
`;

export const GET_MATCHES = gql`
  query GetMatches($matchPage: Int) {
    getMatches(matchPage: $matchPage) {
      matches {
        ...MatchParts
      }
    }
  }
  ${MATCH_FRAGMENT}
`;

export const MARK_AS_READ_MATCH = gql`
  mutation MarkAsReadMatch($matchId: String!) {
    markAsReadMatch(matchId: $matchId) {
      ok
      matchId
      isReadByHost
      isReadByGuest
    }
  }
`;
