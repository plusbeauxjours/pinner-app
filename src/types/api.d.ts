/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ToggleLikeCity
// ====================================================

export interface ToggleLikeCity_toggleLikeCity_city_country {
  __typename: "CountryType";
  countryName: string | null;
  countryCode: string | null;
}

export interface ToggleLikeCity_toggleLikeCity_city {
  __typename: "CityType";
  id: string;
  cityId: string | null;
  isLiked: boolean | null;
  likeCount: number | null;
  country: ToggleLikeCity_toggleLikeCity_city_country;
}

export interface ToggleLikeCity_toggleLikeCity {
  __typename: "ToggleLikeCityResponse";
  ok: boolean | null;
  city: ToggleLikeCity_toggleLikeCity_city | null;
}

export interface ToggleLikeCity {
  /**
   * Like a City 
   */
  toggleLikeCity: ToggleLikeCity_toggleLikeCity;
}

export interface ToggleLikeCityVariables {
  cityId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchTerms
// ====================================================

export interface SearchTerms_searchUsers_users_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface SearchTerms_searchUsers_users_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: SearchTerms_searchUsers_users_currentCity_country;
}

export interface SearchTerms_searchUsers_users {
  __typename: "UserType";
  id: string;
  uuid: any | null;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: SearchTerms_searchUsers_users_currentCity | null;
}

export interface SearchTerms_searchUsers {
  __typename: "SearchUsersResponse";
  users: (SearchTerms_searchUsers_users | null)[] | null;
}

export interface SearchTerms_searchCountries_countries_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface SearchTerms_searchCountries_countries {
  __typename: "CountryType";
  id: string;
  countryName: string | null;
  countryCode: string | null;
  countryPhoto: string | null;
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: SearchTerms_searchCountries_countries_continent | null;
}

export interface SearchTerms_searchCountries {
  __typename: "CountriesResponse";
  countries: (SearchTerms_searchCountries_countries | null)[] | null;
}

export interface SearchTerms_searchContinents_continents {
  __typename: "ContinentType";
  countryCount: number | null;
  id: string;
  continentName: string | null;
  continentCode: string | null;
  continentPhoto: string | null;
  continentThumbnail: string | null;
}

export interface SearchTerms_searchContinents {
  __typename: "ContinentsResponse";
  continents: (SearchTerms_searchContinents_continents | null)[] | null;
}

export interface SearchTerms {
  searchUsers: SearchTerms_searchUsers;
  searchCountries: SearchTerms_searchCountries;
  searchContinents: SearchTerms_searchContinents;
}

