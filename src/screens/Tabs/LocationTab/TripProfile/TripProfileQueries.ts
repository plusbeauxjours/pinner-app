import gql from "graphql-tag";
import { CONTINENT_FRAGMENT } from "src/fragmentQueries";

export const TRIP_PROFILE = gql`
  query TripProfile($cityId: String!, $startDate: Date!, $endDate: Date!) {
    tripProfile(cityId: $cityId, startDate: $startDate, endDate: $endDate) {
      city {
        id
        latitude
        longitude
        cityId
        cityName
        cityPhoto
        country {
          countryName
          countryPhoto
          countryCode
          continent {
            ...ContinentParts
          }
        }
        likeCount
        isLiked
        userCount
        userLogCount
        count
        diff
      }
      count
      usersBefore {
        actor {
          profile {
            id
            username
            avatarUrl
            isSelf
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
      userCount
      coffees {
        id
        uuid
        target
        host {
          id
          username
          profile {
            avatarUrl
          }
        }
      }
    }
  }
  ${CONTINENT_FRAGMENT}
`;
