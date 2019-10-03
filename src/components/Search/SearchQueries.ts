import gql from "graphql-tag";
import {
  PROFILE_FRAGMENT,
  COUNTRY_FRAGMENT,
  CONTINENT_FRAGMENT
} from "../../fragmentQueries";

export const SEARCH = gql`
  query SearchTerms($search: String!) {
    searchUsers(search: $search) {
      users {
        profile {
          ...ProfileParts
        }
      }
    }
    searchCountries(search: $search) {
      countries {
        ...CountryParts
      }
    }
    searchContinents(search: $search) {
      continents {
        ...ContinentParts
      }
    }
  }
  ${PROFILE_FRAGMENT}
  ${COUNTRY_FRAGMENT}
  ${CONTINENT_FRAGMENT}
`;

export const CREATE_CITY = gql`
  mutation CreateCity($cityId: String!) {
    createCity(cityId: $cityId) {
      ok
      cityId
      countryCode
      continentCode
    }
  }
`;

export const GET_CITY_PHOTO = gql`
  query GetCityPhoto($cityId: String) {
    getCityPhoto(cityId: $cityId) {
      photo
    }
  }
`;
