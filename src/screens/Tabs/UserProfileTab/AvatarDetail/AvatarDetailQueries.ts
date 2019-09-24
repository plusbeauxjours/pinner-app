import gql from "graphql-tag";

export const GET_AVATAR_DETAIL = gql`
  query GetAvatarDetail($avatarId: String!) {
    getAvatarDetail(avatarId: $avatarId) {
      avatar {
        id
        uuid
        image
        isMain
        likeCount
        thumbnail
      }
    }
  }
`;
