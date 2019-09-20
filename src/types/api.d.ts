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
  cityPhoto: string | null;
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
  cityPhoto: string | null;
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
  cityPhoto: string | null;
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
