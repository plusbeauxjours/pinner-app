import gql from "graphql-tag";
import { COUNTRY_FRAGMENT } from "./fragmentQueries";

export const ME = gql`
  query Me {
    me {
      user {
        id
        username
        firstName
        lastName
        profile {
          id
          uuid
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

export const SLACK_REPORT_LOCATIONS = gql`
  mutation SlackReportLocations(
    $targetLocationId: String!
    $targetLocationType: String!
    $payload: String!
  ) {
    slackReportLocations(
      targetLocationId: $targetLocationId
      targetLocationType: $targetLocationType
      payload: $payload
    ) {
      ok
    }
  }
`;

export const REPORT_LOCATION = gql`
  mutation ReportLocation(
    $currentLat: Float!
    $currentLng: Float!
    $currentCityId: String
    $currentCityName: String!
    $currentCountryCode: String!
  ) {
    reportLocation(
      currentLat: $currentLat
      currentLng: $currentLng
      currentCityId: $currentCityId
      currentCityName: $currentCityName
      currentCountryCode: $currentCountryCode
    ) {
      ok
    }
  }
`;

export const GET_COFFEES = gql`
  query GetCoffees(
    $cityId: String
    $countryCode: String
    $continentCode: String
    $uuid: String
    $location: String!
  ) {
    getCoffees(
      cityId: $cityId
      countryCode: $countryCode
      continentCode: $continentCode
      uuid: $uuid
      location: $location
    ) {
      count
      coffees {
        id
        uuid
        city {
          cityName
          country {
            countryName
          }
        }
        host {
          id
          username
          profile {
            uuid
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
        status
        naturalTime
        target
        createdAt
      }
    }
  }
`;

export const DELETE_COFFEE = gql`
  mutation DeleteCoffee($coffeeId: String!) {
    deleteCoffee(coffeeId: $coffeeId) {
      ok
      coffeeId
      uuid
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
        image
        thumbnail
      }
    }
  }
`;
