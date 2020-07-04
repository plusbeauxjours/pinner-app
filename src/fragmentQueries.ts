import gql from "graphql-tag";

export const PROFILE_FRAGMENT = gql`
  fragment ProfileParts on UserType {
    id
    uuid
    username
    avatarUrl
    appAvatarUrl
    isSelf
    currentCity {
      cityId
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

export const MATCH_FRAGMENT = gql`
  fragment MatchParts on MatchType {
    id
    naturalTime
    isHost
    isGuest
    isMatching
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
      id
      uuid
      pushToken
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
    guest {
      username
      id
      uuid
      pushToken
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
    isHost
    isGuest
    isMatching
    isReadByHost
    isReadByGuest
  }
`;
