import gql from "graphql-tag";
import { COUNTRY_FRAGMENT } from "../../../../fragmentQueries";

export const GET_USER = gql`
  query UserProfile($uuid: String!) {
    userProfile(uuid: $uuid) {
      user {
        id
        username
        firstName
        lastName
        profile {
          id
          uuid
          pushToken
          bio
          gender
          avatarUrl
          appAvatarUrl
          website
          distance
          countryPhoneNumber
          countryPhoneCode
          phoneNumber
          emailAddress
          isVerifiedPhoneNumber
          isVerifiedEmailAddress
          nationality {
            countryEmoji
            ...CountryParts
          }
          residence {
            countryEmoji
            ...CountryParts
          }
          blockedUserCount
          photoCount
          postCount
          tripCount
          coffeeCount
          cityCount
          countryCount
          continentCount
          isSelf
          isDarkMode
          isHidePhotos
          isHideTrips
          isHideCities
          isHideCountries
          isHideContinents
          isAutoLocationReport
          currentCity {
            latitude
            longitude
            cityName
            cityId
            cityPhoto
            country {
              countryName
              countryCode
            }
          }
        }
      }
    }
  }
  ${COUNTRY_FRAGMENT}
`;

export const GET_TRIPS = gql`
  query GetTrips($uuid: String!, $page: Int) {
    getTrips(uuid: $uuid, page: $page) {
      trip {
        id
        city {
          cityId
          cityName
          cityThumbnail
          country {
            countryEmoji
            countryName
            countryCode
            continent {
              continentCode
              continentName
            }
          }
        }
        startDate
        endDate
        naturalTime
        diffDays
      }
    }
  }
`;

export const ADD_TRIP = gql`
  mutation AddTrip(
    $cityId: String!
    $startDate: DateTime!
    $endDate: DateTime!
  ) {
    addTrip(cityId: $cityId, startDate: $startDate, endDate: $endDate) {
      ok
      distance
      moveNotification {
        startDate
        endDate
        city {
          cityId
          cityName
          cityThumbnail
          country {
            countryName
            countryCode
            continent {
              continentCode
              continentName
            }
          }
        }
      }
    }
  }
`;

export const EDIT_TRIP = gql`
  mutation EditTrip(
    $moveNotificationId: Int!
    $cityId: String
    $startDate: DateTime
    $endDate: DateTime
  ) {
    editTrip(
      moveNotificationId: $moveNotificationId
      cityId: $cityId
      startDate: $startDate
      endDate: $endDate
    ) {
      ok
      distance
      moveNotification {
        id
        city {
          cityId
          cityName
          cityThumbnail
          country {
            countryName
            countryCode
            continent {
              continentCode
              continentName
            }
          }
        }
        startDate
        endDate
        naturalTime
      }
    }
  }
`;

export const DELETE_TRIP = gql`
  mutation DeleteTrip($moveNotificationId: Int!) {
    deleteTrip(moveNotificationId: $moveNotificationId) {
      ok
      distance
      tripId
    }
  }
`;

export const CALCULATE_DISTANCE = gql`
  mutation CalculateDistance {
    calculateDistance {
      distance
    }
  }
`;

export const SLACK_REPORT_USERS = gql`
  mutation SlackReportUsers($targetUuid: String!, $payload: String!) {
    slackReportUsers(targetUuid: $targetUuid, payload: $payload) {
      ok
    }
  }
`;

export const GET_SAME_TRIPS = gql`
  query GetSameTrips($uuid: String!) {
    getSameTrips(uuid: $uuid) {
      count
      cities {
        id
        cityName
        country {
          countryEmoji
        }
      }
    }
  }
`;
