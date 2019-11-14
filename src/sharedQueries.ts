import gql from "graphql-tag";
import { COUNTRY_FRAGMENT } from "./fragmentQueries";

export const ME = gql`
  query Me {
    me {
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
    $userName: String
    $location: String!
  ) {
    getCoffees(
      cityId: $cityId
      countryCode: $countryCode
      continentCode: $continentCode
      userName: $userName
      location: $location
    ) {
      coffees {
        id
        uuid
        city {
          cityId
          cityName
          cityThumbnail
          country {
            countryCode
            countryName
          }
        }
        host {
          id
          username
          profile {
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
        status
        naturalTime
        target
        createdAt
        matchCount
      }
    }
  }
`;

export const DELETE_COFFEE = gql`
  mutation DeleteCoffee($coffeeId: String!) {
    deleteCoffee(coffeeId: $coffeeId) {
      ok
      coffeeId
      username
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
