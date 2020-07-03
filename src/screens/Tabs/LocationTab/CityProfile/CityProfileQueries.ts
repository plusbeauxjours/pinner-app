import gql from "graphql-tag";
import { CITY_FRAGMENT, CONTINENT_FRAGMENT } from "../../../../fragmentQueries";

export const CITY_PROFILE = gql`
  query CityProfile($page: Int, $cityId: String!, $payload: String) {
    cityProfile(page: $page, cityId: $cityId, payload: $payload) {
      count
      usersNow {
        id
        uuid
        username
        avatarUrl
        appAvatarUrl
        isSelf
        currentCity {
          cityName
          country {
            countryName
          }
        }
      }
      usersBefore {
        naturalTime
        actor {
          id
          uuid
          username
          avatarUrl
          appAvatarUrl
          isSelf
          currentCity {
            cityName
            country {
              countryName
            }
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
      }
    }
  }
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
