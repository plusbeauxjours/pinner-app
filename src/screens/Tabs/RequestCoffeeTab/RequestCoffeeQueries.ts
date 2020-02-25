import gql from "graphql-tag";
import { COUNTRY_FRAGMENT } from "../../../fragmentQueries";

export const REQUEST_COFFEE = gql`
  mutation RequestCoffee(
    $countryCode: String
    $gender: String
    $currentCityId: String!
    $target: String
  ) {
    requestCoffee(
      countryCode: $countryCode
      gender: $gender
      currentCityId: $currentCityId
      target: $target
    ) {
      ok
      profiles {
        isSelf
        pushToken
      }
      coffee {
        id
        host {
          profile {
            gender
            residence {
              ...CountryParts
              countryEmoji
            }
            nationality {
              ...CountryParts
              countryEmoji
            }
          }
        }
      }
    }
  }
  ${COUNTRY_FRAGMENT}
`;
