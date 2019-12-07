import gql from "graphql-tag";
import {
  PROFILE_FRAGMENT,
  COUNTRY_FRAGMENT,
  CITY_FRAGMENT
} from "../../../fragmentQueries";

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

export const REQUEST_COFFEE = gql`
  mutation RequestCoffee(
    $countryCode: String
    $gender: String
    $currentCityId: String!
    $target: String
  ) {
    requestCoffee(
      countryCode: $countryCode
      gender: $gender
      currentCityId: $currentCityId
      target: $target
    ) {
      ok
      coffee {
        id
        host {
          profile {
            gender
            residence {
              ...CountryParts
              countryEmoji
            }
            nationality {
              ...CountryParts
              countryEmoji
            }
          }
        }
      }
    }
  }
  ${COUNTRY_FRAGMENT}
`;

export const GET_TRIP_CITIES = gql`
  query GetTripCities {
    getTripCities {
      trip {
        id
        startDate
        city {
          hasCoffee
          cityId
          cityName
          country {
            countryEmoji
          }
        }
      }
    }
  }
`;
