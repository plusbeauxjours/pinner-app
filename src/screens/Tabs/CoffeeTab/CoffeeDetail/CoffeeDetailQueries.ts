import gql from "graphql-tag";

export const COFFEE_DETAIL = gql`
  query CoffeeDetail($coffeeId: String!) {
    coffeeDetail(coffeeId: $coffeeId) {
      coffee {
        id
        uuid
        expires
        naturalTime
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
          profile {
            username
            isSelf
            avatarUrl
            gender
            distance
            coffeeCount
            currentCity {
              cityId
              cityName
              country {
                countryName
              }
            }
            nationality {
              countryName
              countryCode
              countryEmoji
            }
            residence {
              countryName
              countryCode
              countryEmoji
            }
            tripCount
          }
        }
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
