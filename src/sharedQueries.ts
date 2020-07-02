import gql from "graphql-tag";
import { COUNTRY_FRAGMENT, MATCH_FRAGMENT } from "./fragmentQueries";

export const ME = gql`
  query Me {
    me {
      user {
        id
        username
        firstName
        lastName
        id
        uuid
        pushToken
        bio
        gender
        avatarUrl
        appAvatarUrl
        website
        distance
        countryPhoneNumber
        countryPhoneCode
        phoneNumber
        emailAddress
        isVerifiedPhoneNumber
        isVerifiedEmailAddress
        nationality {
          countryEmoji
          ...CountryParts
        }
        residence {
          countryEmoji
          ...CountryParts
        }
        blockedUserCount
        photoCount
        postCount
        tripCount
        cityCount
        countryCount
        continentCount
        isSelf
        isDarkMode
        isHidePhotos
        isHideTrips
        isHideCities
        isHideCountries
        isHideContinents
        isAutoLocationReport
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
        currentCity {
          latitude
          longitude
          cityName
          cityId
          cityPhoto
          country {
            countryName
            countryCode
          }
        }
      }
    }
  }
  ${COUNTRY_FRAGMENT}
`;

export const SLACK_REPORT_LOCATIONS = gql`
  mutation SlackReportLocations(
    $targetLocationId: String!
    $targetLocationType: String!
    $payload: String!
  ) {
    slackReportLocations(
      targetLocationId: $targetLocationId
      targetLocationType: $targetLocationType
      payload: $payload
    ) {
      ok
    }
  }
`;

export const REPORT_LOCATION = gql`
  mutation ReportLocation(
    $currentLat: Float!
    $currentLng: Float!
    $currentCityId: String
    $currentCityName: String!
    $currentCountryCode: String!
  ) {
    reportLocation(
      currentLat: $currentLat
      currentLng: $currentLng
      currentCityId: $currentCityId
      currentCityName: $currentCityName
      currentCountryCode: $currentCountryCode
    ) {
      ok
    }
  }
`;

export const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($file: Upload!) {
    uploadAvatar(file: $file) {
      ok
      preAvatarUUID
      newAvatarUUID
      avatar {
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

export const REGISTER_PUSH = gql`
  mutation RegisterPush($pushToken: String!) {
    registerPush(pushToken: $pushToken) {
      ok
    }
  }
`;

export const ADD_BLOCK_USER = gql`
  mutation AddBlockUser($uuid: String!) {
    addBlockUser(uuid: $uuid) {
      ok
      blockedUser {
        id
        uuid
        username
        appAvatarUrl
        currentCity {
          cityName
          country {
            countryName
          }
        }
        isSelf
      }
    }
  }
`;

export const DELETE_BLOCK_USER = gql`
  mutation DeleteBlockUser($uuid: String!) {
    deleteBlockUser(uuid: $uuid) {
      ok
      uuid
    }
  }
`;

export const MATCH = gql`
  mutation Match($cityId: String!, $hostUuid: String!, $guestUuid: String!) {
    match(cityId: $cityId, hostUuid: $hostUuid, guestUuid: $guestUuid) {
      ok
      cityId
      countryCode
      continentCode
      match {
        ...MatchParts
      }
    }
  }
  ${MATCH_FRAGMENT}
`;

export const UNMATCH = gql`
  mutation UnMatch($matchId: Int!) {
    unMatch(matchId: $matchId) {
      ok
      matchId
      cityId
      countryCode
      continentCode
    }
  }
`;
