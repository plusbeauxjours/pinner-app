import gql from "graphql-tag";

export const PROFILE_FRAGMENT = gql`
  fragment ProfileParts on ProfileType {
    id
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
`;

export const CITY_FRAGMENT = gql`
  fragment CityParts on CityType {
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
      # continent {
      # continentCode
      # continentName
      # }
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
    countryThumbnail
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
    continentThumbnail
  }
`;

export const COFFEE_FRAGMENT = gql`
  fragment CoffeeParts on CoffeeType {
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
        countryEmoji
      }
    }
    host {
      username
      profile {
        id
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
    guest {
      username
      profile {
        id
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
    coffee {
      id
      uuid
      target
      city {
        cityId
        cityName
        country {
          countryName
          countryEmoji
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
