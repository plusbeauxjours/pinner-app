import gql from "graphql-tag";
import { MATCH_FRAGMENT, COFFEE_FRAGMENT } from "../../fragmentQueries";

export const MATCH = gql`
  mutation Match($coffeeId: String!) {
    match(coffeeId: $coffeeId) {
      ok
      coffeeId
      cityId
      countryCode
      continentCode
      match {
        ...MatchParts
      }
    }
  }
  ${MATCH_FRAGMENT}
`;

export const UNMATCH = gql`
  mutation UnMatch($matchId: String!) {
    unMatch(matchId: $matchId) {
      ok
      matchId
      cityId
      countryCode
      continentCode
      coffee {
        ...CoffeeParts
      }
    }
  }
  ${COFFEE_FRAGMENT}
`;
