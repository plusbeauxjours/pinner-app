import React, { useState, useEffect } from "react";
import { useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import Modal from "react-native-modal";
import Toast from "react-native-root-toast";
import { useTheme } from "../../../../hooks/useTheme";
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
import { useLogOut } from "../../../../context/AuthContext";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Alert } from "react-native";
import CountryPicker, { DARK_THEME } from "react-native-country-picker-modal";
import { useLocation } from "../../../../context/LocationContext";

const View = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-color: ${props => props.theme.bgColor};
`;
const EditModalContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ToggleContainer = styled.View``;
const ToggleText = styled.Text`
  color: ${props => props.theme.color};
`;
const CountryView = styled.View`
  align-items: center;
  flex-direction: row;
`;
const Text = styled.Text`
  color: ${props => props.theme.color};
`;
const Bigtext = styled(Text)`
  font-weight: 300;
  font-size: 30;
`;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 20;
  text-align: center;
  margin-top: 10px;
  color: ${props => props.theme.color};
`;
const CountryContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
const CountryItem = styled.View`
  margin-top: 15px;
  flex-direction: column;
`;
const Item = styled.View`
  margin-top: 15px;
  flex-direction: row;
  justify-content: space-between;
`;
const EmptyView = styled.View`
  justify-content: center;
  align-items: center;
`;
const Void = styled.View`
  height: 40px;
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
  justify-content: center;
  align-items: center;
  padding: 15px;
`;
const SubmitLoaderContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding: 15px;
  height: 35px;
