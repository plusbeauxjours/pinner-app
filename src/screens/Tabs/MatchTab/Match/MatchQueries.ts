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

export const COMPLETE_EDIT_EMAIL_VERIFICATION = gql`
  mutation CompleteEditEmailVerification($key: String!) {
    completeEditEmailVerification(key: $key) {
      ok
      token
      user {
        username
        profile {
          id
          gender
          residence {
            countryEmoji
            ...CountryParts
          }
          nationality {
            countryEmoji
            ...CountryParts
          }
          avatarUrl
          appAvatarUrl
          currentCity {
            cityId
            cityName
          }
        }
      }
    }
  }
`;

export const COMPLETE_EMAIL_SIGN_IN = gql`
  mutation CompleteEmailVerification($key: String!, $cityId: String!) {
    completeEmailVerification(key: $key, cityId: $cityId) {
      ok
      token
      user {
        username
        profile {
          id
          gender
          residence {
            countryEmoji
            ...CountryParts
          }
          nationality {
            countryEmoji
            ...CountryParts
          }
          avatarUrl
          appAvatarUrl
          currentCity {
            cityId
            cityName
          }
        }
      }
    }
  }
`;
