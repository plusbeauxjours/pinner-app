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
// GraphQL mutation operation: CompleteEmailVerification
// ====================================================

export interface CompleteEmailVerification_completeEmailVerification_user_profile_currentCity {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
}

export interface CompleteEmailVerification_completeEmailVerification_user_profile {
  __typename: "ProfileType";
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  currentCity: CompleteEmailVerification_completeEmailVerification_user_profile_currentCity | null;
}

export interface CompleteEmailVerification_completeEmailVerification_user {
  __typename: "UserType";
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username: string;
  profile: CompleteEmailVerification_completeEmailVerification_user_profile | null;
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
// GraphQL query operation: RecommendUsers
// ====================================================

export interface RecommendUsers_recommendUsers_users_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface RecommendUsers_recommendUsers_users_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: RecommendUsers_recommendUsers_users_currentCity_country;
}

export interface RecommendUsers_recommendUsers_users {
  __typename: "ProfileType";
  id: string;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: RecommendUsers_recommendUsers_users_currentCity | null;
}

export interface RecommendUsers_recommendUsers {
  __typename: "RecommendUsersResponse";
  page: number | null;
  hasNextPage: boolean | null;
  users: (RecommendUsers_recommendUsers_users | null)[] | null;
}

export interface RecommendUsers {
  recommendUsers: RecommendUsers_recommendUsers;
}

export interface RecommendUsersVariables {
  page?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: RecommendLocations
// ====================================================

export interface RecommendLocations_recommendLocations_cities_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface RecommendLocations_recommendLocations_cities {
  __typename: "CityType";
  id: string;
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  cityId: string | null;
  cityThumbnail: string | null;
  distance: number | null;
  country: RecommendLocations_recommendLocations_cities_country;
  likeCount: number | null;
  isLiked: boolean | null;
}

export interface RecommendLocations_recommendLocations {
  __typename: "RecommendLocationsResponse";
  page: number | null;
  hasNextPage: boolean | null;
  cities: (RecommendLocations_recommendLocations_cities | null)[] | null;
}

export interface RecommendLocations {
  recommendLocations: RecommendLocations_recommendLocations;
}

export interface RecommendLocationsVariables {
  page?: number | null;
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
}

export interface GetMatches_getMatches_matches_city {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
  country: GetMatches_getMatches_matches_city_country;
}

export interface GetMatches_getMatches_matches_host_profile_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface GetMatches_getMatches_matches_host_profile_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: GetMatches_getMatches_matches_host_profile_currentCity_country;
}

export interface GetMatches_getMatches_matches_host_profile {
  __typename: "ProfileType";
  id: string;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: GetMatches_getMatches_matches_host_profile_currentCity | null;
}

export interface GetMatches_getMatches_matches_host {
  __typename: "UserType";
  profile: GetMatches_getMatches_matches_host_profile | null;
}

export interface GetMatches_getMatches_matches_guest_profile_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface GetMatches_getMatches_matches_guest_profile_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: GetMatches_getMatches_matches_guest_profile_currentCity_country;
}

export interface GetMatches_getMatches_matches_guest_profile {
  __typename: "ProfileType";
  id: string;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: GetMatches_getMatches_matches_guest_profile_currentCity | null;
}

export interface GetMatches_getMatches_matches_guest {
  __typename: "UserType";
  profile: GetMatches_getMatches_matches_guest_profile | null;
}

export interface GetMatches_getMatches_matches_coffee_city_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface GetMatches_getMatches_matches_coffee_city {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
  country: GetMatches_getMatches_matches_coffee_city_country;
}

export interface GetMatches_getMatches_matches_coffee {
  __typename: "CoffeeType";
  id: string;
  uuid: any | null;
  target: CoffeeTarget;
  city: GetMatches_getMatches_matches_coffee_city;
}

export interface GetMatches_getMatches_matches {
  __typename: "MatchType";
  id: string;
  naturalTime: string | null;
  city: GetMatches_getMatches_matches_city | null;
  host: GetMatches_getMatches_matches_host | null;
  guest: GetMatches_getMatches_matches_guest | null;
  coffee: GetMatches_getMatches_matches_coffee | null;
  isHost: boolean | null;
  isGuest: boolean | null;
  isMatching: boolean | null;
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
  matchPage?: number | null;
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
  matchId: string;
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
  __typename: "ProfileType";
  id: string;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: CityProfile_cityProfile_usersNow_currentCity | null;
}