export interface SearchTermsVariables {
  search: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateCity
// ====================================================

export interface CreateCity_createCity {
  __typename: "CreateCityResponse";
  ok: boolean | null;
  cityId: string | null;
  countryCode: string | null;
  continentCode: string | null;
}

export interface CreateCity {
  createCity: CreateCity_createCity;
}

export interface CreateCityVariables {
  cityId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCityPhoto
// ====================================================

export interface GetCityPhoto_getCityPhoto {
  __typename: "PhotoResponse";
  photo: string | null;
}

export interface GetCityPhoto {
  getCityPhoto: GetCityPhoto_getCityPhoto;
}

export interface GetCityPhotoVariables {
  cityId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AppleConnect
// ====================================================

export interface AppleConnect_appleConnect {
  __typename: "AppleConnectResponse";
  token: string | null;
}

export interface AppleConnect {
  appleConnect: AppleConnect_appleConnect;
}

export interface AppleConnectVariables {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  cityId: string;
  countryCode: string;
  appleId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: FacebookConnect
// ====================================================

export interface FacebookConnect_facebookConnect {
  __typename: "FacebookConnectResponse";
  token: string | null;
}

export interface FacebookConnect {
  facebookConnect: FacebookConnect_facebookConnect;
}

export interface FacebookConnectVariables {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  gender?: string | null;
  cityId: string;
  countryCode: string;
  fbId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: StartEmailVerification
// ====================================================

export interface StartEmailVerification_startEmailVerification {
  __typename: "StartEmailVerificationResponse";
  ok: boolean | null;
}

export interface StartEmailVerification {
  startEmailVerification: StartEmailVerification_startEmailVerification;
}

export interface StartEmailVerificationVariables {
  emailAddress: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: StartPhoneVerification
// ====================================================

export interface StartPhoneVerification_startPhoneVerification {
  __typename: "StartPhoneVerificationResponse";
  ok: boolean | null;
}

export interface StartPhoneVerification {
  startPhoneVerification: StartPhoneVerification_startPhoneVerification;
}

export interface StartPhoneVerificationVariables {
  phoneNumber: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CompletePhoneVerification
// ====================================================

export interface CompletePhoneVerification_completePhoneVerification {
  __typename: "CompletePhoneVerificationResponse";
  ok: boolean | null;
  token: string | null;
}

export interface CompletePhoneVerification {
  completePhoneVerification: CompletePhoneVerification_completePhoneVerification;
}

export interface CompletePhoneVerificationVariables {
  key: string;
  phoneNumber: string;
  countryPhoneNumber: string;
  countryPhoneCode: string;
  cityId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CityProfile
// ====================================================

export interface CityProfile_cityProfile_usersNow_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface CityProfile_cityProfile_usersNow_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: CityProfile_cityProfile_usersNow_currentCity_country;
}

export interface CityProfile_cityProfile_usersNow {
  __typename: "UserType";
  id: string;
  uuid: any | null;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: CityProfile_cityProfile_usersNow_currentCity | null;
}

export interface CityProfile_cityProfile_usersBefore_actor_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface CityProfile_cityProfile_usersBefore_actor_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: CityProfile_cityProfile_usersBefore_actor_currentCity_country;
}

export interface CityProfile_cityProfile_usersBefore_actor {
  __typename: "TokenType";
  id: string;
  uuid: any | null;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: CityProfile_cityProfile_usersBefore_actor_currentCity | null;
}

export interface CityProfile_cityProfile_usersBefore {
  __typename: "MoveNotificationType";
  naturalTime: string | null;
  actor: CityProfile_cityProfile_usersBefore_actor;
}

export interface CityProfile_cityProfile_city_country_continent {
  __typename: "ContinentType";
  id: string;
  continentName: string | null;
  continentCode: string | null;
  continentPhoto: string | null;
  continentThumbnail: string | null;
}

export interface CityProfile_cityProfile_city_country {
  __typename: "CountryType";
  countryName: string | null;
  countryPhoto: string | null;
  countryCode: string | null;
  countryEmoji: string | null;
  continent: CityProfile_cityProfile_city_country_continent | null;
}

export interface CityProfile_cityProfile_city {
  __typename: "CityType";
  id: string;
  latitude: number | null;
  longitude: number | null;
  cityId: string | null;
  cityName: string | null;
  cityPhoto: string | null;
  country: CityProfile_cityProfile_city_country;
  likeCount: number | null;
  isLiked: boolean | null;
  userCount: number | null;
  userLogCount: number | null;
  count: number | null;
}

export interface CityProfile_cityProfile {
  __typename: "CityProfileResponse";
  count: number | null;
  usersNow: (CityProfile_cityProfile_usersNow | null)[] | null;
  usersBefore: (CityProfile_cityProfile_usersBefore | null)[] | null;
  city: CityProfile_cityProfile_city | null;
}

export interface CityProfile {
  cityProfile: CityProfile_cityProfile;
}

export interface CityProfileVariables {
  page?: number | null;
  cityId: string;
  payload?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSamenameCities
// ====================================================

export interface GetSamenameCities_getSamenameCities_cities_country {
  __typename: "CountryType";
  countryName: string | null;
  countryCode: string | null;
}

export interface GetSamenameCities_getSamenameCities_cities {
  __typename: "CityType";
  id: string;
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  cityId: string | null;
  cityPhoto: string | null;
  cityThumbnail: string | null;
  distance: number | null;
  country: GetSamenameCities_getSamenameCities_cities_country;
  likeCount: number | null;
  isLiked: boolean | null;
}

export interface GetSamenameCities_getSamenameCities {
  __typename: "CitiesResponse";
  cities: (GetSamenameCities_getSamenameCities_cities | null)[] | null;
}

export interface GetSamenameCities {
  getSamenameCities: GetSamenameCities_getSamenameCities;
}

export interface GetSamenameCitiesVariables {
  cityId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: NearCities
// ====================================================

export interface NearCities_nearCities_cities_country {
  __typename: "CountryType";
  countryName: string | null;
  countryCode: string | null;
}

export interface NearCities_nearCities_cities {
  __typename: "CityType";
  id: string;
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  cityId: string | null;
  cityPhoto: string | null;
  cityThumbnail: string | null;
  distance: number | null;
  country: NearCities_nearCities_cities_country;
  likeCount: number | null;
  isLiked: boolean | null;
}

export interface NearCities_nearCities {
  __typename: "NearCitiesResponse";
  page: number | null;
  hasNextPage: boolean | null;
  cities: (NearCities_nearCities_cities | null)[] | null;
}

export interface NearCities {
  nearCities: NearCities_nearCities;
}

export interface NearCitiesVariables {
  cityId: string;
  page?: number | null;
  payload?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ContinentProfile
// ====================================================

export interface ContinentProfile_continentProfile_continent {
  __typename: "ContinentType";
  countryCount: number | null;
  id: string;
  continentName: string | null;
  continentCode: string | null;
  continentPhoto: string | null;
  continentThumbnail: string | null;
}

export interface ContinentProfile_continentProfile_continents {
  __typename: "ContinentType";
  countryCount: number | null;
  id: string;
  continentName: string | null;
  continentCode: string | null;
  continentPhoto: string | null;
  continentThumbnail: string | null;
}

export interface ContinentProfile_continentProfile_countries_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface ContinentProfile_continentProfile_countries {
  __typename: "CountryType";
  id: string;
  countryName: string | null;
  countryCode: string | null;
  countryPhoto: string | null;
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: ContinentProfile_continentProfile_countries_continent | null;
}

export interface ContinentProfile_continentProfile {
  __typename: "ContinentProfileResponse";
  page: number | null;
  count: number | null;
  hasNextPage: boolean | null;
  continent: ContinentProfile_continentProfile_continent | null;
  continents: (ContinentProfile_continentProfile_continents | null)[] | null;
  countries: (ContinentProfile_continentProfile_countries | null)[] | null;
}

export interface ContinentProfile {
  continentProfile: ContinentProfile_continentProfile;
}

export interface ContinentProfileVariables {
  page?: number | null;
  continentCode: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CountryProfile
// ====================================================

export interface CountryProfile_countryProfile_country_continent {
  __typename: "ContinentType";
  id: string;
  continentName: string | null;
  continentCode: string | null;
  continentPhoto: string | null;
  continentThumbnail: string | null;
}

export interface CountryProfile_countryProfile_country {
  __typename: "CountryType";
  latitude: number | null;
  longitude: number | null;
  countryName: string | null;
  countryCode: string | null;
  countryPhoto: string | null;
  countryCapital: string | null;
  countryCurrency: string | null;
  countryEmoji: string | null;
  totalLikeCount: number | null;
  cityCount: number | null;
  continent: CountryProfile_countryProfile_country_continent | null;
}

export interface CountryProfile_countryProfile_cities_country {
  __typename: "CountryType";
  countryName: string | null;
  countryCode: string | null;
}

export interface CountryProfile_countryProfile_cities {
  __typename: "CityType";
  id: string;
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  cityId: string | null;
  cityPhoto: string | null;
  cityThumbnail: string | null;
  country: CountryProfile_countryProfile_cities_country;
  likeCount: number | null;
  isLiked: boolean | null;
}

export interface CountryProfile_countryProfile {
  __typename: "CountryProfileResponse";
  count: number | null;
  country: CountryProfile_countryProfile_country | null;
  cities: (CountryProfile_countryProfile_cities | null)[] | null;
}

export interface CountryProfile {
  countryProfile: CountryProfile_countryProfile;
}

export interface CountryProfileVariables {
  page?: number | null;
  countryCode: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCountries
// ====================================================

export interface GetCountries_getCountries_countries_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface GetCountries_getCountries_countries {
  __typename: "CountryType";
  id: string;
  countryName: string | null;
  countryCode: string | null;
  countryPhoto: string | null;
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: GetCountries_getCountries_countries_continent | null;
}

export interface GetCountries_getCountries {
  __typename: "CountriesResponse";
  countries: (GetCountries_getCountries_countries | null)[] | null;
}

export interface GetCountries {
  getCountries: GetCountries_getCountries;
}

export interface GetCountriesVariables {
  countryCode: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CityUsersBefore
// ====================================================

export interface CityUsersBefore_cityUsersBefore_usersBefore_actor_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface CityUsersBefore_cityUsersBefore_usersBefore_actor_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: CityUsersBefore_cityUsersBefore_usersBefore_actor_currentCity_country;
}

export interface CityUsersBefore_cityUsersBefore_usersBefore_actor {
  __typename: "TokenType";
  id: string;
  uuid: any | null;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: CityUsersBefore_cityUsersBefore_usersBefore_actor_currentCity | null;
}

export interface CityUsersBefore_cityUsersBefore_usersBefore {
  __typename: "MoveNotificationType";
  naturalTime: string | null;
  actor: CityUsersBefore_cityUsersBefore_usersBefore_actor;
}

export interface CityUsersBefore_cityUsersBefore {
  __typename: "usersBeforeResponse";
  page: number | null;
  hasNextPage: boolean | null;
  usersBefore: (CityUsersBefore_cityUsersBefore_usersBefore | null)[] | null;
}

export interface CityUsersBefore {
  cityUsersBefore: CityUsersBefore_cityUsersBefore;
}

export interface CityUsersBeforeVariables {
  cityId: string;
  payload?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetNationalityUsers
// ====================================================

export interface GetNationalityUsers_getNationalityUsers_users_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface GetNationalityUsers_getNationalityUsers_users_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: GetNationalityUsers_getNationalityUsers_users_currentCity_country;
}

export interface GetNationalityUsers_getNationalityUsers_users {
  __typename: "UserType";
  id: string;
  uuid: any | null;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: GetNationalityUsers_getNationalityUsers_users_currentCity | null;
}

export interface GetNationalityUsers_getNationalityUsers {
  __typename: "GetUserListResponse";
  users: (GetNationalityUsers_getNationalityUsers_users | null)[] | null;
}

export interface GetNationalityUsers {
  getNationalityUsers: GetNationalityUsers_getNationalityUsers;
}

export interface GetNationalityUsersVariables {
  countryCode: string;
  payload?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetResidenceUsers
// ====================================================

export interface GetResidenceUsers_getResidenceUsers_users_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface GetResidenceUsers_getResidenceUsers_users_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: GetResidenceUsers_getResidenceUsers_users_currentCity_country;
}

export interface GetResidenceUsers_getResidenceUsers_users {
  __typename: "UserType";
  id: string;
  uuid: any | null;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: GetResidenceUsers_getResidenceUsers_users_currentCity | null;
}

export interface GetResidenceUsers_getResidenceUsers {
  __typename: "GetUserListResponse";
  users: (GetResidenceUsers_getResidenceUsers_users | null)[] | null;
}

export interface GetResidenceUsers {
  getResidenceUsers: GetResidenceUsers_getResidenceUsers;
}

export interface GetResidenceUsersVariables {
  countryCode: string;
  payload?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateSns
// ====================================================

export interface UpdateSns_updateSns_user {
  __typename: "UserType";
  id: string;
  uuid: any | null;
  sendInstagram: string | null;
  sendTwitter: string | null;
  sendYoutube: string | null;
  sendTelegram: string | null;
  sendPhone: string | null;
  sendEmail: string | null;
  sendKakao: string | null;
  sendFacebook: string | null;
  sendSnapchat: string | null;
  sendLine: string | null;
  sendWechat: string | null;
  sendKik: string | null;
  sendVk: string | null;
  sendWhatsapp: string | null;
  sendBehance: string | null;
  sendLinkedin: string | null;
  sendPinterest: string | null;
  sendVine: string | null;
  sendTumblr: string | null;
}

export interface UpdateSns_updateSns {
  __typename: "UpdateSNSResponse";
  ok: boolean | null;
  user: UpdateSns_updateSns_user | null;
}

export interface UpdateSns {
  updateSns: UpdateSns_updateSns;
}

export interface UpdateSnsVariables {
  payload: string;
  username: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetMatches
// ====================================================

export interface GetMatches_getMatches_matches_city_country {
  __typename: "CountryType";
  countryName: string | null;
  countryEmoji: string | null;
}

export interface GetMatches_getMatches_matches_city {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
  country: GetMatches_getMatches_matches_city_country;
}

export interface GetMatches_getMatches_matches_host_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface GetMatches_getMatches_matches_host_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: GetMatches_getMatches_matches_host_currentCity_country;
}

export interface GetMatches_getMatches_matches_host {
  __typename: "TokenType";
  username: string | null;
  id: string;
  uuid: any | null;
  pushToken: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: GetMatches_getMatches_matches_host_currentCity | null;
}

export interface GetMatches_getMatches_matches_guest_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface GetMatches_getMatches_matches_guest_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: GetMatches_getMatches_matches_guest_currentCity_country;
}

export interface GetMatches_getMatches_matches_guest {
  __typename: "TokenType";
  username: string | null;
  id: string;
  uuid: any | null;
  pushToken: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: GetMatches_getMatches_matches_guest_currentCity | null;
}

export interface GetMatches_getMatches_matches {
  __typename: "MatchType";
  id: string;
  naturalTime: string | null;
  isHost: boolean | null;
  isGuest: boolean | null;
  isMatching: boolean | null;
  city: GetMatches_getMatches_matches_city | null;
  host: GetMatches_getMatches_matches_host | null;
  guest: GetMatches_getMatches_matches_guest | null;
  isReadByHost: boolean;
  isReadByGuest: boolean;
}

export interface GetMatches_getMatches {
  __typename: "GetMatchesResponse";
  matches: (GetMatches_getMatches_matches | null)[] | null;
}

export interface GetMatches {
  getMatches: GetMatches_getMatches;
}

export interface GetMatchesVariables {
  page?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MarkAsReadMatch
// ====================================================

export interface MarkAsReadMatch_markAsReadMatch {
  __typename: "MarkAsReadMatchResponse";
  ok: boolean | null;
  matchId: string | null;
  isReadByHost: boolean | null;
  isReadByGuest: boolean | null;
}

export interface MarkAsReadMatch {
  markAsReadMatch: MarkAsReadMatch_markAsReadMatch;
}

export interface MarkAsReadMatchVariables {
  matchId: number;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CompleteEditEmailVerification
// ====================================================

export interface CompleteEditEmailVerification_completeEditEmailVerification_user_residence_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface CompleteEditEmailVerification_completeEditEmailVerification_user_residence {
  __typename: "CountryType";
  countryEmoji: string | null;
  id: string;
  countryName: string | null;
  countryCode: string | null;
  countryPhoto: string | null;
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: CompleteEditEmailVerification_completeEditEmailVerification_user_residence_continent | null;
}

export interface CompleteEditEmailVerification_completeEditEmailVerification_user_nationality_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface CompleteEditEmailVerification_completeEditEmailVerification_user_nationality {
  __typename: "CountryType";
  countryEmoji: string | null;
  id: string;
  countryName: string | null;
  countryCode: string | null;
  countryPhoto: string | null;
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: CompleteEditEmailVerification_completeEditEmailVerification_user_nationality_continent | null;
}

export interface CompleteEditEmailVerification_completeEditEmailVerification_user_currentCity {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
}

export interface CompleteEditEmailVerification_completeEditEmailVerification_user {
  __typename: "UserType";
  username: string | null;
  id: string;
  uuid: any | null;
  gender: UserGender | null;
  residence: CompleteEditEmailVerification_completeEditEmailVerification_user_residence | null;
  nationality: CompleteEditEmailVerification_completeEditEmailVerification_user_nationality | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  currentCity: CompleteEditEmailVerification_completeEditEmailVerification_user_currentCity | null;
}

export interface CompleteEditEmailVerification_completeEditEmailVerification {
  __typename: "CompleteEditEmailVerificationResponse";
  ok: boolean | null;
  token: string | null;
  user: CompleteEditEmailVerification_completeEditEmailVerification_user | null;
}

export interface CompleteEditEmailVerification {
  completeEditEmailVerification: CompleteEditEmailVerification_completeEditEmailVerification;
}

export interface CompleteEditEmailVerificationVariables {
  key: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CompleteEmailVerification
// ====================================================

export interface CompleteEmailVerification_completeEmailVerification_user_residence_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface CompleteEmailVerification_completeEmailVerification_user_residence {
  __typename: "CountryType";
  countryEmoji: string | null;
  id: string;
  countryName: string | null;
  countryCode: string | null;
  countryPhoto: string | null;
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: CompleteEmailVerification_completeEmailVerification_user_residence_continent | null;
}

export interface CompleteEmailVerification_completeEmailVerification_user_nationality_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface CompleteEmailVerification_completeEmailVerification_user_nationality {
  __typename: "CountryType";
  countryEmoji: string | null;
  id: string;
  countryName: string | null;
  countryCode: string | null;
  countryPhoto: string | null;
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: CompleteEmailVerification_completeEmailVerification_user_nationality_continent | null;
}

export interface CompleteEmailVerification_completeEmailVerification_user_currentCity {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
}

export interface CompleteEmailVerification_completeEmailVerification_user {
  __typename: "UserType";
  username: string | null;
  id: string;
  uuid: any | null;
  gender: UserGender | null;
  residence: CompleteEmailVerification_completeEmailVerification_user_residence | null;
  nationality: CompleteEmailVerification_completeEmailVerification_user_nationality | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  currentCity: CompleteEmailVerification_completeEmailVerification_user_currentCity | null;
}

export interface CompleteEmailVerification_completeEmailVerification {
  __typename: "CompleteEmailVerificationResponse";
  ok: boolean | null;
  token: string | null;
  user: CompleteEmailVerification_completeEmailVerification_user | null;
}

export interface CompleteEmailVerification {
  completeEmailVerification: CompleteEmailVerification_completeEmailVerification;
}

export interface CompleteEmailVerificationVariables {
  key: string;
  cityId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAvatars
// ====================================================

export interface GetAvatars_getAvatars_avatars {
  __typename: "AvatarType";
  id: string;
  uuid: any | null;
  image: string | null;
  isMain: boolean;
  likeCount: number | null;
  thumbnail: string | null;
}

export interface GetAvatars_getAvatars {
  __typename: "AvatarListResponse";
  avatars: (GetAvatars_getAvatars_avatars | null)[] | null;
}

export interface GetAvatars {
  getAvatars: GetAvatars_getAvatars;
}

export interface GetAvatarsVariables {
  uuid: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteAvatar
// ====================================================

export interface DeleteAvatar_deleteAvatar {
  __typename: "DeleteAvatarResponse";
  ok: boolean | null;
  uuid: string | null;
}

export interface DeleteAvatar {
  deleteAvatar: DeleteAvatar_deleteAvatar;
}

export interface DeleteAvatarVariables {
  uuid: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MarkAsMain
// ====================================================

export interface MarkAsMain_markAsMain_avatar {
  __typename: "AvatarType";
  id: string;
  uuid: any | null;
  image: string | null;
  isMain: boolean;
  likeCount: number | null;
  thumbnail: string | null;
}

export interface MarkAsMain_markAsMain {
  __typename: "MarkAsMainResponse";
  ok: boolean | null;
  preAvatarUUID: string | null;
  newAvatarUUID: string | null;
  avatar: MarkAsMain_markAsMain_avatar | null;
}

export interface MarkAsMain {
  markAsMain: MarkAsMain_markAsMain;
}

export interface MarkAsMainVariables {
  uuid: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBlockedUser
// ====================================================

export interface GetBlockedUser_getBlockedUser_blockedUsers_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface GetBlockedUser_getBlockedUser_blockedUsers_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: GetBlockedUser_getBlockedUser_blockedUsers_currentCity_country;
}

export interface GetBlockedUser_getBlockedUser_blockedUsers {
  __typename: "UserType";
  id: string;
  uuid: any | null;
  username: string | null;
  appAvatarUrl: string | null;
  currentCity: GetBlockedUser_getBlockedUser_blockedUsers_currentCity | null;
  isSelf: boolean | null;
}

export interface GetBlockedUser_getBlockedUser {
  __typename: "GetBlockedUserResponse";
  blockedUsers: (GetBlockedUser_getBlockedUser_blockedUsers | null)[] | null;
}

export interface GetBlockedUser {
  getBlockedUser: GetBlockedUser_getBlockedUser;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FrequentVisits
// ====================================================

export interface FrequentVisits_frequentVisits_cities_country {
  __typename: "CountryType";
  countryName: string | null;
  countryCode: string | null;
}

export interface FrequentVisits_frequentVisits_cities {
  __typename: "CityType";
  count: number | null;
  id: string;
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  cityId: string | null;
  cityPhoto: string | null;
  cityThumbnail: string | null;
  distance: number | null;
  country: FrequentVisits_frequentVisits_cities_country;
  likeCount: number | null;
  isLiked: boolean | null;
}

export interface FrequentVisits_frequentVisits {
  __typename: "CitiesResponse";
  cities: (FrequentVisits_frequentVisits_cities | null)[] | null;
}

export interface FrequentVisits {
  frequentVisits: FrequentVisits_frequentVisits;
}

export interface FrequentVisitsVariables {
  uuid: string;
  page?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TopContinents
// ====================================================

export interface TopContinents_topContinents_continents {
  __typename: "ContinentType";
  count: number | null;
  id: string;
  continentName: string | null;
  continentCode: string | null;
  continentPhoto: string | null;
  continentThumbnail: string | null;
}

export interface TopContinents_topContinents {
  __typename: "ContinentsResponse";
  continents: (TopContinents_topContinents_continents | null)[] | null;
}

export interface TopContinents {
  topContinents: TopContinents_topContinents;
}

export interface TopContinentsVariables {
  uuid: string;
  page?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TopCountries
// ====================================================

export interface TopCountries_topCountries_countries_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface TopCountries_topCountries_countries {
  __typename: "CountryType";
  count: number | null;
  id: string;
  countryName: string | null;
  countryCode: string | null;
  countryPhoto: string | null;
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: TopCountries_topCountries_countries_continent | null;
}

export interface TopCountries_topCountries {
  __typename: "CountriesResponse";
  countries: (TopCountries_topCountries_countries | null)[] | null;
}

export interface TopCountries {
  topCountries: TopCountries_topCountries;
}

export interface TopCountriesVariables {
  uuid: string;
  page?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EditProfile
// ====================================================

export interface EditProfile_editProfile_user_nationality_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface EditProfile_editProfile_user_nationality {
  __typename: "CountryType";
  countryEmoji: string | null;
  id: string;
  countryName: string | null;
  countryCode: string | null;
  countryPhoto: string | null;
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: EditProfile_editProfile_user_nationality_continent | null;
}

export interface EditProfile_editProfile_user_residence_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface EditProfile_editProfile_user_residence {
  __typename: "CountryType";
  countryEmoji: string | null;
  id: string;
  countryName: string | null;
  countryCode: string | null;
  countryPhoto: string | null;
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: EditProfile_editProfile_user_residence_continent | null;
}

export interface EditProfile_editProfile_user_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
  countryCode: string | null;
}

export interface EditProfile_editProfile_user_currentCity {
  __typename: "CityType";
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  cityId: string | null;
  cityPhoto: string | null;
  country: EditProfile_editProfile_user_currentCity_country;
}

export interface EditProfile_editProfile_user {
  __typename: "UserType";
  id: string;
  username: string | null;
  firstName: string;
  lastName: string;
  uuid: any | null;
  pushToken: string | null;
  bio: string | null;
  gender: UserGender | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  website: string | null;
  distance: number | null;
  countryPhoneNumber: string | null;
  countryPhoneCode: string | null;
  phoneNumber: string | null;
  emailAddress: string | null;
  isVerifiedPhoneNumber: boolean;
  isVerifiedEmailAddress: boolean;
  nationality: EditProfile_editProfile_user_nationality | null;
  residence: EditProfile_editProfile_user_residence | null;
  blockedUserCount: number | null;
  photoCount: number | null;
  postCount: number | null;
  tripCount: number | null;
  cityCount: number | null;
  countryCount: number | null;
  continentCount: number | null;
  isSelf: boolean | null;
  isDarkMode: boolean;
  isHidePhotos: boolean;
  isHideTrips: boolean;
  isHideCities: boolean;
  isHideCountries: boolean;
  isHideContinents: boolean;
  isAutoLocationReport: boolean;
  sendInstagram: string | null;
  sendTwitter: string | null;
  sendYoutube: string | null;
  sendTelegram: string | null;
  sendPhone: string | null;
  sendEmail: string | null;
  sendKakao: string | null;
  sendFacebook: string | null;
  sendSnapchat: string | null;
  sendLine: string | null;
  sendWechat: string | null;
  sendKik: string | null;
  sendVk: string | null;
  sendWhatsapp: string | null;
  sendBehance: string | null;
  sendLinkedin: string | null;
  sendPinterest: string | null;
  sendVine: string | null;
  sendTumblr: string | null;
  currentCity: EditProfile_editProfile_user_currentCity | null;
}

export interface EditProfile_editProfile {
  __typename: "EditProfileResponse";
  ok: boolean | null;
  token: string | null;
  user: EditProfile_editProfile_user | null;
}

export interface EditProfile {
  editProfile: EditProfile_editProfile;
}

export interface EditProfileVariables {
  username?: string | null;
  bio?: string | null;
  gender?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  nationalityCode?: string | null;
  residenceCode?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteProfile
// ====================================================

export interface DeleteProfile_deleteProfile {
  __typename: "DeleteProfileResponse";
  ok: boolean | null;
}

export interface DeleteProfile {
  deleteProfile: DeleteProfile_deleteProfile;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: StartEditPhoneVerification
// ====================================================

export interface StartEditPhoneVerification_startEditPhoneVerification {
  __typename: "StartEditPhoneVerificationResponse";
  ok: boolean | null;
}

export interface StartEditPhoneVerification {
  startEditPhoneVerification: StartEditPhoneVerification_startEditPhoneVerification;
}

export interface StartEditPhoneVerificationVariables {
  phoneNumber: string;
  countryPhoneNumber: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CompleteEditPhoneVerification
// ====================================================

export interface CompleteEditPhoneVerification_completeEditPhoneVerification {
  __typename: "CompleteEditPhoneVerificationResponse";
  ok: boolean | null;
  phoneNumber: string | null;
  countryPhoneNumber: string | null;
  countryPhoneCode: string | null;
  isVerifiedPhoneNumber: boolean | null;
}

export interface CompleteEditPhoneVerification {
  completeEditPhoneVerification: CompleteEditPhoneVerification_completeEditPhoneVerification;
}

export interface CompleteEditPhoneVerificationVariables {
  key: string;
  phoneNumber: string;
  countryPhoneNumber: string;
  countryPhoneCode: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: StartEditEmailVerification
// ====================================================

export interface StartEditEmailVerification_startEditEmailVerification {
  __typename: "StartEditEmailVerificationResponse";
  ok: boolean | null;
}

export interface StartEditEmailVerification {
  startEditEmailVerification: StartEditEmailVerification_startEditEmailVerification;
}

export interface StartEditEmailVerificationVariables {
  emailAddress: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ToggleSettings
// ====================================================

export interface ToggleSettings_toggleSettings_user {
  __typename: "UserType";
  id: string;
  username: string | null;
  uuid: any | null;
  isSelf: boolean | null;
  isDarkMode: boolean;
  isHidePhotos: boolean;
  isHideTrips: boolean;
  isHideCities: boolean;
  isHideCountries: boolean;
  isHideContinents: boolean;
  isAutoLocationReport: boolean;
}

export interface ToggleSettings_toggleSettings {
  __typename: "ToggleSettingsResponse";
  ok: boolean | null;
  user: ToggleSettings_toggleSettings_user | null;
}

export interface ToggleSettings {
  toggleSettings: ToggleSettings_toggleSettings;
}

export interface ToggleSettingsVariables {
  payload: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UserProfile
// ====================================================

export interface UserProfile_userProfile_user_nationality_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface UserProfile_userProfile_user_nationality {
  __typename: "CountryType";
  countryEmoji: string | null;
  id: string;
  countryName: string | null;
  countryCode: string | null;
  countryPhoto: string | null;
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: UserProfile_userProfile_user_nationality_continent | null;
}

export interface UserProfile_userProfile_user_residence_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface UserProfile_userProfile_user_residence {
  __typename: "CountryType";
  countryEmoji: string | null;
  id: string;
  countryName: string | null;
  countryCode: string | null;
  countryPhoto: string | null;
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: UserProfile_userProfile_user_residence_continent | null;
}

export interface UserProfile_userProfile_user_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
  countryCode: string | null;
}

export interface UserProfile_userProfile_user_currentCity {
  __typename: "CityType";
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  cityId: string | null;
  cityPhoto: string | null;
  country: UserProfile_userProfile_user_currentCity_country;
}

export interface UserProfile_userProfile_user {
  __typename: "UserType";
  id: string;
  username: string | null;
  firstName: string;
  lastName: string;
  uuid: any | null;
  pushToken: string | null;
  bio: string | null;
  gender: UserGender | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  website: string | null;
  distance: number | null;
  countryPhoneNumber: string | null;
  countryPhoneCode: string | null;
  phoneNumber: string | null;
  emailAddress: string | null;
  isVerifiedPhoneNumber: boolean;
  isVerifiedEmailAddress: boolean;
  nationality: UserProfile_userProfile_user_nationality | null;
  residence: UserProfile_userProfile_user_residence | null;
  blockedUserCount: number | null;
  photoCount: number | null;
  postCount: number | null;
  tripCount: number | null;
  cityCount: number | null;
  countryCount: number | null;
  continentCount: number | null;
  isSelf: boolean | null;
  isDarkMode: boolean;
  isHidePhotos: boolean;
  isHideTrips: boolean;
  isHideCities: boolean;
  isHideCountries: boolean;
  isHideContinents: boolean;
  isAutoLocationReport: boolean;
  currentCity: UserProfile_userProfile_user_currentCity | null;
}

export interface UserProfile_userProfile {
  __typename: "UserProfileResponse";
  user: UserProfile_userProfile_user | null;
}

export interface UserProfile {
  userProfile: UserProfile_userProfile;
}

export interface UserProfileVariables {
  uuid: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTrips
// ====================================================

export interface GetTrips_getTrips_trip_city_country_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface GetTrips_getTrips_trip_city_country {
  __typename: "CountryType";
  countryEmoji: string | null;
  countryName: string | null;
  countryCode: string | null;
  continent: GetTrips_getTrips_trip_city_country_continent | null;
}

export interface GetTrips_getTrips_trip_city {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
  cityThumbnail: string | null;
  country: GetTrips_getTrips_trip_city_country;
}

export interface GetTrips_getTrips_trip {
  __typename: "MoveNotificationType";
  id: string;
  city: GetTrips_getTrips_trip_city | null;
  naturalTime: string | null;
}

export interface GetTrips_getTrips {
  __typename: "TripResponse";
  trip: (GetTrips_getTrips_trip | null)[] | null;
}

export interface GetTrips {
  getTrips: GetTrips_getTrips;
}

export interface GetTripsVariables {
  uuid: string;
  page?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddTrip
// ====================================================

export interface AddTrip_addTrip_moveNotification_city_country_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface AddTrip_addTrip_moveNotification_city_country {
  __typename: "CountryType";
  countryName: string | null;
  countryCode: string | null;
  continent: AddTrip_addTrip_moveNotification_city_country_continent | null;
}

export interface AddTrip_addTrip_moveNotification_city {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
  cityThumbnail: string | null;
  country: AddTrip_addTrip_moveNotification_city_country;
}

export interface AddTrip_addTrip_moveNotification {
  __typename: "MoveNotificationType";
  city: AddTrip_addTrip_moveNotification_city | null;
}

export interface AddTrip_addTrip {
  __typename: "AddTripResponse";
  ok: boolean | null;
  distance: number | null;
  moveNotification: AddTrip_addTrip_moveNotification | null;
}

export interface AddTrip {
  addTrip: AddTrip_addTrip;
}

export interface AddTripVariables {
  cityId: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EditTrip
// ====================================================

export interface EditTrip_editTrip_moveNotification_city_country_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface EditTrip_editTrip_moveNotification_city_country {
  __typename: "CountryType";
  countryName: string | null;
  countryCode: string | null;
  continent: EditTrip_editTrip_moveNotification_city_country_continent | null;
}

export interface EditTrip_editTrip_moveNotification_city {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
  cityThumbnail: string | null;
  country: EditTrip_editTrip_moveNotification_city_country;
}

export interface EditTrip_editTrip_moveNotification {
  __typename: "MoveNotificationType";
  id: string;
  city: EditTrip_editTrip_moveNotification_city | null;
  naturalTime: string | null;
}

export interface EditTrip_editTrip {
  __typename: "EditTripResponse";
  ok: boolean | null;
  distance: number | null;
  moveNotification: EditTrip_editTrip_moveNotification | null;
}

export interface EditTrip {
  editTrip: EditTrip_editTrip;
}

export interface EditTripVariables {
  moveNotificationId: number;
  cityId?: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTrip
// ====================================================

export interface DeleteTrip_deleteTrip {
  __typename: "DeleteTripResponse";
  ok: boolean | null;
  distance: number | null;
  tripId: number | null;
}

export interface DeleteTrip {
  deleteTrip: DeleteTrip_deleteTrip;
}

export interface DeleteTripVariables {
  moveNotificationId: number;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CalculateDistance
// ====================================================

export interface CalculateDistance_calculateDistance {
  __typename: "CalculateDistanceResponse";
  distance: number | null;
}

export interface CalculateDistance {
  calculateDistance: CalculateDistance_calculateDistance;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SlackReportUsers
// ====================================================

export interface SlackReportUsers_slackReportUsers {
  __typename: "SlackReportUsersResponse";
  ok: boolean | null;
}

export interface SlackReportUsers {
  slackReportUsers: SlackReportUsers_slackReportUsers;
}

export interface SlackReportUsersVariables {
  targetUuid: string;
  payload: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSameTrips
// ====================================================

export interface GetSameTrips_getSameTrips_cities_country {
  __typename: "CountryType";
  countryEmoji: string | null;
}

export interface GetSameTrips_getSameTrips_cities {
  __typename: "CityType";
  id: string;
  cityName: string | null;
  country: GetSameTrips_getSameTrips_cities_country;
}

export interface GetSameTrips_getSameTrips {
  __typename: "GetSameTripsResponse";
  count: number | null;
  cities: (GetSameTrips_getSameTrips_cities | null)[] | null;
}

export interface GetSameTrips {
  getSameTrips: GetSameTrips_getSameTrips;
}

export interface GetSameTripsVariables {
  uuid: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Me
// ====================================================

export interface Me_me_user_nationality_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface Me_me_user_nationality {
  __typename: "CountryType";
  countryEmoji: string | null;
  id: string;
  countryName: string | null;
  countryCode: string | null;
  countryPhoto: string | null;
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: Me_me_user_nationality_continent | null;
}

export interface Me_me_user_residence_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface Me_me_user_residence {
  __typename: "CountryType";
  countryEmoji: string | null;
  id: string;
  countryName: string | null;
  countryCode: string | null;
  countryPhoto: string | null;
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: Me_me_user_residence_continent | null;
}

export interface Me_me_user_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
  countryCode: string | null;
}

export interface Me_me_user_currentCity {
  __typename: "CityType";
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  cityId: string | null;
  cityPhoto: string | null;
  country: Me_me_user_currentCity_country;
}

export interface Me_me_user {
  __typename: "UserType";
  id: string;
  username: string | null;
  firstName: string;
  lastName: string;
  uuid: any | null;
  pushToken: string | null;
  bio: string | null;
  gender: UserGender | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  website: string | null;
  distance: number | null;
  countryPhoneNumber: string | null;
  countryPhoneCode: string | null;
  phoneNumber: string | null;
  emailAddress: string | null;
  isVerifiedPhoneNumber: boolean;
  isVerifiedEmailAddress: boolean;
  nationality: Me_me_user_nationality | null;
  residence: Me_me_user_residence | null;
  blockedUserCount: number | null;
  photoCount: number | null;
  postCount: number | null;
  tripCount: number | null;
  cityCount: number | null;
  countryCount: number | null;
  continentCount: number | null;
  isSelf: boolean | null;
  isDarkMode: boolean;
  isHidePhotos: boolean;
  isHideTrips: boolean;
  isHideCities: boolean;
  isHideCountries: boolean;
  isHideContinents: boolean;
  isAutoLocationReport: boolean;
  sendInstagram: string | null;
  sendTwitter: string | null;
  sendYoutube: string | null;
  sendTelegram: string | null;
  sendPhone: string | null;
  sendEmail: string | null;
  sendKakao: string | null;
  sendFacebook: string | null;
  sendSnapchat: string | null;
  sendLine: string | null;
  sendWechat: string | null;
  sendKik: string | null;
  sendVk: string | null;
  sendWhatsapp: string | null;
  sendBehance: string | null;
  sendLinkedin: string | null;
  sendPinterest: string | null;
  sendVine: string | null;
  sendTumblr: string | null;
  currentCity: Me_me_user_currentCity | null;
}

export interface Me_me {
  __typename: "UserProfileResponse";
  user: Me_me_user | null;
}

export interface Me {
  me: Me_me;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SlackReportLocations
// ====================================================

export interface SlackReportLocations_slackReportLocations {
  __typename: "SlackReportLocationResponse";
  ok: boolean | null;
}

export interface SlackReportLocations {
  slackReportLocations: SlackReportLocations_slackReportLocations;
}

export interface SlackReportLocationsVariables {
  targetLocationId: string;
  targetLocationType: string;
  payload: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ReportLocation
// ====================================================

export interface ReportLocation_reportLocation {
  __typename: "ReportLocationResponse";
  ok: boolean | null;
}

export interface ReportLocation {
  reportLocation: ReportLocation_reportLocation;
}

export interface ReportLocationVariables {
  currentLat: number;
  currentLng: number;
  currentCityId?: string | null;
  currentCityName: string;
  currentCountryCode: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UploadAvatar
// ====================================================

export interface UploadAvatar_uploadAvatar_avatar {
  __typename: "AvatarType";
  id: string;
  uuid: any | null;
  image: string | null;
  isMain: boolean;
  likeCount: number | null;
  thumbnail: string | null;
}

export interface UploadAvatar_uploadAvatar {
  __typename: "UploadAvatarResponse";
  ok: boolean | null;
  preAvatarUUID: string | null;
  newAvatarUUID: string | null;
  avatar: UploadAvatar_uploadAvatar_avatar | null;
}

export interface UploadAvatar {
  uploadAvatar: UploadAvatar_uploadAvatar;
}

export interface UploadAvatarVariables {
  file: any;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegisterPush
// ====================================================

export interface RegisterPush_registerPush {
  __typename: "RegisterPushResponse";
  ok: boolean | null;
}

export interface RegisterPush {
  registerPush: RegisterPush_registerPush;
}

export interface RegisterPushVariables {
  pushToken: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddBlockUser
// ====================================================

export interface AddBlockUser_addBlockUser_blockedUser_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface AddBlockUser_addBlockUser_blockedUser_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: AddBlockUser_addBlockUser_blockedUser_currentCity_country;
}

export interface AddBlockUser_addBlockUser_blockedUser {
  __typename: "UserType";
  id: string;
  uuid: any | null;
  username: string | null;
  appAvatarUrl: string | null;
  currentCity: AddBlockUser_addBlockUser_blockedUser_currentCity | null;
  isSelf: boolean | null;
}

export interface AddBlockUser_addBlockUser {
  __typename: "AddBlockUserResponse";
  ok: boolean | null;
  blockedUser: AddBlockUser_addBlockUser_blockedUser | null;
}

export interface AddBlockUser {
  addBlockUser: AddBlockUser_addBlockUser;
}

export interface AddBlockUserVariables {
  uuid: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteBlockUser
// ====================================================

export interface DeleteBlockUser_deleteBlockUser {
  __typename: "DeleteBlockUserResponse";
  ok: boolean | null;
  uuid: string | null;
}

export interface DeleteBlockUser {
  deleteBlockUser: DeleteBlockUser_deleteBlockUser;
}

export interface DeleteBlockUserVariables {
  uuid: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Match
// ====================================================

export interface Match_match_match_city_country {
  __typename: "CountryType";
  countryName: string | null;
  countryEmoji: string | null;
}

export interface Match_match_match_city {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
  country: Match_match_match_city_country;
}

export interface Match_match_match_host_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface Match_match_match_host_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: Match_match_match_host_currentCity_country;
}

export interface Match_match_match_host {
  __typename: "TokenType";
  username: string | null;
  id: string;
  uuid: any | null;
  pushToken: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: Match_match_match_host_currentCity | null;
}

export interface Match_match_match_guest_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface Match_match_match_guest_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: Match_match_match_guest_currentCity_country;
}

export interface Match_match_match_guest {
  __typename: "TokenType";
  username: string | null;
  id: string;
  uuid: any | null;
  pushToken: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: Match_match_match_guest_currentCity | null;
}

export interface Match_match_match {
  __typename: "MatchType";
  id: string;
  naturalTime: string | null;
  isHost: boolean | null;
  isGuest: boolean | null;
  isMatching: boolean | null;
  city: Match_match_match_city | null;
  host: Match_match_match_host | null;
  guest: Match_match_match_guest | null;
  isReadByHost: boolean;
  isReadByGuest: boolean;
}

export interface Match_match {
  __typename: "MatchResponse";
  ok: boolean | null;
  cityId: string | null;
  countryCode: string | null;
  continentCode: string | null;
  match: Match_match_match | null;
}

export interface Match {
  match: Match_match;
}

export interface MatchVariables {
  cityId: string;
  hostUuid: string;
  guestUuid: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UnMatch
// ====================================================

export interface UnMatch_unMatch {
  __typename: "UnMatchResponse";
  ok: boolean | null;
  matchId: number | null;
  cityId: string | null;
  countryCode: string | null;
  continentCode: string | null;
}

export interface UnMatch {
  unMatch: UnMatch_unMatch;
}

export interface UnMatchVariables {
  matchId: number;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ProfileParts
// ====================================================

export interface ProfileParts_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface ProfileParts_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: ProfileParts_currentCity_country;
}

export interface ProfileParts {
  __typename: "UserType";
  id: string;
  uuid: any | null;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: ProfileParts_currentCity | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CityParts
// ====================================================

export interface CityParts_country {
  __typename: "CountryType";
  countryName: string | null;
  countryCode: string | null;
}

export interface CityParts {
  __typename: "CityType";
  id: string;
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  cityId: string | null;
  cityPhoto: string | null;
  cityThumbnail: string | null;
  distance: number | null;
  country: CityParts_country;
  likeCount: number | null;
  isLiked: boolean | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CountryParts
// ====================================================

export interface CountryParts_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface CountryParts {
  __typename: "CountryType";
  id: string;
  countryName: string | null;
  countryCode: string | null;
  countryPhoto: string | null;
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: CountryParts_continent | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ContinentParts
// ====================================================

export interface ContinentParts {
  __typename: "ContinentType";
  id: string;
  continentName: string | null;
  continentCode: string | null;
  continentPhoto: string | null;
  continentThumbnail: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: MatchParts
// ====================================================

export interface MatchParts_city_country {
  __typename: "CountryType";
  countryName: string | null;
  countryEmoji: string | null;
}

export interface MatchParts_city {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
  country: MatchParts_city_country;
}

export interface MatchParts_host_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface MatchParts_host_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: MatchParts_host_currentCity_country;
}

export interface MatchParts_host {
  __typename: "TokenType";
  username: string | null;
  id: string;
  uuid: any | null;
  pushToken: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: MatchParts_host_currentCity | null;
}

export interface MatchParts_guest_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface MatchParts_guest_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: MatchParts_guest_currentCity_country;
}

export interface MatchParts_guest {
  __typename: "TokenType";
  username: string | null;
  id: string;
  uuid: any | null;
  pushToken: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: MatchParts_guest_currentCity | null;
}

export interface MatchParts {
  __typename: "MatchType";
  id: string;
  naturalTime: string | null;
  isHost: boolean | null;
  isGuest: boolean | null;
  isMatching: boolean | null;
  city: MatchParts_city | null;
  host: MatchParts_host | null;
  guest: MatchParts_guest | null;
  isReadByHost: boolean;
  isReadByGuest: boolean;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * An enumeration.
 */
export enum UserGender {
  FEMALE = "FEMALE",
  MALE = "MALE",
  OTHER = "OTHER",
}

//==============================================================
// END Enums and Input Objects
//==============================================================
