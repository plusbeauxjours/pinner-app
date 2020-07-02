import gql from "graphql-tag";

export const UPDATE_SNS = gql`
  mutation UpdateSns($payload: String!, $username: String!) {
    updateSns(payload: $payload, username: $username) {
      ok
      user {
        id
        uuid
        sendInstagram
        sendTwitter
        sendYoutube
        sendTelegram
        sendPhone
        sendEmail
        sendKakao
        sendFacebook
        sendSnapchat
        sendLine
        sendWechat
        sendKik
        sendVk
        sendWhatsapp
        sendBehance
        sendLinkedin
        sendPinterest
        sendVine
        sendTumblr
      }
    }
  }
`;