export interface CityProfile_cityProfile_usersBefore_actor_profile_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface CityProfile_cityProfile_usersBefore_actor_profile_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: CityProfile_cityProfile_usersBefore_actor_profile_currentCity_country;
}

export interface CityProfile_cityProfile_usersBefore_actor_profile {
  __typename: "ProfileType";
  id: string;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: CityProfile_cityProfile_usersBefore_actor_profile_currentCity | null;
}

export interface CityProfile_cityProfile_usersBefore_actor {
  __typename: "UserType";
  profile: CityProfile_cityProfile_usersBefore_actor_profile | null;
}

export interface CityProfile_cityProfile_usersBefore {
  __typename: "MoveNotificationType";
  actor: CityProfile_cityProfile_usersBefore_actor;
}

export interface CityProfile_cityProfile_city_country_continent {
  __typename: "ContinentType";
  id: string;
  continentName: string | null;
  continentCode: string | null;
  continentThumbnail: string | null;
}

export interface CityProfile_cityProfile_city_country {
  __typename: "CountryType";
  countryName: string | null;
  countryPhoto: string | null;
  countryCode: string | null;
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
  diff: number | null;
}

export interface CityProfile_cityProfile {
  __typename: "CityProfileResponse";
  count: number | null;
  hasNextPage: boolean | null;
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
}

export interface GetSamenameCities_getSamenameCities_cities {
  __typename: "CityType";
  id: string;
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  cityId: string | null;
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
// GraphQL query operation: ContinentProfile
// ====================================================

export interface ContinentProfile_continentProfile_usersNow_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface ContinentProfile_continentProfile_usersNow_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: ContinentProfile_continentProfile_usersNow_currentCity_country;
}

export interface ContinentProfile_continentProfile_usersNow {
  __typename: "ProfileType";
  id: string;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: ContinentProfile_continentProfile_usersNow_currentCity | null;
}

export interface ContinentProfile_continentProfile_usersBefore_actor_profile_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface ContinentProfile_continentProfile_usersBefore_actor_profile_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: ContinentProfile_continentProfile_usersBefore_actor_profile_currentCity_country;
}

export interface ContinentProfile_continentProfile_usersBefore_actor_profile {
  __typename: "ProfileType";
  id: string;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: ContinentProfile_continentProfile_usersBefore_actor_profile_currentCity | null;
}

export interface ContinentProfile_continentProfile_usersBefore_actor {
  __typename: "UserType";
  profile: ContinentProfile_continentProfile_usersBefore_actor_profile | null;
}

export interface ContinentProfile_continentProfile_usersBefore {
  __typename: "MoveNotificationType";
  actor: ContinentProfile_continentProfile_usersBefore_actor;
}

export interface ContinentProfile_continentProfile_continent {
  __typename: "ContinentType";
  countryCount: number | null;
  id: string;
  continentName: string | null;
  continentCode: string | null;
  continentThumbnail: string | null;
}

export interface ContinentProfile_continentProfile_continents {
  __typename: "ContinentType";
  countryCount: number | null;
  id: string;
  continentName: string | null;
  continentCode: string | null;
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
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: ContinentProfile_continentProfile_countries_continent | null;
}

export interface ContinentProfile_continentProfile {
  __typename: "ContinentProfileResponse";
  count: number | null;
  hasNextPage: boolean | null;
  usersNow: (ContinentProfile_continentProfile_usersNow | null)[] | null;
  usersBefore: (ContinentProfile_continentProfile_usersBefore | null)[] | null;
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

export interface CountryProfile_countryProfile_usersNow_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface CountryProfile_countryProfile_usersNow_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: CountryProfile_countryProfile_usersNow_currentCity_country;
}

export interface CountryProfile_countryProfile_usersNow {
  __typename: "ProfileType";
  id: string;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: CountryProfile_countryProfile_usersNow_currentCity | null;
}

export interface CountryProfile_countryProfile_usersBefore_actor_profile_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface CountryProfile_countryProfile_usersBefore_actor_profile_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: CountryProfile_countryProfile_usersBefore_actor_profile_currentCity_country;
}

export interface CountryProfile_countryProfile_usersBefore_actor_profile {
  __typename: "ProfileType";
  id: string;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: CountryProfile_countryProfile_usersBefore_actor_profile_currentCity | null;
}

