import gql from "graphql-tag";
import {
  PROFILE_FRAGMENT,
  CITY_FRAGMENT,
  CONTINENT_FRAGMENT
} from "../../../../fragmentQueries";

export const CITY_PROFILE = gql`
  query CityProfile($page: Int, $cityId: String!, $payload: String) {
    cityProfile(page: $page, cityId: $cityId, payload: $payload) {
      count
      usersNow {
        ...ProfileParts
      }
      usersBefore {
        naturalTime
        actor {
          profile {
            ...ProfileParts
          }
        }
      }
      city {
        id
        latitude
        longitude
        cityId
        cityName
        cityPhoto
        country {
          countryName
          countryPhoto
          countryCode
          countryEmoji
          continent {
            ...ContinentParts
          }
        }
        likeCount
        isLiked
        userCount
        userLogCount
        count
        diff
      }
    }
  }
  ${PROFILE_FRAGMENT}
  ${CONTINENT_FRAGMENT}
`;

export const GET_SAMENAME_CITIES = gql`
  query GetSamenameCities($cityId: String!) {
    getSamenameCities(cityId: $cityId) {
      cities {
        ...CityParts
      }
    }
  }
  ${CITY_FRAGMENT}
`;

export const NEAR_CITIES = gql`
  query NearCities($cityId: String!, $page: Int, $payload: String) {
    nearCities(cityId: $cityId, page: $page, payload: $payload) {
      page
      hasNextPage
      cities {
        ...CityParts
      }
    }
  }
  ${CITY_FRAGMENT}
`;
