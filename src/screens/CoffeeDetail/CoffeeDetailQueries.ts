import gql from "graphql-tag";
import { COUNTRY_FRAGMENT } from "../../fragmentQueries";

export const COFFEE_DETAIL = gql`
  query CoffeeDetail($coffeeId: String!) {
    coffeeDetail(coffeeId: $coffeeId) {
      coffee {
        id
        uuid
        expires
        naturalTime
        isMatching
        status
        target
        city {
          cityId
          cityName
          country {
            countryName
          }
        }
        host {
          id
          username
          profile {
            nationality {
              countryEmoji
              ...CountryParts
            }
            residence {
              countryEmoji
              ...CountryParts
            }
            isSelf
            avatarUrl
            appAvatarUrl
            gender
            distance
            coffeeCount
            tripCount
            currentCity {
              cityId
              cityName
              country {
                countryName
              }
            }
          }
        }
      }
    }
  }
  ${COUNTRY_FRAGMENT}
`;
