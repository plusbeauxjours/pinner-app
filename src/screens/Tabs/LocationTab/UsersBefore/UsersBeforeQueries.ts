import gql from "graphql-tag";

export const CITY_USERS_BEFORE = gql`
  query CityUsersBefore($cityId: String!, $payload: String) {
    cityUsersBefore(cityId: $cityId, payload: $payload) {
      page
      hasNextPage
      usersBefore {
        naturalTime
        actor {
          profile {
            id
            uuid
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
        }
      }
    }
  }
`;
