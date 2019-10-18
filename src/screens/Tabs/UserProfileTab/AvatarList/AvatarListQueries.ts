import gql from "graphql-tag";

export const GET_AVATARS = gql`
  query GetAvatars($userName: String!) {
    getAvatars(userName: $userName) {
      avatars {
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

export const DELETE_AVATAR = gql`
  mutation DeleteAvatar($uuid: String!) {
    deleteAvatar(uuid: $uuid) {
      ok
      uuid
    }
  }
`;

export const MARK_AS_MAIN = gql`
  mutation MarkAsMain($uuid: String!) {
    markAsMain(uuid: $uuid) {
      ok
      preAvatarUUID
      newAvatarUUID
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
