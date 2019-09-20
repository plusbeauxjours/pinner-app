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
          currentCity {
            cityId
            cityName
          }
        }
      }
    }
  }
`;

export const PROFILE_FRAGMENT = gql`
  fragment ProfileParts on ProfileType {
    id
    username
    avatarUrl
    isSelf
    currentCity {
      cityName
      country {
        countryName
      }
    }
  }
`;

export const CITY_FRAGMENT = gql`
  fragment CityParts on CityType {
    id
    latitude
    longitude
    cityName
    cityId
    cityPhoto
    distance
    country {
      countryName
    }
    likeCount
    isLiked
  }
`;

export const COUNTRY_FRAGMENT = gql`
  fragment CountryParts on CountryType {
    id
    countryName
    countryCode
    countryPhoto
    cityCount
    continent {
      continentCode
      continentName
    }
  }
`;

export const CONTINENT_FRAGMENT = gql`
  fragment ContinentParts on ContinentType {
    id
    continentName
    continentCode
    continentPhoto
  }
`;

export const COFFEE_FRAGMENT = gql`
  fragment CoffeeParts on CoffeeType {
    id
    uuid
    city {
      cityId
      cityName
      cityPhoto
      country {
        countryName
      }
    }
    host {
      id
      username
      profile {
        avatarUrl
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
`;

export const MATCH_FRAGMENT = gql`
  fragment MatchParts on MatchType {
    id
    naturalTime
    city {
      cityId
      cityName
      country {
        countryName
      }
    }
    host {
      profile {
        id
        username
        avatarUrl
        isSelf
        currentCity {
          cityName
          country {
            countryName
          }
        }
      }
    }
    guest {
      profile {
        id
        username
        avatarUrl
        isSelf
        currentCity {
          cityName
          country {
            countryName
          }
        }
      }
    }
    coffee {
      id
      uuid
      target
      city {
        cityId
        cityName
        country {
          countryName
        }
      }
    }
    isHost
    isGuest
    isMatching
    isReadByHost
    isReadByGuest
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
