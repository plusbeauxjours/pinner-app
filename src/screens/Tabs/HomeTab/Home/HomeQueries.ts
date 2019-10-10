import gql from "graphql-tag";
import { PROFILE_FRAGMENT } from "../../../../fragmentQueries";

export const RECOMMEND_USERS = gql`
  query RecommendUsers($page: Int) {
    recommendUsers(page: $page) {
      page
      hasNextPage
      users {
        ...ProfileParts
      }
    }
  }
  ${PROFILE_FRAGMENT}
`;

export const RECOMMEND_LOCATIONS = gql`
  query RecommendLocations($page: Int) {
    recommendLocations(page: $page) {
      page
      hasNextPage
      cities {
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
          continent {
            continentCode
            continentName
          }
        }
        likeCount
        isLiked
      }
    }
  }
`;
