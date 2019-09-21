import gql from "graphql-tag";
import { COUNTRY_FRAGMENT } from "../../fragmentQueries";

export const GET_USER = gql`
  query UserProfile($username: String!) {
    userProfile(username: $username) {
      user {
        id
        username
        firstName
        lastName
        profile {
          bio
          gender
          avatarUrl
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
          postCount
          tripCount
          coffeeCount
          cityCount
          countryCount
          continentCount
          isSelf
          isDarkMode
          isHideTrips
          isHideCoffees
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
  query GetTrips($username: String!, $page: Int) {
    getTrips(username: $username, page: $page) {
      page
      hasNextPage
      trip {
        id
        city {
          cityId
          cityName
          cityPhoto
          country {
            countryName
            countryCode
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
          cityPhoto
          country {
            countryName
            countryCode
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
          cityPhoto
          country {
            countryName
            countryCode
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

export const GET_AVATARS = gql`
  query GetAvatars($userName: String!) {
    getAvatars(userName: $userName) {
      avatars {
        id
        uuid
        image
        isMain
        likeCount
        thumbnail
      }
    }
  }
`;

export const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($file: Upload!) {
    uploadAvatar(file: $file) {
      ok
      preAvatarUUID
      newAvatarUUID
      avatar {
        id
        uuid
        image
        isMain
        likeCount
        thumbnail
      }
    }
  }
`;

export const DELETE_AVATAR = gql`
  mutation DeleteAvatar($uuid: String!) {
    deleteAvatar(uuid: $uuid) {
      ok
      uuid
    }
  }
`;

export const MARK_AS_MAIN = gql`
  mutation MarkAsMain($uuid: String!) {
    markAsMain(uuid: $uuid) {
      ok
      preAvatarUUID
      newAvatarUUID
      avatar {
        id
        uuid
        image
        isMain
        likeCount
        thumbnail
      }
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
  mutation SlackReportUsers($targetUsername: String!, $payload: String!) {
    slackReportUsers(targetUsername: $targetUsername, payload: $payload) {
      ok
    }
  }
`;
