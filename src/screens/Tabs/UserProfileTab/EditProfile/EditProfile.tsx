import React, { useState } from "react";
import { useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { useTheme } from "../../../../hooks/useTheme";
import { useMe } from "../../../../context/MeContext";
import { useLocation } from "../../../../context/LocationContext";
import {
  EditProfile,
  EditProfileVariables,
  DeleteProfile,
  StartEditPhoneVerification,
  StartEditPhoneVerificationVariables,
  CompleteEditPhoneVerification,
  CompleteEditPhoneVerificationVariables,
  ToggleSettings,
  ToggleSettingsVariables,
  UserProfile
} from "../../../../types/api";
import {
  EDIT_PROFILE,
  DELETE_PROFILE,
  START_EDIT_PHONE_VERIFICATION,
  COMPLETE_EDIT_PHONE_VERIFICATION,
  START_EDIT_EMAIL_VERIFICATION,
  TOGGLE_SETTINGS
} from "./EditProfileQueries";
import Loader from "../../../../components/Loader";
import {
  StartEditEmailVerification,
  StartEditEmailVerificationVariables
} from "../../../../types/api";
import NavIcon from "../../../../components/NavIcon";
import { GET_USER } from "../UserProfile/UserProfileQueries";
import { UserProfileVariables } from "../../../../types/api";
import {
  RefreshControl,
  Platform,
  TextInput,
  ActivityIndicator
} from "react-native";
import constants from "../../../../../constants";
import { countries } from "../../../../../countryData";

const View = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-color: ${props => props.theme.bgColor};
`;

const ToggleContainer = styled.View``;
const ToggleText = styled.Text`
  color: ${props => props.theme.color};
`;

const Text = styled.Text`
  font-size: 12px;
`;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 20;
  text-align: center;
  margin-top: 10px;
  color: ${props => props.theme.color};
`;
const Item = styled.View`
  margin-top: 15px;
  flex-direction: row;
  justify-content: space-between;
`;

const ToggleIcon = styled.TouchableOpacity``;
const Touchable = styled.TouchableOpacity``;
const ExplainText = styled.Text`
  font-size: 12px;
  font-weight: 100;
  color: ${props => props.theme.color};
`;
const ScrollView = styled.ScrollView`
  background-color: ${props => props.theme.bgColor};
`;

const LoaderContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bgColor};
  justify-content: center;
  align-items: center;
`;
const ButtonContainer = styled.View`
  border: 0.5px #999;
  padding: 10px;
  border-radius: 4px;
  width: ${constants.width / 6};
  height: 20px;
