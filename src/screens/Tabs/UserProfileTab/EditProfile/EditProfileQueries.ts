import gql from "graphql-tag";
import { COUNTRY_FRAGMENT } from "../../../../fragmentQueries";

export const EDIT_PROFILE = gql`
  mutation EditProfile(
    $username: String
    $bio: String
    $gender: String
    $firstName: String
    $lastName: String
    $nationalityCode: String
    $residenceCode: String
  ) {
    editProfile(
      username: $username
      bio: $bio
      gender: $gender
      firstName: $firstName
      lastName: $lastName
      nationalityCode: $nationalityCode
      residenceCode: $residenceCode
    ) {
      ok
      token
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

export const DELETE_PROFILE = gql`
  mutation DeleteProfile {
    deleteProfile {
      ok
    }
  }
`;

export const START_EDIT_PHONE_VERIFICATION = gql`
  mutation StartEditPhoneVerification(
    $phoneNumber: String!
    $countryPhoneNumber: String!
  ) {
    startEditPhoneVerification(
      phoneNumber: $phoneNumber
      countryPhoneNumber: $countryPhoneNumber
    ) {
      ok
    }
  }
`;

export const COMPLETE_EDIT_PHONE_VERIFICATION = gql`
  mutation CompleteEditPhoneVerification(
    $key: String!
    $phoneNumber: String!
    $countryPhoneNumber: String!
    $countryPhoneCode: String!
  ) {
    completeEditPhoneVerification(
      key: $key
      phoneNumber: $phoneNumber
      countryPhoneNumber: $countryPhoneNumber
      countryPhoneCode: $countryPhoneCode
    ) {
      ok
      phoneNumber
      countryPhoneNumber
      countryPhoneCode
      isVerifiedPhoneNumber
    }
  }
`;

export const START_EDIT_EMAIL_VERIFICATION = gql`
  mutation StartEditEmailVerification($emailAddress: String!) {
    startEditEmailVerification(emailAddress: $emailAddress) {
      ok
    }
  }
`;

export const TOGGLE_SETTINGS = gql`
  mutation ToggleSettings($payload: String!) {
    toggleSettings(payload: $payload) {
      ok
      user {
        id
        username
        id
        uuid
        isSelf
        isDarkMode
        isHidePhotos
        isHideTrips
        isHideCities
        isHideCountries
        isHideContinents
        isAutoLocationReport
      }
    }
  }
`;
