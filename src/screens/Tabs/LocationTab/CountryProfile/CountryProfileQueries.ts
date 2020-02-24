import gql from "graphql-tag";
import { COUNTRY_FRAGMENT } from "../../../../fragmentQueries";

export const COUNTRY_PROFILE = gql`
  query CountryProfile($page: Int, $countryCode: String!) {
    countryProfile(page: $page, countryCode: $countryCode) {
      count
      country {
        latitude
        longitude
        countryName
        countryCode
        countryPhoto
        countryCapital
        countryCurrency
        countryEmoji
        totalLikeCount
        cityCount
        continent {
          id
          continentName
          continentCode
          continentPhoto
          continentThumbnail
        }
      }
      cities {
        id
        latitude
        longitude
        cityName
        cityId
        cityPhoto
        cityThumbnail
        # distance
        country {
          countryName
          countryCode
          # continent {
          #   continentCode
          #   continentName
          # }
        }
        likeCount
        isLiked
      }
    }
  }
`;

export const GET_COUNTRIES = gql`
  query GetCountries($countryCode: String!) {
    getCountries(countryCode: $countryCode) {
      countries {
        ...CountryParts
      }
    }
  }
  ${COUNTRY_FRAGMENT}
`;

export const GET_RESIDENCE_USERS = gql`
  query GetResidenceUsers($countryCode: String!) {
    getResidenceUsers(countryCode: $countryCode) {
      users {
        id
        uuid
        username
        avatarUrl
        appAvatarUrl
        currentCity {
          cityName
          country {
            countryName
          }
        }
      }
    }
  }
`;

export const GET_NATIONALITY_USERS = gql`
  query GetNationalityUsers($countryCode: String!) {
    getNationalityUsers(countryCode: $countryCode) {
      users {
        id
        uuid
        username
        avatarUrl
        appAvatarUrl
        currentCity {
          cityName
          country {
            countryName
          }
        }
      }
    }
  }
`;
