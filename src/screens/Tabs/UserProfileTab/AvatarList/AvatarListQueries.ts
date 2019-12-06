import gql from "graphql-tag";

export const GET_AVATARS = gql`
  query GetAvatars($uuid: String!) {
    getAvatars(uuid: $uuid) {
      avatars {
        id
        uuid
        image
        isMain
        likeCount
        image
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