`;

export default ({ navigation }) => {
  const profileRefetch = navigation.getParam("profileRefetch");
  const profile = navigation.getParam("profile");
  const me = useMe();
  const location = useLocation();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(
    navigation.getParam("username")
  );
  const [bio, setBio] = useState<string>(profile.bio);
  const [gender, setGender] = useState<string>(profile.gender);
  const [firstName, setFirstName] = useState<string>(
    navigation.getParam("firstName")
  );
  const [lastName, setLastName] = useState<string>(
    navigation.getParam("lastName")
  );
  const [nationalityCode, setNationalityCode] = useState<string>(
    profile.nationality && profile.nationality.countryCode
  );
  const [residenceCode, setResidenceCode] = useState<string>(
    profile.residence && profile.residence.countryCode
  );
  const [isDarkMode, setIsDarkMode] = useState<boolean>(theme);
  const [isHideTrips, setIsHideTrips] = useState<boolean>(profile.isHideTrips);
  const [isHideCoffees, setIsHideCoffees] = useState<boolean>(
    profile.isHideCoffees
  );
  const [isHideCities, setIsHideCities] = useState<boolean>(
    profile.isHideCities
  );
  const [isHideCountries, setIsHideCountries] = useState<boolean>(
    profile.isHideCountries
  );
  const [isHideContinents, setIsHideContinents] = useState<boolean>(
    profile.isHideContinents
  );
  const [isAutoLocationReport, setIsAutoLocationReport] = useState<boolean>(
    profile.isAutoLocationReport
  );

  const [phoneNumber, setPhoneNumber] = useState<string>(profile.phoneNumber);
  const [countryPhoneNumber, setCountryPhoneNumber] = useState<string>(
    profile.countryPhoneNumber
  );
  const [countryPhoneCode, setCountryPhoneCode] = useState<string>(
    profile.countryPhoneCode
  );

  const [editProfileFn] = useMutation<EditProfile, EditProfileVariables>(
    EDIT_PROFILE,
    {
      variables: {
        username,
        bio,
        gender,
        firstName,
        lastName,
        nationalityCode,
        residenceCode
      }
    }
  );
  const [submitModal, setSubmitModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteProfileFn, { loading: deladeLoading }] = useMutation<
    DeleteProfile
  >(DELETE_PROFILE);
  const [startEditPhoneVerificationFn] = useMutation<
    StartEditPhoneVerification,
    StartEditPhoneVerificationVariables
  >(START_EDIT_PHONE_VERIFICATION, {
    variables: {
      phoneNumber,
      countryPhoneNumber
    }
  });
  const [completeEditPhoneVerificationFn] = useMutation<
    CompleteEditPhoneVerification,
    CompleteEditPhoneVerificationVariables
  >(COMPLETE_EDIT_PHONE_VERIFICATION, {
    variables: {
      key: "",
      phoneNumber,
      countryPhoneNumber,
      countryPhoneCode: ""
    }
  });
  const [startEditEmailVerificationFn] = useMutation<
    StartEditEmailVerification,
    StartEditEmailVerificationVariables
  >(START_EDIT_EMAIL_VERIFICATION, {
    variables: {
      emailAddress: ""
    }
  });
  const [toggleSettingsFn] = useMutation<
    ToggleSettings,
    ToggleSettingsVariables
  >(TOGGLE_SETTINGS, {
    update(cache, { data: { toggleSettings } }) {
      try {
        const data = cache.readQuery<UserProfile, UserProfileVariables>({
          query: GET_USER,
          variables: { username }
        });
        if (data) {
          data.userProfile.user.profile.isDarkMode =
            toggleSettings.user.profile.isDarkMode;
          data.userProfile.user.profile.isHideTrips =
            toggleSettings.user.profile.isHideTrips;
          data.userProfile.user.profile.isHideCoffees =
            toggleSettings.user.profile.isHideCoffees;
          data.userProfile.user.profile.isHideCities =
            toggleSettings.user.profile.isHideCities;
          data.userProfile.user.profile.isHideCountries =
            toggleSettings.user.profile.isHideCountries;
          data.userProfile.user.profile.isHideContinents =
            toggleSettings.user.profile.isHideContinents;
          data.userProfile.user.profile.isAutoLocationReport =
            toggleSettings.user.profile.isAutoLocationReport;
          cache.writeQuery({
            query: GET_USER,
            variables: { username },
            data
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
  const onPressToggleIcon = async (payload: string) => {
    if (payload === "HIDE_TRIPS") {
      setIsHideTrips(isHideTrips => !isHideTrips);
    } else if (payload === "HIDE_COFFEES") {
      setIsHideCoffees(isHideCoffees => !isHideCoffees);
    } else if (payload === "HIDE_CITIES") {
      setIsHideCities(isHideCities => !isHideCities);
    } else if (payload === "HIDE_COUNTRIES") {
      setIsHideCountries(isHideCountries => !isHideCountries);
    } else if (payload === "HIDE_CONTINENTS") {
      setIsHideContinents(isHideContinents => !isHideContinents);
    } else if (payload === "AUTO_LOCATION_REPORT") {
      setIsAutoLocationReport(isAutoLocationReport => !isAutoLocationReport);
    }
    await toggleSettingsFn({
      variables: { payload }
    });
  };
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await profileRefetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {loading ? (
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      ) : (
        <View>
          <Bold>EDIT PROFILE</Bold>
          <ToggleContainer>
            <Item>
              <ToggleText>USERNAME</ToggleText>
              <TextInput
                style={{
                  width: constants.width / 2,
                  backgroundColor: "transparent",
                  borderBottomWidth: 1,
                  borderBottomColor: "#999",
                  color: "#999"
                }}
                value={username}
                returnKeyType="done"
                onChangeText={text => setUsername(text)}
                autoCorrect={false}
              />
            </Item>
            <ExplainText>
              Default username is automatically generated. Set your own username
              here. Your username cannot be any combination of numbers or
              symbols.
            </ExplainText>
            <Item>
              <ToggleText>NATIONALITY</ToggleText>
              <TextInput
                style={{
                  width: constants.width / 2,
                  backgroundColor: "transparent",
                  borderBottomWidth: 1,
                  borderBottomColor: "#999",
                  color: "#999"
                }}
                value={navigation.value}
                returnKeyType="done"
                onChangeText={text => setUsername(text)}
                autoCorrect={false}
              />
            </Item>
            <ExplainText>Your Nationality to match</ExplainText>
            <Item>
              <ToggleText>RESIDENCE</ToggleText>
              <TextInput
                style={{
                  width: constants.width / 2,
                  backgroundColor: "transparent",
                  borderBottomWidth: 1,
                  borderBottomColor: "#999",
                  color: "#999"
                }}
                value={navigation.value}
                returnKeyType="done"
                onChangeText={text => setUsername(text)}
                autoCorrect={false}
              />
            </Item>
            <ExplainText>Your Residence to match</ExplainText>
            <Item>
              <ToggleText>GENDER</ToggleText>
              <TextInput
                style={{
                  width: constants.width / 2,
                  backgroundColor: "transparent",
                  borderBottomWidth: 1,
                  borderBottomColor: "#999",
                  color: "#999"
                }}
                value={navigation.value}
                returnKeyType="done"
                onChangeText={text => setUsername(text)}
                autoCorrect={false}
              />
            </Item>
            <ExplainText>Your gender to match</ExplainText>
            <Item>
              <ToggleText>FIRST NAME</ToggleText>
              <TextInput
                style={{
                  width: constants.width / 2,
                  backgroundColor: "transparent",
                  borderBottomWidth: 1,
                  borderBottomColor: "#999",
                  color: "#999"
                }}
                value={firstName}
                returnKeyType="done"
                onChangeText={text => setFirstName(text)}
                autoCorrect={false}
              />
            </Item>
            <ExplainText>Your first name</ExplainText>
            <Item>
              <ToggleText>LAST NAME</ToggleText>
              <TextInput
                style={{
                  width: constants.width / 2,
                  backgroundColor: "transparent",
                  borderBottomWidth: 1,
                  borderBottomColor: "#999",
                  color: "#999"
                }}
                value={lastName}
                returnKeyType="done"
                onChangeText={text => setLastName(text)}
                autoCorrect={false}
              />
            </Item>
            <ExplainText>Your last name</ExplainText>
            <Item>
              <TextInput
                style={{
                  width: constants.width - 30,
                  backgroundColor: "transparent",
                  borderBottomWidth: 1,
                  borderBottomColor: "#999",
                  color: "#999"
                }}
                value={bio}
                placeholder={"BIO"}
                returnKeyType="done"
                onChangeText={text => setBio(text)}
                autoCorrect={false}
              />
            </Item>
            <ExplainText>
              Your BIO is displayed on your profile. You can write about who you
              are and what you're looking for on Pinner. You can also add links
              to your website and profiles on other websites, like Instagram or
              your blog for example.
            </ExplainText>
            <Item>
              <ToggleText>SUBMIT</ToggleText>
              <Touchable onPress={() => setSubmitModal(!submitModal)}>
                <NavIcon
                  size={20}
                  name={
                    Platform.OS === "ios"
                      ? deleteModal
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : deleteModal
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                  color={"#999"}
                />
              </Touchable>
            </Item>
            <Item>
              <ToggleText>PHONE</ToggleText>
              {countryPhoneCode && countryPhoneNumber && (
                <ToggleText>
                  {countryPhoneCode}&nbsp;
                  {countryPhoneNumber}&nbsp;
                  {phoneNumber}
                </ToggleText>
              )}
            </Item>
            {profile.isVerifiedPhoneNumber ? (
              <ExplainText>
                Your phone number in&nbsp;
                {countries.find(i => i.code === countryPhoneNumber).name}
                {countries.find(i => i.code === countryPhoneNumber).emoji}&nbsp;
                is already verified.
              </ExplainText>
            ) : (
              <ExplainText>Verify your phone number to login.</ExplainText>
            )}
            <Item>
              <ToggleText>EMAIL</ToggleText>
              <ToggleText>{profile.emailAddress}</ToggleText>
            </Item>
            {profile.isVerifiedPhoneNumber ? (
              <ExplainText>Your email address is already verified.</ExplainText>
            ) : (
              <ExplainText>Verify your email address to login.</ExplainText>
            )}
            <Bold>SETTINGS</Bold>
            <Item>
              <ToggleText>DARK MODE</ToggleText>
              <ToggleIcon onPress={toggleTheme}>
                <NavIcon
                  size={20}
                  name={
                    Platform.OS === "ios"
                      ? theme
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : theme
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                  color={"#999"}
                />
              </ToggleIcon>
            </Item>
            {isDarkMode ? (
              <ExplainText>Set to make light background.</ExplainText>
            ) : (
              <ExplainText>Set to make dark background.</ExplainText>
            )}

            <Item>
              <ToggleText>HIDE TRIPS</ToggleText>
              <ToggleIcon onPress={() => onPressToggleIcon("HIDE_TRIPS")}>
                <NavIcon
                  size={20}
                  name={
                    Platform.OS === "ios"
                      ? isHideTrips
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : isHideTrips
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                  color={"#999"}
                />
              </ToggleIcon>
            </Item>
            <ExplainText>
              If you set your trips hide, only you can see your trips, otherwise
              only number of trips and your trip distance are shown.
            </ExplainText>

            <Item>
              <ToggleText>HIDE COFFEES</ToggleText>
              <ToggleIcon onPress={() => onPressToggleIcon("HIDE_COFFEES")}>
                <NavIcon
                  size={20}
                  name={
                    Platform.OS === "ios"
                      ? isHideCoffees
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : isHideCoffees
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                  color={"#999"}
                />
              </ToggleIcon>
            </Item>
            <ExplainText>
              If you set your coffees hide, only you can see you coffees
              request, otherwise only number of coffees request is shown.
            </ExplainText>

            <Item>
              <ToggleText>HIDE CITIES</ToggleText>
              <ToggleIcon onPress={() => onPressToggleIcon("HIDE_CITIES")}>
                <NavIcon
                  size={20}
                  name={
                    Platform.OS === "ios"
                      ? isHideCities
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : isHideCities
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                  color={"#999"}
                />
              </ToggleIcon>
            </Item>
            <ExplainText>
              If you set your cities hide, only you can see cities where you've
              been before, otherwise only number of cities is shown.
            </ExplainText>

            <Item>
              <ToggleText>HIDE COUNTRIES</ToggleText>
              <ToggleIcon onPress={() => onPressToggleIcon("HIDE_COUNTRIES")}>
                <NavIcon
                  size={20}
                  name={
                    Platform.OS === "ios"
                      ? isHideCountries
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : isHideCities
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                  color={"#999"}
                />
              </ToggleIcon>
            </Item>
            <ExplainText>
              If you set your coutries hide, only you can see countries where
              You've been to before, otherwise only number of countries is
              shown.
            </ExplainText>

            <Item>
              <ToggleText>HIDE CONTINENTS</ToggleText>
              <ToggleIcon onPress={() => onPressToggleIcon("HIDE_CONTINENTS")}>
                <NavIcon
                  size={20}
                  name={
                    Platform.OS === "ios"
                      ? isHideContinents
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : isHideContinents
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                  color={"#999"}
                />
              </ToggleIcon>
            </Item>
            <ExplainText>
              If you set your coutries hide, only you can see countries where
              You've been to before, otherwise only number of countries is
              shown.
            </ExplainText>

            <Item>
              <ToggleText>AUTO LOCATION REPORT</ToggleText>
              <ToggleIcon
                onPress={() => onPressToggleIcon("AUTO_LOCATION_REPORT")}
              >
                <NavIcon
                  size={20}
                  name={
                    Platform.OS === "ios"
                      ? isAutoLocationReport
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : isAutoLocationReport
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                  color={"#999"}
                />
              </ToggleIcon>
            </Item>
            <ExplainText>
              If you set auto location report off, the app cannot find where you
              are. Your lacation will be shown on your profile
            </ExplainText>
            <Bold>ACCOUNT</Bold>
            <Item>
              <ToggleText>LOG OUT</ToggleText>
              <Touchable onPress={() => setDeleteModal(!deleteModal)}>
                <NavIcon
                  size={20}
                  name={
                    Platform.OS === "ios"
                      ? deleteModal
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : deleteModal
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                  color={"#999"}
                />
              </Touchable>
            </Item>

            <Item>
              <ToggleText>DELETE PROFILE</ToggleText>
              <Touchable onPress={() => setDeleteModal(!deleteModal)}>
                <NavIcon
                  size={20}
                  name={
                    Platform.OS === "ios"
                      ? deleteModal
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : deleteModal
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                  color={"#999"}
                />
              </Touchable>
            </Item>
            <ExplainText>
              Once you delete an account, there is no going back. Please be
              certain.
            </ExplainText>
          </ToggleContainer>
        </View>
      )}
    </ScrollView>
  );
};
