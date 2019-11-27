import gql from "graphql-tag";
import { PROFILE_FRAGMENT, COUNTRY_FRAGMENT } from "../../../fragmentQueries";

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
        id
        latitude
        longitude
        cityName
        cityId
        cityPhoto
        cityThumbnail
        distance
        country {
          countryName
          countryCode
          continent {
            continentCode
            continentName
          }
        }
        likeCount
        isLiked
      }
    }
  }
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
        uuid
        city {
          cityId
          cityName
          cityThumbnail
          country {
            countryName
            countryCode
            countryEmoji
          }
        }
        host {
          id
          username
          profile {
            avatarUrl
            appAvatarUrl
            isSelf
            gender
            nationality {
              countryEmoji
              ...CountryParts
            }
            residence {
              countryEmoji
              ...CountryParts
            }
            currentCity {
              cityName
              country {
                countryName
              }
            }
          }
        }
        status
        naturalTime
        target
        createdAt
        matchCount
      }
    }
  }
  ${COUNTRY_FRAGMENT}
`;

export const GET_TRIP_CITIES = gql`
  query GetTripCities($username: String!) {
    getTripCities(username: $username) {
      trip {
        id
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
