import gql from "graphql-tag";
import {
  PROFILE_FRAGMENT,
  CITY_FRAGMENT,
  CONTINENT_FRAGMENT
} from "../../../../fragmentQueries";

export const CITY_PROFILE = gql`
  query CityProfile($page: Int, $cityId: String!) {
    cityProfile(page: $page, cityId: $cityId) {
      count
      hasNextPage
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
  query NearCities($cityId: String!, $page: Int) {
    nearCities(cityId: $cityId, page: $page) {
      page
      hasNextPage
      cities {
        ...CityParts
      }
    }
  }
  ${CITY_FRAGMENT}
`;
