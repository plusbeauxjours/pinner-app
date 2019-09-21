import gql from "graphql-tag";
import {
  PROFILE_FRAGMENT,
  CITY_FRAGMENT,
  CONTINENT_FRAGMENT
} from "../../sharedQueries";

export const CITY_PROFILE = gql`
  query CityProfile($page: Int, $cityId: String!) {
    cityProfile(page: $page, cityId: $cityId) {
      count
      hasNextPage
      usersNow {
        ...ProfileParts
      }
      usersBefore {
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