`;

export default ({ navigation }) => {
  const logOut = useLogOut();
  const location = useLocation();
  const isDarkMode = useTheme();
  const { theme, toggleTheme } = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const profileRefetch = navigation.getParam("profileRefetch");
  const profile = navigation.getParam("profile");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [isProfileSubmitted, setIsProfileSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(
    navigation.getParam("username")
  );
  const [newUsername, setNewUsername] = useState<string>(
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
  const [nationalityCode, setNationalityCode] = useState<any>(
    profile.nationality
      ? profile.nationality.countryCode
      : location.currentCountryCode
  );
  const [residenceCode, setResidenceCode] = useState<any>(
    profile.residence
      ? profile.residence.countryCode
      : location.currentCountryCode
  );
  const [isHideTrips, setIsHideTrips] = useState<boolean>(profile.isHideTrips);
  // const [isHideCoffees, setIsHideCoffees] = useState<boolean>(
  //   profile.isHideCoffees
  // );
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

  const phoneNumber = profile.phoneNumber;
  const countryPhoneNumber = profile.countryPhoneNumber;
  const countryPhoneCode = profile.countryPhoneCode;
  const [newPhoneNumber, setNewPhoneNumber] = useState<string>(
    profile.phoneNumber || ""
  );
  const [newCountryPhoneNumber, setNewCountryPhoneNumber] = useState<string>(
    profile.countryPhoneNumber
  );
  const [newCountryPhoneCode, setNewCountryPhoneCode] = useState<any>(
    profile.countryPhoneCode
  );
  const [editPhoneModalOpen, setEditPhoneModalOpen] = useState<boolean>(false);
  const [verifyPhoneModalOpen, setVerifyPhoneModalOpen] = useState<boolean>(
    false
  );
  const [verificationKey, setVerificationKey] = useState<string>("");
  const [editProfileFn, { data }] = useMutation<
    EditProfile,
    EditProfileVariables
  >(EDIT_PROFILE);
  const [submitModal, setSubmitModal] = useState<boolean>(false);
  const options = ["Yes", "No"];
  const destructiveButtonIndex = 0;
  const cancelButtonIndex = 1;
  const onPress = () => {
    setSubmitModal(true);
    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          onSubmit();
          setSubmitModal(false);
        } else {
          setSubmitModal(false);
        }
      }
    );
  };
  const [logoutModal, setLogoutModal] = useState<boolean>(false);
  const onLogout = () => {
    setLogoutModal(true);
    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          logOut();
          setLogoutModal(false);
        } else {
          setLogoutModal(false);
        }
      }
    );
  };
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const onDelete = () => {
    setDeleteModal(true);
    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          deleteProfileFn();
          setDeleteModal(false);
        } else {
          setDeleteModal(false);
        }
      }
    );
  };
  const [deleteProfileFn, { loading: deladeLoading }] = useMutation<
    DeleteProfile
  >(DELETE_PROFILE);
  const [
    startEditPhoneVerificationFn,
    { loading: startEditPhoneVerificationLoading }
  ] = useMutation<
    StartEditPhoneVerification,
    StartEditPhoneVerificationVariables
  >(START_EDIT_PHONE_VERIFICATION, {
    variables: {
      countryPhoneNumber: newCountryPhoneNumber,
      phoneNumber: newPhoneNumber.startsWith("0")
        ? newPhoneNumber.substring(1)
        : newPhoneNumber
    }
  });
  const [
    completeEditPhoneVerificationFn,
    { loading: completeEditPhoneVerificationLoading }
  ] = useMutation<
    CompleteEditPhoneVerification,
    CompleteEditPhoneVerificationVariables
  >(COMPLETE_EDIT_PHONE_VERIFICATION, {
    variables: {
      key: verificationKey,
      phoneNumber: newPhoneNumber,
      countryPhoneNumber,
      countryPhoneCode: newCountryPhoneCode
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
  const toast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  };
  const onSelectNationality = (country: any) => {
    setNationalityCode(country.cca2);
  };
  const onSelectrRsidence = (country: any) => {
    setResidenceCode(country.cca2);
  };
  const onSelectrEditPhone = (country: any) => {
    setNewCountryPhoneNumber(
      countries.find(i => i.code === country.cca2).phone
    );
    setNewCountryPhoneCode(country.cca2);
  };
  const closeEditPhoneModalOpen = () => {
    setEditPhoneModalOpen(false);
  };
  const closeVerifyPhoneModalOpen = () => {
    setVerificationKey("");
    setVerifyPhoneModalOpen(false);
  };
  const onPressToggleIcon = async (payload: string) => {
    if (payload === "HIDE_TRIPS") {
      setIsHideTrips(isHideTrips => !isHideTrips);
      // } else if (payload === "HIDE_COFFEES") {
      //   setIsHideCoffees(isHideCoffees => !isHideCoffees);
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
  const onInputTextChange = (text, state) => {
    const replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>0-9\/.\`:\"\\,\[\]?|{}]/gi;
    const item = text
      .replace(/^\s\s*/, "")
      .replace(/\s\s*$/, "")
      .replace(replaceChar, "")
      .replace(/[^a-z|^A-Z|^0-9]/, "");
    if (state === "newUsername" && item !== "") {
      setNewUsername(item);
    } else if (state === "firstName") {
      setFirstName(item);
    } else if (state === "lastName") {
      setLastName(item);
    } else {
      return null;
    }
  };
  const handlePhoneNumber = async () => {
    const phone = `${newCountryPhoneNumber}${
      newPhoneNumber.startsWith("0")
        ? newPhoneNumber.substring(1)
        : newPhoneNumber
    }`;
    const phoneRegex = /(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/;
    const {
      data: { startEditPhoneVerification }
    } = await startEditPhoneVerificationFn();
    setEditPhoneModalOpen(false);
    if (startEditPhoneVerification.ok) {
      setTimeout(() => {
        setVerifyPhoneModalOpen(true);
      }, 500);
    } else if (newPhoneNumber === "") {
      toast("Phone number can't be empty");
    } else if (newCountryPhoneNumber === "") {
      toast("Please choose a country");
    } else if (!phoneRegex.test(phone)) {
      toast("That phone number is invalid");
    } else if (!startEditPhoneVerification.ok) {
      toast("Could not send you a Key");
    } else {
      toast("Please write a valid phone number");
    }
  };
  const handlePhoneVerification = async () => {
    const {
      data: { completeEditPhoneVerification }
    } = await completeEditPhoneVerificationFn();
    setVerifyPhoneModalOpen(false);
    if (!completeEditPhoneVerification.ok) {
      toast("Your phone number is verified");
    } else {
      toast("Could not be Verified your phone number");
    }
  };
  const onSubmit = async () => {
    try {
      if (!isProfileSubmitted) {
        setIsProfileSubmitted(true);
        if (newUsername || newUsername !== "") {
          {
            await editProfileFn({
              variables: {
                username: newUsername,
                bio,
                gender,
                firstName,
                lastName,
                nationalityCode,
                residenceCode
              }
            });
          }
        }
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Could not be Verified you");
    } finally {
      setIsProfileSubmitted(false);
    }
  };
  const genders = ["Male", "Female", "Other", "Cancel"];
  const genderCancelButtonIndex = 3;
  const onOpenGenderActionSheet = () => {
    showActionSheetWithOptions(
      {
        options: genders,
        cancelButtonIndex: genderCancelButtonIndex,
        showSeparators: true
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          setGender("MALE");
        } else if (buttonIndex === 1) {
          setGender("FEMALE");
        } else if (buttonIndex === 2) {
          setGender("OTHER");
        } else {
          null;
        }
      }
    );
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
        <>
          <Modal
            isVisible={editPhoneModalOpen}
            backdropColor={theme ? "black" : "white"}
            onBackdropPress={() => closeEditPhoneModalOpen()}
            onBackButtonPress={() =>
              Platform.OS !== "ios" && closeEditPhoneModalOpen()
            }
            propagateSwipe={true}
            scrollHorizontal={true}
            backdropOpacity={0.9}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <EditModalContainer>
              <CountryPicker
                theme={theme && DARK_THEME}
                countryCode={newCountryPhoneCode}
                withFilter={true}
                withFlag={true}
                withAlphaFilter={true}
                withEmoji={true}
                onSelect={onSelectrEditPhone}
              />
              {/* <Text>{newCountryPhoneCode}</Text> */}
              <Bigtext>{newCountryPhoneNumber}</Bigtext>
              <TextInput
                style={{
                  width: 200,
                  backgroundColor: "transparent",
                  borderBottomWidth: 1,
                  borderBottomColor: "#999",
                  color: theme ? "white" : "black",
                  marginLeft: 5,
                  fontSize: 32,
                  fontWeight: "300"
                }}
                keyboardType="phone-pad"
                returnKeyType="send"
                onChangeText={number => setNewPhoneNumber(number)}
              />
            </EditModalContainer>
            <ButtonContainer>
              <Text>
                When you tap Continue, Pinner will send a text with verification
                code. Message and data rates may apply. The verified phone
                number can be used to login.
              </Text>
              <Void />
              <Touchable
                disabled={startEditPhoneVerificationLoading}
                onPress={handlePhoneNumber}
              >
                {startEditPhoneVerificationLoading ? (
                  <SubmitLoaderContainer>
                    <Loader />
                  </SubmitLoaderContainer>
                ) : (
                  <Bigtext>Send SMS</Bigtext>
                )}
              </Touchable>
            </ButtonContainer>
          </Modal>
          <Modal
            isVisible={verifyPhoneModalOpen}
            backdropColor={theme ? "black" : "white"}
            onBackdropPress={() => closeVerifyPhoneModalOpen()}
            onBackButtonPress={() =>
              Platform.OS !== "ios" && closeVerifyPhoneModalOpen()
            }
            propagateSwipe={true}
            scrollHorizontal={true}
            backdropOpacity={0.9}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <TextInput
              style={{
                width: 200,
                backgroundColor: "transparent",
                borderBottomWidth: 1,
                borderBottomColor: "#999",
                color: theme ? "white" : "black",
                marginLeft: 5,
                fontSize: 32,
                fontWeight: "300",
                textAlign: "center"
              }}
              keyboardType="phone-pad"
              returnKeyType="send"
              onChangeText={number => setVerificationKey(number)}
            />
            <ButtonContainer>
              <Touchable
                disabled={completeEditPhoneVerificationLoading}
                onPress={handlePhoneVerification}
              >
                <EmptyView>
                  {completeEditPhoneVerificationLoading ? (
                    <Loader />
                  ) : (
                    <Bigtext>Verify Key</Bigtext>
                  )}
                </EmptyView>
              </Touchable>
            </ButtonContainer>
          </Modal>
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
                  value={newUsername}
                  returnKeyType="done"
                  onChangeText={text => onInputTextChange(text, "newUsername")}
                  autoCorrect={false}
                />
              </Item>
              <ExplainText>
                Default username is automatically generated. Set your own
                username here. Your username cannot be any combination of
                numbers or symbols.
              </ExplainText>
              <CountryContainer>
                <CountryItem>
                  <ToggleText>NATIONALITY</ToggleText>
                  <ExplainText>Your Nationality to match</ExplainText>
                </CountryItem>
                <CountryView>
                  <CountryPicker
                    theme={theme && DARK_THEME}
                    countryCode={nationalityCode}
                    withFilter={true}
                    withFlag={true}
                    withAlphaFilter={true}
                    withEmoji={true}
                    onSelect={onSelectNationality}
                    withCountryNameButton={true}
                  />
                  <Text>{nationalityCode}</Text>
                </CountryView>
              </CountryContainer>
              <CountryContainer>
                <CountryItem>
                  <ToggleText>RESIDENCE</ToggleText>
                  <ExplainText>Your Residence to match</ExplainText>
                </CountryItem>
                <CountryView>
                  <CountryPicker
                    theme={theme && DARK_THEME}
                    countryCode={residenceCode}
                    withFilter={true}
                    withFlag={true}
                    withAlphaFilter={true}
                    withEmoji={true}
                    onSelect={onSelectrRsidence}
                    withCountryNameButton={true}
                  />
                  <Text>{residenceCode}</Text>
                </CountryView>
              </CountryContainer>

              <Item>
                <ToggleText>GENDER</ToggleText>
                <Touchable onPress={() => onOpenGenderActionSheet()}>
                  <EmptyView>
                    <Text>{gender}</Text>
                  </EmptyView>
                </Touchable>
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
                  onChangeText={text => onInputTextChange(text, "firstName")}
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
                  onChangeText={text => onInputTextChange(text, "lastName")}
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
                  placeholderTextColor="#999"
                  value={bio}
                  placeholder={"BIO"}
                  returnKeyType="done"
                  onChangeText={text => setBio(text)}
                  autoCorrect={false}
                />
              </Item>
              <ExplainText>
                Your BIO is displayed on your profile. You can write about who
                you are and what you're looking for on Pinner. You can also add
                links to your website and profiles on other websites, like
                Instagram or your blog for example.
              </ExplainText>
              <Item>
                <ToggleText>SUBMIT</ToggleText>
                <Touchable onPress={onPress}>
                  <NavIcon
                    size={20}
                    name={
                      Platform.OS === "ios"
                        ? submitModal
                          ? "ios-radio-button-on"
                          : "ios-radio-button-off"
                        : submitModal
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
                  <Touchable onPress={() => setEditPhoneModalOpen(true)}>
                    <ToggleText>
                      {countries.find(i => i.code === countryPhoneCode).emoji}
                      &nbsp;
                      {countryPhoneNumber}&nbsp;
                      {phoneNumber}
                    </ToggleText>
                  </Touchable>
                )}
              </Item>
              {profile.isVerifiedPhoneNumber ? (
                <ExplainText>
                  Your phone number is already verified in&nbsp;
                  {countries.find(i => i.code === countryPhoneCode).name}.
                </ExplainText>
              ) : (
                <ExplainText>Verify your phone number to login.</ExplainText>
              )}
              <Item>
                <ToggleText>EMAIL</ToggleText>
                <ToggleText>{profile.emailAddress}</ToggleText>
              </Item>
              {profile.isVerifiedPhoneNumber ? (
                <ExplainText>
                  Your email address is already verified.
                </ExplainText>
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
                If you set your trips hide, only you can see your trips,
                otherwise only number of trips and your trip distance are shown.
              </ExplainText>

              {/* <Item>
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
            </ExplainText> */}

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
                If you set your cities hide, only you can see cities where
                you've been before, otherwise only number of cities is shown.
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
                you've been before, otherwise only number of countries is shown.
              </ExplainText>

              <Item>
                <ToggleText>HIDE CONTINENTS</ToggleText>
                <ToggleIcon
                  onPress={() => onPressToggleIcon("HIDE_CONTINENTS")}
                >
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
                you've been before, otherwise only number of countries is shown.
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
                If you set auto location report off, the app cannot find where
                you are. Your lacation will be shown on your profile
              </ExplainText>
              <Bold>ACCOUNT</Bold>
              <Item>
                <ToggleText>LOG OUT</ToggleText>
                <Touchable onPress={() => onLogout()}>
                  <NavIcon
                    size={20}
                    name={
                      Platform.OS === "ios"
                        ? logoutModal
                          ? "ios-radio-button-on"
                          : "ios-radio-button-off"
                        : logoutModal
                        ? "md-radio-button-on"
                        : "md-radio-button-off"
                    }
                    color={"#999"}
                  />
                </Touchable>
              </Item>

              <Item>
                <ToggleText>DELETE PROFILE</ToggleText>
                <Touchable onPress={() => onDelete()}>
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
        </>
      )}
    </ScrollView>
  );
};
