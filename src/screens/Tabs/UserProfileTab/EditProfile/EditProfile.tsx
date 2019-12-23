import React, { useState, useEffect } from "react";
import { useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import Modal from "react-native-modal";
import Toast from "react-native-root-toast";
import { useTheme } from "../../../../hooks/useTheme";
import {
  Me,
  EditProfile,
  EditProfileVariables,
  DeleteProfile,
  StartEditPhoneVerification,
  StartEditPhoneVerificationVariables,
  CompleteEditPhoneVerification,
  CompleteEditPhoneVerificationVariables,
  ToggleSettings,
  ToggleSettingsVariables,
  UserProfile,
  UserProfileVariables,
  StartEditEmailVerification,
  StartEditEmailVerificationVariables
} from "../../../../types/api";
import {
  EDIT_PROFILE,
  DELETE_PROFILE,
  START_EDIT_PHONE_VERIFICATION,
  COMPLETE_EDIT_PHONE_VERIFICATION,
  START_EDIT_EMAIL_VERIFICATION,
  TOGGLE_SETTINGS
} from "./EditProfileQueries";
import { GET_USER } from "../UserProfile/UserProfileQueries";
import { Platform, TextInput, ActivityIndicator } from "react-native";
import constants from "../../../../../constants";
import { countries } from "../../../../../countryData";
import { useLogOut, useLogIn } from "../../../../context/AuthContext";
import { useActionSheet } from "@expo/react-native-action-sheet";
import CountryPicker, { DARK_THEME } from "react-native-country-picker-modal";
import { useLocation } from "../../../../context/LocationContext";
import { Ionicons } from "@expo/vector-icons";
import { ME } from "../../../../sharedQueries";
import { useMe } from "../../../../context/MeContext";

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
  height: 20px;
  color: ${props => props.theme.color};
  font-weight: ${props => (props.isChanged ? "300" : "100")};
`;
const SubmitText = styled.Text<IProps>`
  height: 20px;
  color: ${props => (props.isChanged ? "#d60000" : props.theme.color)};
  font-weight: ${props => (props.isChanged ? "300" : "100")};
`;
const CountryView = styled.View`
  margin-top: 4px;
  align-items: flex-end;
  flex-direction: column;
`;
const Text = styled.Text`
  color: ${props => props.theme.color};
`;
const Bigtext = styled(Text)`
  font-weight: 300;
  font-size: 30px;
`;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 20px;
  text-align: left;
  margin-top: 10px;
  color: ${props => props.theme.color};
`;
const ConfirmBold = styled(Bold)`
  text-align: center;
  margin-bottom: 10px;
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
  align-items: center;
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
const ExplainText = styled.Text<IProps>`
  font-size: 11px;
  color: ${props => (props.isChanged ? "#d60000" : props.theme.color)};
  font-weight: ${props => (props.isChanged ? "300" : "100")};
`;
const FlagExplainText = styled(ExplainText)`
  top: -5px;
`;
const ScrollView = styled.ScrollView`
  background-color: ${props => props.theme.bgColor};
`;
const ButtonContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding: 15px;
`;
const TextContainer = styled.View`
  width: ${constants.width - 30};
  justify-content: center;
  align-items: center;
`;
const SubmitButtonContainer = styled.View`
  width: ${constants.width - 80};
  height: 40px;
  justify-content: center;
  align-items: center;
  border: 0.5px solid #999;
  border-radius: 5px;
`;
const SubmitButtonText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.color};
`;
const SubmitButton = styled.TouchableOpacity`
  justify-content: center;
  padding: 0 5px 5px 5px;
