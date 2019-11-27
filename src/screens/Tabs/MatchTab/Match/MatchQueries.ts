import gql from "graphql-tag";
import { MATCH_FRAGMENT } from "../../../../fragmentQueries";

export const GET_MATCHES = gql`
  query GetMatches($page: Int) {
    getMatches(page: $page) {
      matches {
        ...MatchParts
      }
    }
  }
  ${MATCH_FRAGMENT}
`;

export const MARK_AS_READ_MATCH = gql`
  mutation MarkAsReadMatch($matchId: Int!) {
    markAsReadMatch(matchId: $matchId) {
      ok
      matchId
      isReadByHost
      isReadByGuest
    }
  }
`;
