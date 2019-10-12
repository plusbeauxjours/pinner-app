import gql from "graphql-tag";

export const ME = gql`
  query Me {
    me {
      user {
        username
        profile {
          gender
          residence {
            countryCode
            countryName
            countryEmoji
          }
          nationality {
            countryCode
            countryName
            countryEmoji
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
        # id
        uuid
        #   city {
        #     cityId
        #     cityName
        #     cityThumbnail
        #     country {
        #       countryName
        #     }
        #   }
        #   host {
        #     id
        #     username
        #     profile {
        #       avatarUrl
        #       appAvatarUrl
        #       isSelf
        #       currentCity {
        #         cityName
        #         country {
        #           countryName
        #         }
        #       }
        #     }
        #   }
        #   status
        #   naturalTime
        #   target
        #   createdAt
        #   matchCount
      }
    }
  }
`;
