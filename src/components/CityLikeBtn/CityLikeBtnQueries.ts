import gql from "graphql-tag";

export const TOGGLE_LIKE_CITY = gql`
  mutation ToggleLikeCity($cityId: String!) {
    toggleLikeCity(cityId: $cityId) {
      ok
      city {
        id
        cityId
        isLiked
        likeCount
        country {
          countryName
          countryCode
        }
      }
    }
  }
`;
