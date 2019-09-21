import gql from "graphql-tag";
import {
  CITY_FRAGMENT,
  COUNTRY_FRAGMENT,
  CONTINENT_FRAGMENT,
  PROFILE_FRAGMENT
} from "../../sharedQueries";

export const COUNTRY_PROFILE = gql`
  query CountryProfile($page: Int, $countryCode: String!) {
    countryProfile(page: $page, countryCode: $countryCode) {
      count
      hasNextPage
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
          ...ContinentParts
        }
      }
      usersNow {
        ...ProfileParts
      }
      usersBefore {
        actor {
          profile {
            ...ProfileParts
          }
        }
      }
      cities {
        ...CityParts
      }
    }
  }
  ${CITY_FRAGMENT}
  ${PROFILE_FRAGMENT}
  ${CONTINENT_FRAGMENT}
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