export interface CountryProfile_countryProfile_usersBefore_actor {
  __typename: "UserType";
  profile: CountryProfile_countryProfile_usersBefore_actor_profile | null;
}

export interface CountryProfile_countryProfile_usersBefore {
  __typename: "MoveNotificationType";
  actor: CountryProfile_countryProfile_usersBefore_actor;
}

export interface CountryProfile_countryProfile_cities_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface CountryProfile_countryProfile_cities {
  __typename: "CityType";
  id: string;
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  cityId: string | null;
  cityThumbnail: string | null;
  distance: number | null;
  country: CountryProfile_countryProfile_cities_country;
  likeCount: number | null;
  isLiked: boolean | null;
}

export interface CountryProfile_countryProfile {
  __typename: "CountryProfileResponse";
  count: number | null;
  hasNextPage: boolean | null;
  country: CountryProfile_countryProfile_country | null;
  usersNow: (CountryProfile_countryProfile_usersNow | null)[] | null;
  usersBefore: (CountryProfile_countryProfile_usersBefore | null)[] | null;
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
// GraphQL query operation: UserProfile
// ====================================================

export interface UserProfile_userProfile_user_profile_nationality_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface UserProfile_userProfile_user_profile_nationality {
  __typename: "CountryType";
  countryEmoji: string | null;
  id: string;
  countryName: string | null;
  countryCode: string | null;
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: UserProfile_userProfile_user_profile_nationality_continent | null;
}

export interface UserProfile_userProfile_user_profile_residence_continent {
  __typename: "ContinentType";
  continentCode: string | null;
  continentName: string | null;
}

export interface UserProfile_userProfile_user_profile_residence {
  __typename: "CountryType";
  countryEmoji: string | null;
  id: string;
  countryName: string | null;
  countryCode: string | null;
  countryThumbnail: string | null;
  cityCount: number | null;
  continent: UserProfile_userProfile_user_profile_residence_continent | null;
}

export interface UserProfile_userProfile_user_profile_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
  countryCode: string | null;
}

export interface UserProfile_userProfile_user_profile_currentCity {
  __typename: "CityType";
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  cityId: string | null;
  cityPhoto: string | null;
  country: UserProfile_userProfile_user_profile_currentCity_country;
}

export interface UserProfile_userProfile_user_profile {
  __typename: "ProfileType";
  bio: string | null;
  gender: ProfileGender | null;
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
  nationality: UserProfile_userProfile_user_profile_nationality | null;
  residence: UserProfile_userProfile_user_profile_residence | null;
  postCount: number | null;
  tripCount: number | null;
  coffeeCount: number | null;
  cityCount: number | null;
  countryCount: number | null;
  continentCount: number | null;
  isSelf: boolean | null;
  isDarkMode: boolean;
  isHideTrips: boolean;
  isHideCoffees: boolean;
  isHideCities: boolean;
  isHideCountries: boolean;
  isHideContinents: boolean;
  isAutoLocationReport: boolean;
  currentCity: UserProfile_userProfile_user_profile_currentCity | null;
}

export interface UserProfile_userProfile_user {
  __typename: "UserType";
  id: string;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username: string;
  firstName: string;
  lastName: string;
  profile: UserProfile_userProfile_user_profile | null;
}

export interface UserProfile_userProfile {
  __typename: "UserProfileResponse";
  user: UserProfile_userProfile_user | null;
}

export interface UserProfile {
  userProfile: UserProfile_userProfile;
}