`;
interface IProps {
  isChanged: boolean;
}
export default ({ navigation }) => {
  const logIn = useLogIn();
  const { me } = useMe();
  const logOut = useLogOut();
  const location = useLocation();
  const isDarkMode = useTheme();
  const { theme, toggleTheme } = useTheme();
  const { showActionSheetWithOptions } = useActionSheet();
  const profile = navigation.getParam("profile");
  const [newUsername, setNewUsername] = useState<string>(me.user.username);
  const [bio, setBio] = useState<string>(profile.bio);
  const [gender, setGender] = useState<string>(profile.gender);
  const [firstName, setFirstName] = useState<string>(me.user.firstName);
  const [lastName, setLastName] = useState<string>(me.user.lastName);
  const [nationalityCode, setNationalityCode] = useState<any>(
    me.user.profile.nationality
      ? me.user.profile.nationality.countryCode
      : location.currentCountryCode
  );
  const [residenceCode, setResidenceCode] = useState<any>(
    me.user.profile.residence
      ? me.user.profile.residence.countryCode
      : location.currentCountryCode
  );
  const [isHidePhotos, setIsHidePhotos] = useState<boolean>(
    profile.isHidePhotos
  );
  const [isHideTrips, setIsHideTrips] = useState<boolean>(profile.isHideTrips);
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
      ? profile.countryPhoneNumber
      : countries.find(i => i.code === location.currentCountryCode).phone
  );
  const [newCountryPhoneCode, setNewCountryPhoneCode] = useState<any>(
    profile.countryPhoneCode
      ? profile.countryPhoneCode
      : location.currentCountryCode
  );
  const [editPhoneModalOpen, setEditPhoneModalOpen] = useState<boolean>(false);
  const [isEditPhoneMode, setIsEditPhoneMode] = useState<boolean>(true);
  const [verificationKey, setVerificationKey] = useState<string>("");
  const emailAddress = profile.emailAddress;
  const [newEmailAddress, setNewEmailAddress] = useState<string>("");
  const [editEmailModalOpen, setEditEmailModalOpen] = useState<boolean>(false);
  const [isEditEmailMode, setIsEditEmailMode] = useState<boolean>(true);
  const [submitModal, setSubmitModal] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [logoutModal, setLogoutModal] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [deleteAccountUsername, setDeleteAccountUsername] = useState<string>(
    ""
  );
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const [editProfileFn, { loading: editProfileLoading }] = useMutation<
    EditProfile,
    EditProfileVariables
  >(EDIT_PROFILE, {
    variables: {
      username: newUsername,
      bio,
      gender,
      firstName,
      lastName,
      nationalityCode,
      residenceCode
    },
    update(cache, { data: { editProfile } }) {
      try {
        const data = cache.readQuery<Me>({
          query: ME
        });
        if (data) {
          data.me.user = editProfile.user;
          cache.writeQuery({
            query: ME,
            data
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const data = cache.readQuery<UserProfile, UserProfileVariables>({
          query: GET_USER,
          variables: { uuid: profile.uuid }
        });
        if (data) {
          data.userProfile.user = editProfile.user;
          cache.writeQuery({
            query: GET_USER,
            variables: { uuid: profile.uuid },
            data
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });

  const onPress = () => {
    setSubmitModal(true);
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        title: "Are you sure to edit this profile?"
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

  const onLogout = () => {
    setLogoutModal(true);
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        title: "Are you sure to logout?"
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
  const onDelete = () => {
    setDeleteModal(true);
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        title: "Are you sure to delete this account?"
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          deleteProfileFn();
          logOut();
          setDeleteModal(false);
          navigation.navigate("Home");
        } else {
          setDeleteModal(false);
        }
      }
    );
  };
  const [deleteProfileFn, { loading: deleteeLoading }] = useMutation<
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
      phoneNumber: newPhoneNumber.startsWith("0")
        ? newPhoneNumber.substring(1)
        : newPhoneNumber,
      countryPhoneNumber: newCountryPhoneNumber,
      countryPhoneCode: newCountryPhoneCode
    },
    update(cache, { data: { completeEditPhoneVerification } }) {
      try {
        const data = cache.readQuery<UserProfile, UserProfileVariables>({
          query: GET_USER,
          variables: { uuid: profile.uuid }
        });
        if (data) {
          data.userProfile.user.profile.phoneNumber =
            completeEditPhoneVerification.phoneNumber;
          data.userProfile.user.profile.countryPhoneNumber =
            completeEditPhoneVerification.countryPhoneNumber;
          data.userProfile.user.profile.countryPhoneCode =
            completeEditPhoneVerification.countryPhoneCode;
          data.userProfile.user.profile.isVerifiedPhoneNumber =
            completeEditPhoneVerification.isVerifiedPhoneNumber;
          cache.writeQuery({
            query: GET_USER,
            variables: { uuid: profile.uuid },
            data
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
  const [
    startEditEmailVerificationFn,
    { loading: startEditEmailVerificationLoading }
  ] = useMutation<
    StartEditEmailVerification,
    StartEditEmailVerificationVariables
  >(START_EDIT_EMAIL_VERIFICATION, {
    variables: {
      emailAddress: newEmailAddress
    }
  });

  const [toggleSettingsFn, { loading: toggleSettingsLoading }] = useMutation<
    ToggleSettings,
    ToggleSettingsVariables
  >(TOGGLE_SETTINGS, {
    update(cache, { data: { toggleSettings } }) {
      try {
        const data = cache.readQuery<UserProfile, UserProfileVariables>({
          query: GET_USER,
          variables: { uuid: profile.uuid }
        });
        if (data) {
          data.userProfile.user.profile.isDarkMode =
            toggleSettings.user.profile.isDarkMode;
          data.userProfile.user.profile.isHidePhotos =
            toggleSettings.user.profile.isHidePhotos;
          data.userProfile.user.profile.isHideTrips =
            toggleSettings.user.profile.isHideTrips;
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
            variables: { uuid: profile.uuid },
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
      duration: 1000,
      position: Toast.positions.CENTER,
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
    setVerificationKey("");
    setEditPhoneModalOpen(false);
    setIsEditPhoneMode(true);
  };
  const closeEditEmailModalOpen = () => {
    if (!startEditEmailVerificationLoading) {
      setEditEmailModalOpen(false);
      setIsEditEmailMode(true);
    }
  };
  const closeDeleteModalOpen = () => {
    setDeleteAccountUsername("");
    setDeleteModalOpen(false);
  };
  const onPressToggleIcon = async (payload: string) => {
    try {
      if (payload === "HIDE_PHOTOS") {
        setIsHidePhotos(isHidePhotos => !isHidePhotos);
      } else if (payload === "HIDE_TRIPS") {
        setIsHideTrips(isHideTrips => !isHideTrips);
      } else if (payload === "HIDE_CITIES") {
        setIsHideCities(isHideCities => !isHideCities);
      } else if (payload === "HIDE_COUNTRIES") {
        setIsHideCountries(isHideCountries => !isHideCountries);
      } else if (payload === "HIDE_CONTINENTS") {
        setIsHideContinents(isHideContinents => !isHideContinents);
      } else if (payload === "AUTO_LOCATION_REPORT") {
        setIsAutoLocationReport(isAutoLocationReport => !isAutoLocationReport);
      }
      await toggleSettingsFn({ variables: { payload } });
    } catch (e) {
      console.log(e);
    }
  };
  const onInputTextChange = (text, state) => {
    const replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>0-9\/.\`:\"\\,\[\]?|{}]/gi;
    const item = text
      .replace(/^\s\s*/, "")
      .replace(/\s\s*$/, "")
      .replace(replaceChar, "")
      .replace(/[^a-z|^A-Z|^0-9]/, "");
    if (state === "newUsername") {
      setNewUsername(item);
    } else if (state === "firstName") {
      setFirstName(item);
    } else if (state === "lastName") {
      setLastName(item);
    } else if (state === "deleteAccountUsername") {
      setDeleteAccountUsername(item);
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
    if (startEditPhoneVerification.ok) {
      setIsEditPhoneMode(false);
    } else if (newPhoneNumber === "") {
      closeEditPhoneModalOpen();
      toast("Phone number can't be empty");
    } else if (newCountryPhoneNumber === "") {
      closeEditPhoneModalOpen();
      toast("Please choose a country");
    } else if (!phoneRegex.test(phone)) {
      closeEditPhoneModalOpen();
      toast("This phone number is invalid");
    } else if (!startEditPhoneVerification.ok) {
      closeEditPhoneModalOpen();
      toast("Could not send you a key");
    } else {
      closeEditPhoneModalOpen();
      toast("Please write a valid phone number");
    }
  };
  const handlePhoneVerification = async () => {
    const {
      data: { completeEditPhoneVerification }
    } = await completeEditPhoneVerificationFn();
    setVerificationKey("");
    setEditPhoneModalOpen(false);
    setIsEditPhoneMode(true);
    if (completeEditPhoneVerification.ok) {
      toast("Your phone number is verified");
    } else {
      toast("Could not be Verified your phone number");
    }
  };
  const onSubmit = async () => {
    if (!newUsername || newUsername === "") {
      toast("Username could not be empty");
    } else {
      const {
        data: { editProfile }
      } = await editProfileFn();
      if (editProfile.ok) {
        logIn(editProfile);
        setIsChanged(false);
        toast("Profile edited");
      } else {
        toast("Username is already taken");
      }
    }
  };
  const handleEmailAddress = async () => {
    if (newEmailAddress !== "") {
      const isValid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        newEmailAddress
      );
      if (isValid) {
        const {
          data: { startEditEmailVerification }
        } = await startEditEmailVerificationFn();
        if (startEditEmailVerification.ok) {
          setIsEditEmailMode(false);
        } else {
          setEditEmailModalOpen(false);
          toast("Requested email address is already verified");
        }
      } else {
        setEditEmailModalOpen(false);
        toast("Please write a valid email");
      }
    } else {
      setEditEmailModalOpen(false);
      toast("Please write a email address");
    }
  };
  const onOpenGenderActionSheet = () => {
    showActionSheetWithOptions(
      {
        options: ["Male", "Female", "Other", "Cancel"],
        cancelButtonIndex: 3,
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
  useEffect(() => {
    if (deleteAccountUsername === me.user.username) {
      onDelete();
    }
  }, [deleteAccountUsername]);
  useEffect(() => {
    if (
      newUsername !== me.user.username ||
      nationalityCode !==
        ((me.user.profile.nationality &&
          me.user.profile.nationality.countryCode) ||
          nationalityCode !== location.currentCountryCode) ||
      residenceCode !==
        ((me.user.profile.residence && me.user.profile.residence.countryCode) ||
          residenceCode !== location.currentCountryCode) ||
      gender !== me.user.profile.gender ||
      firstName !== me.user.firstName ||
      lastName !== me.user.lastName ||
      bio !== me.user.profile.bio
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  });
  return (
    <>
      <Modal
        style={{ justifyContent: "center", alignItems: "center" }}
        isVisible={editPhoneModalOpen}
        backdropColor={theme ? "#161616" : "#EFEFEF"}
        onBackdropPress={() => closeEditPhoneModalOpen()}
        onBackButtonPress={() =>
          Platform.OS !== "ios" && closeEditPhoneModalOpen()
        }
        propagateSwipe={true}
        scrollHorizontal={true}
        backdropOpacity={0.9}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={200}
        animationOutTiming={200}
        backdropTransitionInTiming={200}
        backdropTransitionOutTiming={200}
      >
        {isEditPhoneMode ? (
          <>
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
                  width: 220,
                  backgroundColor: "transparent",
                  borderBottomWidth: 1,
                  borderBottomColor: "#999",
                  color: theme ? "white" : "black",
                  marginLeft: 5,
                  fontSize: 32,
                  fontWeight: "300"
                }}
                keyboardType="phone-pad"
                returnKeyType="done"
                onChangeText={number => setNewPhoneNumber(number)}
              />
            </EditModalContainer>
            <ButtonContainer>
              <Text>
                When you tap "SEND SMS", Pinner will send a text with
                verification code. Message and data rates may apply. The
                verified phone number can be used to login.
              </Text>
              <Void />
              <SubmitButton
                disabled={startEditPhoneVerificationLoading}
                onPress={handlePhoneNumber}
              >
                <SubmitButtonContainer>
                  {startEditPhoneVerificationLoading ? (
                    <ActivityIndicator color={"#999"} />
                  ) : (
                    <SubmitButtonText>SEND SMS</SubmitButtonText>
                  )}
                </SubmitButtonContainer>
              </SubmitButton>
            </ButtonContainer>
          </>
        ) : (
          <>
            <TextInput
              style={{
                width: 220,
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
              returnKeyType="done"
              onChangeText={number => setVerificationKey(number)}
            />
            <ButtonContainer>
              <Void />
              <SubmitButton
                disabled={completeEditPhoneVerificationLoading}
                onPress={handlePhoneVerification}
              >
                <SubmitButtonContainer>
                  {completeEditPhoneVerificationLoading ? (
                    <ActivityIndicator color={"#999"} />
                  ) : (
                    <SubmitButtonText>VERIFY KEY</SubmitButtonText>
                  )}
                </SubmitButtonContainer>
              </SubmitButton>
            </ButtonContainer>
          </>
        )}
      </Modal>
      <Modal
        style={{ justifyContent: "center", alignItems: "center" }}
        isVisible={deleteModalOpen}
        backdropColor={theme ? "#161616" : "#EFEFEF"}
        onBackdropPress={() => closeDeleteModalOpen()}
        onBackButtonPress={() =>
          Platform.OS !== "ios" && closeDeleteModalOpen()
        }
        propagateSwipe={true}
        scrollHorizontal={true}
        backdropOpacity={0.9}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={200}
        animationOutTiming={200}
        backdropTransitionInTiming={200}
        backdropTransitionOutTiming={200}
      >
        <TextInput
          style={{
            width: constants.width - 30,
            backgroundColor: "transparent",
            borderBottomWidth: 1,
            borderBottomColor: "#999",
            color: theme ? "white" : "black",
            marginLeft: 5,
            fontSize: 32,
            fontWeight: "300",
            textAlign: "center"
          }}
          value={deleteAccountUsername}
          placeholderTextColor="#999"
          placeholder={newUsername}
          returnKeyType="done"
          onChangeText={text =>
            onInputTextChange(text, "deleteAccountUsername")
          }
          autoCorrect={false}
          autoCapitalize={"none"}
        />
        <TextContainer>
          <Void />
          <ConfirmBold>Are you absolutely sure?</ConfirmBold>
          <Text>
            This action cannot be undone. This will permanently delete the{" "}
            {newUsername} account, comments, trip history, and remove all
            photos. Please type in the name of your username to confirm.
          </Text>
        </TextContainer>
      </Modal>
      <Modal
        style={{ justifyContent: "center", alignItems: "center" }}
        isVisible={editEmailModalOpen}
        backdropColor={theme ? "#161616" : "#EFEFEF"}
        onBackdropPress={() => closeEditEmailModalOpen()}
        onBackButtonPress={() =>
          Platform.OS !== "ios" && closeEditEmailModalOpen()
        }
        propagateSwipe={true}
        scrollHorizontal={true}
        backdropOpacity={0.9}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={200}
        animationOutTiming={200}
        backdropTransitionInTiming={200}
        backdropTransitionOutTiming={200}
      >
        {isEditEmailMode ? (
          <>
            <EditModalContainer>
              <TextInput
                style={{
                  width: constants.width - 80,
                  backgroundColor: "transparent",
                  borderBottomWidth: 1,
                  borderBottomColor: "#999",
                  color: theme ? "white" : "black",
                  fontSize: 32,
                  fontWeight: "300"
                }}
                keyboardType="email-address"
                returnKeyType="done"
                onChangeText={adress => setNewEmailAddress(adress)}
              />
            </EditModalContainer>
            <ButtonContainer>
              <Text>
                When you tap "SEND EMAIL", Pinner will email you a link that
                will instantly log you in.
              </Text>
              <Void />
              <SubmitButton
                disabled={startEditEmailVerificationLoading}
                onPress={handleEmailAddress}
              >
                <SubmitButtonContainer>
                  {startEditEmailVerificationLoading ? (
                    <ActivityIndicator color={"#999"} />
                  ) : (
                    <SubmitButtonText>SEND EMAIL</SubmitButtonText>
                  )}
                </SubmitButtonContainer>
              </SubmitButton>
            </ButtonContainer>
          </>
        ) : (
          <>
            <Text>{newEmailAddress}, an email has been sent</Text>
            <Text>
              Please check your email in a moment to verify email address.
            </Text>
            <Text>Didn't receive a link?</Text>
            {/* <Underline onClick={toggleVerifyEmailAddressModal}>
                  Use a different email
                </Underline> */}
          </>
        )}
      </Modal>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <ToggleContainer>
            <Bold>EDIT PROFILE</Bold>
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
              Default username is automatically generated. Set your own username
              here. Your username cannot be any combination of numbers or
              symbols.
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
                />
                <FlagExplainText>
                  {countries.find(i => i.code === nationalityCode).name}
                </FlagExplainText>
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
                />
                <FlagExplainText>
                  {countries.find(i => i.code === residenceCode).name}
                </FlagExplainText>
              </CountryView>
            </CountryContainer>
            <Item>
              <ToggleText>GENDER</ToggleText>
              {gender ? (
                <Touchable onPress={() => onOpenGenderActionSheet()}>
                  <EmptyView>
                    {(() => {
                      switch (gender) {
                        case "MALE":
                          return <Text>Male</Text>;
                        case "FEMALE":
                          return <Text>Female</Text>;
                        case "OTHER":
                          return <Text>Other</Text>;
                        default:
                          return null;
                      }
                    })()}
                  </EmptyView>
                </Touchable>
              ) : (
                <ToggleIcon onPress={() => onOpenGenderActionSheet()}>
                  <Ionicons
                    size={18}
                    name={
                      Platform.OS === "ios"
                        ? "ios-radio-button-off"
                        : "md-radio-button-off"
                    }
                    color={"#999"}
                  />
                </ToggleIcon>
              )}
            </Item>
            <ExplainText>Your gender to match</ExplainText>
            <Item>
              <ToggleText>FIRSTNAME</ToggleText>
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
            <ExplainText>Your firstname</ExplainText>
            <Item>
              <ToggleText>LASTNAME</ToggleText>
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
            <ExplainText>Your lastname</ExplainText>
            <Item>
              <TextInput
                style={{
                  width: constants.width - 30,
                  backgroundColor: "transparent",
                  borderBottomWidth: 1,
                  borderBottomColor: "#999",
                  color: "#999",
                  marginBottom: 10
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
              Your BIO is displayed on your profile. You can write about who you
              are and what you're looking for on Pinner. You can also add links
              to your website and profiles on other websites, like Instagram or
              your blog for example.
            </ExplainText>
            <Item>
              <SubmitText isChanged={isChanged}>SUBMIT</SubmitText>
              <Touchable disabled={editProfileLoading} onPress={onPress}>
                {editProfileLoading ? (
                  <ActivityIndicator color={isChanged ? "#d60000" : "#999"} />
                ) : (
                  <Ionicons
                    size={18}
                    name={
                      Platform.OS === "ios"
                        ? submitModal
                          ? "ios-radio-button-on"
                          : "ios-radio-button-off"
                        : submitModal
                        ? "md-radio-button-on"
                        : "md-radio-button-off"
                    }
                    color={isChanged ? "#d60000" : "#999"}
                  />
                )}
              </Touchable>
            </Item>
            <ExplainText isChanged={isChanged}>
              {isChanged && "Your "}
              {newUsername !== me.user.username && "USERNAME "}
              {nationalityCode !==
                ((me.user.profile.nationality &&
                  me.user.profile.nationality.countryCode) ||
                  nationalityCode !== location.currentCountryCode) &&
                "NATIONALITY "}
              {residenceCode !==
                ((me.user.profile.residence &&
                  me.user.profile.residence.countryCode) ||
                  residenceCode !== location.currentCountryCode) &&
                "RESIDENCE "}
              {gender !== me.user.profile.gender && "GENDER "}
              {firstName !== me.user.firstName && "FIRSTNAME "}
              {lastName !== me.user.lastName && "LASTNAME "}
              {bio !== me.user.profile.bio && "BIO "}
              {isChanged && "is changed. Please press submit button to save."}
            </ExplainText>
            <Item>
              <ToggleText>PHONE</ToggleText>
              {countryPhoneCode && countryPhoneNumber ? (
                <Touchable onPress={() => setEditPhoneModalOpen(true)}>
                  <ToggleText>
                    {countries.find(i => i.code === countryPhoneCode).emoji}
                    &nbsp;
                    {countryPhoneNumber}&nbsp;
                    {phoneNumber}
                  </ToggleText>
                </Touchable>
              ) : (
                <ToggleIcon onPress={() => setEditPhoneModalOpen(true)}>
                  <Ionicons
                    size={18}
                    name={
                      Platform.OS === "ios"
                        ? "ios-radio-button-off"
                        : "md-radio-button-off"
                    }
                    color={"#999"}
                  />
                </ToggleIcon>
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
              {emailAddress ? (
                <Touchable onPress={() => setEditEmailModalOpen(true)}>
                  <ToggleText>{emailAddress}</ToggleText>
                </Touchable>
              ) : (
                <ToggleIcon onPress={() => setEditEmailModalOpen(true)}>
                  <Ionicons
                    size={18}
                    name={
                      Platform.OS === "ios"
                        ? "ios-radio-button-off"
                        : "md-radio-button-off"
                    }
                    color={"#999"}
                  />
                </ToggleIcon>
              )}
            </Item>
            {profile.isVerifiedEmailAddress ? (
              <ExplainText>Your email address is already verified.</ExplainText>
            ) : (
              <ExplainText>Verify your email address to login.</ExplainText>
            )}
            <Void />
            <Bold>SETTINGS</Bold>
            <Item>
              <ToggleText>DARK MODE</ToggleText>
              <ToggleIcon
                disabled={toggleSettingsLoading}
                onPress={toggleTheme}
              >
                <Ionicons
                  size={18}
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
              <ToggleText>HIDE PHOTOS</ToggleText>
              <ToggleIcon
                disabled={toggleSettingsLoading}
                onPress={() => onPressToggleIcon("HIDE_PHOTOS")}
              >
                <Ionicons
                  size={18}
                  name={
                    Platform.OS === "ios"
                      ? isHidePhotos
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : isHidePhotos
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                  color={"#999"}
                />
              </ToggleIcon>
            </Item>
            <ExplainText>
              If you set your photos hide, only you can see your photos,
              otherwise only number of photos is shown.
            </ExplainText>

            <Item>
              <ToggleText>HIDE TRIPS</ToggleText>
              <ToggleIcon
                disabled={toggleSettingsLoading}
                onPress={() => onPressToggleIcon("HIDE_TRIPS")}
              >
                <Ionicons
                  size={18}
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
              <ToggleText>HIDE CITIES</ToggleText>
              <ToggleIcon
                disabled={toggleSettingsLoading}
                onPress={() => onPressToggleIcon("HIDE_CITIES")}
              >
                <Ionicons
                  size={18}
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
                <Ionicons
                  size={18}
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
                disabled={toggleSettingsLoading}
                onPress={() => onPressToggleIcon("HIDE_CONTINENTS")}
              >
                <Ionicons
                  size={18}
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
                disabled={toggleSettingsLoading}
                onPress={() => onPressToggleIcon("AUTO_LOCATION_REPORT")}
              >
                <Ionicons
                  size={18}
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
            <Void />
            <Bold>ACCOUNT</Bold>
            <Item>
              <ToggleText>LOG OUT</ToggleText>
              <Touchable onPress={() => onLogout()}>
                <Ionicons
                  size={18}
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
              <Touchable
                disabled={deleteeLoading}
                onPress={() => setDeleteModalOpen(true)}
              >
                {deleteeLoading ? (
                  <ActivityIndicator color={"white"} />
                ) : (
                  <Ionicons
                    size={18}
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
                )}
              </Touchable>
            </Item>
            <ExplainText>
              Once you delete an account, there is no going back. Please be
              certain.
            </ExplainText>
          </ToggleContainer>
        </View>
      </ScrollView>
    </>
  );
};