export interface UserProfileVariables {
  username: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTrips
// ====================================================

export interface GetTrips_getTrips_trip_city_country {
  __typename: "CountryType";
  countryName: string | null;
  countryCode: string | null;
}

export interface GetTrips_getTrips_trip_city {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
  cityPhoto: string | null;
  country: GetTrips_getTrips_trip_city_country;
}

export interface GetTrips_getTrips_trip {
  __typename: "MoveNotificationType";
  id: string;
  city: GetTrips_getTrips_trip_city | null;
  startDate: any | null;
  endDate: any | null;
  naturalTime: string | null;
  diffDays: number | null;
}

export interface GetTrips_getTrips {
  __typename: "TripResponse";
  page: number | null;
  hasNextPage: boolean | null;
  trip: (GetTrips_getTrips_trip | null)[] | null;
}

export interface GetTrips {
  getTrips: GetTrips_getTrips;
}

export interface GetTripsVariables {
  username: string;
  page?: number | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddTrip
// ====================================================

export interface AddTrip_addTrip_moveNotification_city_country {
  __typename: "CountryType";
  countryName: string | null;
  countryCode: string | null;
}

export interface AddTrip_addTrip_moveNotification_city {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
  cityPhoto: string | null;
  country: AddTrip_addTrip_moveNotification_city_country;
}

export interface AddTrip_addTrip_moveNotification {
  __typename: "MoveNotificationType";
  startDate: any | null;
  endDate: any | null;
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
  startDate: any;
  endDate: any;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EditTrip
// ====================================================

export interface EditTrip_editTrip_moveNotification_city_country {
  __typename: "CountryType";
  countryName: string | null;
  countryCode: string | null;
}

export interface EditTrip_editTrip_moveNotification_city {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
  cityPhoto: string | null;
  country: EditTrip_editTrip_moveNotification_city_country;
}

export interface EditTrip_editTrip_moveNotification {
  __typename: "MoveNotificationType";
  id: string;
  city: EditTrip_editTrip_moveNotification_city | null;
  startDate: any | null;
  endDate: any | null;
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
  startDate?: any | null;
  endDate?: any | null;
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
  userName: string;
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
  targetUsername: string;
  payload: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Me
// ====================================================

export interface Me_me_user_profile_residence {
  __typename: "CountryType";
  countryCode: string | null;
  countryName: string | null;
  countryEmoji: string | null;
}

export interface Me_me_user_profile_nationality {
  __typename: "CountryType";
  countryCode: string | null;
  countryName: string | null;
  countryEmoji: string | null;
}

export interface Me_me_user_profile_currentCity {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
}

export interface Me_me_user_profile {
  __typename: "ProfileType";
  gender: ProfileGender | null;
  residence: Me_me_user_profile_residence | null;
  nationality: Me_me_user_profile_nationality | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  currentCity: Me_me_user_profile_currentCity | null;
}

export interface Me_me_user {
  __typename: "UserType";
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username: string;
  profile: Me_me_user_profile | null;
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
// GraphQL query operation: GetCoffees
// ====================================================

export interface GetCoffees_getCoffees_coffees_city_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface GetCoffees_getCoffees_coffees_city {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
  cityThumbnail: string | null;
  country: GetCoffees_getCoffees_coffees_city_country;
}

export interface GetCoffees_getCoffees_coffees_host_profile_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface GetCoffees_getCoffees_coffees_host_profile_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: GetCoffees_getCoffees_coffees_host_profile_currentCity_country;
}

export interface GetCoffees_getCoffees_coffees_host_profile {
  __typename: "ProfileType";
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: GetCoffees_getCoffees_coffees_host_profile_currentCity | null;
}

export interface GetCoffees_getCoffees_coffees_host {
  __typename: "UserType";
  id: string;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username: string;
  profile: GetCoffees_getCoffees_coffees_host_profile | null;
}

export interface GetCoffees_getCoffees_coffees {
  __typename: "CoffeeType";
  id: string;
  uuid: any | null;
  city: GetCoffees_getCoffees_coffees_city;
  host: GetCoffees_getCoffees_coffees_host;
  status: string | null;
  naturalTime: string | null;
  target: CoffeeTarget;
  createdAt: any;
}

export interface GetCoffees_getCoffees {
  __typename: "GetCoffeesResponse";
  coffees: (GetCoffees_getCoffees_coffees | null)[] | null;
}

export interface GetCoffees {
  getCoffees: GetCoffees_getCoffees;
}

export interface GetCoffeesVariables {
  cityId?: string | null;
  countryCode?: string | null;
  continentCode?: string | null;
  userName?: string | null;
  location: string;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RequestCoffee
// ====================================================

export interface RequestCoffee_requestCoffee_coffee_city_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface RequestCoffee_requestCoffee_coffee_city {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
  cityThumbnail: string | null;
  country: RequestCoffee_requestCoffee_coffee_city_country;
}

export interface RequestCoffee_requestCoffee_coffee_host_profile_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface RequestCoffee_requestCoffee_coffee_host_profile_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: RequestCoffee_requestCoffee_coffee_host_profile_currentCity_country;
}

export interface RequestCoffee_requestCoffee_coffee_host_profile {
  __typename: "ProfileType";
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: RequestCoffee_requestCoffee_coffee_host_profile_currentCity | null;
}

export interface RequestCoffee_requestCoffee_coffee_host {
  __typename: "UserType";
  id: string;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username: string;
  profile: RequestCoffee_requestCoffee_coffee_host_profile | null;
}

export interface RequestCoffee_requestCoffee_coffee {
  __typename: "CoffeeType";
  id: string;
  uuid: any | null;
  city: RequestCoffee_requestCoffee_coffee_city;
  host: RequestCoffee_requestCoffee_coffee_host;
  status: string | null;
  naturalTime: string | null;
  target: CoffeeTarget;
  createdAt: any;
}

export interface RequestCoffee_requestCoffee {
  __typename: "RequestCoffeeResponse";
  ok: boolean | null;
  coffee: RequestCoffee_requestCoffee_coffee | null;
}

export interface RequestCoffee {
  requestCoffee: RequestCoffee_requestCoffee;
}

export interface RequestCoffeeVariables {
  countryCode?: string | null;
  gender?: string | null;
  currentCityId: string;
  target?: string | null;
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
  __typename: "ProfileType";
  id: string;
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
}

export interface CityParts {
  __typename: "CityType";
  id: string;
  latitude: number | null;
  longitude: number | null;
  cityName: string | null;
  cityId: string | null;
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
  continentThumbnail: string | null;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CoffeeParts
// ====================================================

export interface CoffeeParts_city_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface CoffeeParts_city {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
  cityThumbnail: string | null;
  country: CoffeeParts_city_country;
}

export interface CoffeeParts_host_profile_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface CoffeeParts_host_profile_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: CoffeeParts_host_profile_currentCity_country;
}

export interface CoffeeParts_host_profile {
  __typename: "ProfileType";
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: CoffeeParts_host_profile_currentCity | null;
}

export interface CoffeeParts_host {
  __typename: "UserType";
  id: string;
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username: string;
  profile: CoffeeParts_host_profile | null;
}

export interface CoffeeParts {
  __typename: "CoffeeType";
  id: string;
  uuid: any | null;
  city: CoffeeParts_city;
  host: CoffeeParts_host;
  status: string | null;
  naturalTime: string | null;
  target: CoffeeTarget;
  createdAt: any;
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
}

export interface MatchParts_city {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
  country: MatchParts_city_country;
}

export interface MatchParts_host_profile_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface MatchParts_host_profile_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: MatchParts_host_profile_currentCity_country;
}

export interface MatchParts_host_profile {
  __typename: "ProfileType";
  id: string;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: MatchParts_host_profile_currentCity | null;
}

export interface MatchParts_host {
  __typename: "UserType";
  profile: MatchParts_host_profile | null;
}

export interface MatchParts_guest_profile_currentCity_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface MatchParts_guest_profile_currentCity {
  __typename: "CityType";
  cityName: string | null;
  country: MatchParts_guest_profile_currentCity_country;
}

export interface MatchParts_guest_profile {
  __typename: "ProfileType";
  id: string;
  username: string | null;
  avatarUrl: string | null;
  appAvatarUrl: string | null;
  isSelf: boolean | null;
  currentCity: MatchParts_guest_profile_currentCity | null;
}

export interface MatchParts_guest {
  __typename: "UserType";
  profile: MatchParts_guest_profile | null;
}

export interface MatchParts_coffee_city_country {
  __typename: "CountryType";
  countryName: string | null;
}

export interface MatchParts_coffee_city {
  __typename: "CityType";
  cityId: string | null;
  cityName: string | null;
  country: MatchParts_coffee_city_country;
}

export interface MatchParts_coffee {
  __typename: "CoffeeType";
  id: string;
  uuid: any | null;
  target: CoffeeTarget;
  city: MatchParts_coffee_city;
}

export interface MatchParts {
  __typename: "MatchType";
  id: string;
  naturalTime: string | null;
  city: MatchParts_city | null;
  host: MatchParts_host | null;
  guest: MatchParts_guest | null;
  coffee: MatchParts_coffee | null;
  isHost: boolean | null;
  isGuest: boolean | null;
  isMatching: boolean | null;
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
export enum CoffeeTarget {
  EVERYONE = "EVERYONE",
  GENDER = "GENDER",
  NATIONALITY = "NATIONALITY",
  RESIDENCE = "RESIDENCE",
}

/**
 * An enumeration.
 */
export enum ProfileGender {
  FEMALE = "FEMALE",
  MALE = "MALE",
  OTHER = "OTHER",
}

//==============================================================
// END Enums and Input Objects
//==============================================================
