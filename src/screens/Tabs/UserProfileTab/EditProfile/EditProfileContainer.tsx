import React, { useState, useEffect } from "react";

import { useMutation } from "react-apollo-hooks";
import Toast from "react-native-root-toast";
import { useActionSheet } from "@expo/react-native-action-sheet";

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
  StartEditEmailVerificationVariables,
} from "../../../../types/api";
import {
  EDIT_PROFILE,
  DELETE_PROFILE,
  START_EDIT_PHONE_VERIFICATION,
  COMPLETE_EDIT_PHONE_VERIFICATION,
  START_EDIT_EMAIL_VERIFICATION,
  TOGGLE_SETTINGS,
} from "./EditProfileQueries";
import { GET_USER } from "../UserProfile/UserProfileQueries";
import constants from "../../../../../constants";
import { countries } from "../../../../../countryData";
import { useLogOut, useLogIn } from "../../../../context/AuthContext";

import { ME } from "../../../../sharedQueries";
import { useMe } from "../../../../context/MeContext";
import EditProfilePresenter from "./EditProfilePresenter";
import { useTheme } from "../../../../context/ThemeContext";

export default ({ navigation }) => {
  const logIn = useLogIn();
  const { me, loading: meLoading } = useMe();
  const logOut = useLogOut();
  const isDarkMode = useTheme();

  const { showActionSheetWithOptions } = useActionSheet();
  const user = navigation.getParam("user");
  const [newUsername, setNewUsername] = useState<string>(me.user.username);
  const [bio, setBio] = useState<string>(user.bio);
  const [gender, setGender] = useState<string>(user.gender);
  const [firstName, setFirstName] = useState<string>(me.user.firstName);
  const [lastName, setLastName] = useState<string>(me.user.lastName);
  const [nationalityCode, setNationalityCode] = useState<any>(
    user.nationality
      ? user.nationality.countryCode
      : user.currentCity.country.countryCode
  );
  const [residenceCode, setResidenceCode] = useState<any>(
    user.residence
      ? user.residence.countryCode
      : user.currentCity.country.countryCode
  );
  const [isHidePhotos, setIsHidePhotos] = useState<boolean>(user.isHidePhotos);
  const [isHideTrips, setIsHideTrips] = useState<boolean>(user.isHideTrips);
  const [isHideCities, setIsHideCities] = useState<boolean>(user.isHideCities);
  const [isHideCountries, setIsHideCountries] = useState<boolean>(
    user.isHideCountries
  );
  const [isHideContinents, setIsHideContinents] = useState<boolean>(
    user.isHideContinents
  );
  const [isAutoLocationReport, setIsAutoLocationReport] = useState<boolean>(
    user.isAutoLocationReport
  );
  const phoneNumber = user.phoneNumber;
  const countryPhoneNumber = user.countryPhoneNumber;
  const countryPhoneCode = user.countryPhoneCode;
  const [newPhoneNumber, setNewPhoneNumber] = useState<string>(
    user.phoneNumber || ""
  );
  const [newCountryPhoneNumber, setNewCountryPhoneNumber] = useState<string>(
    user.countryPhoneNumber
      ? user.countryPhoneNumber
      : countries.find((i) => i.code === user.currentCity.country.countryCode)
          .phone
  );
  const [newCountryPhoneCode, setNewCountryPhoneCode] = useState<any>(
    user.countryPhoneCode
      ? user.countryPhoneCode
      : user.currentCity.country.countryCode
  );
  const [editPhoneModalOpen, setEditPhoneModalOpen] = useState<boolean>(false);
  const [isEditPhoneMode, setIsEditPhoneMode] = useState<boolean>(true);
  const [verificationKey, setVerificationKey] = useState<string>("");
  const emailAddress = user.emailAddress;
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
      residenceCode,
    },
    update(cache, { data: { editProfile } }) {
      try {
        const data = cache.readQuery<Me>({
          query: ME,
        });
        if (data) {
          data.me.user = editProfile.user;
          cache.writeQuery({
            query: ME,
            data,
          });
        }
      } catch (e) {
        console.log(e);
      }
      try {
        const data = cache.readQuery<UserProfile, UserProfileVariables>({
          query: GET_USER,
          variables: { uuid: user.uuid },
        });
        if (data) {
          data.userProfile.user = editProfile.user;
          cache.writeQuery({
            query: GET_USER,
            variables: { uuid: user.uuid },
            data,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  const onPress = () => {
    setSubmitModal(true);
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        showSeparators: true,
        title: "Are you sure to edit this profile?",
        containerStyle: {
          backgroundColor: isDarkMode ? "#212121" : "#e6e6e6",
          borderRadius: 10,
          width: constants.width - 30,
          marginLeft: 15,
          marginBottom: 10,
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400",
        },
        separatorStyle: { opacity: 0.5 },
      },
      (buttonIndex) => {
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
        showSeparators: true,
        title: "Are you sure to logout?",
        containerStyle: {
          backgroundColor: isDarkMode ? "#212121" : "#e6e6e6",
          borderRadius: 10,
          width: constants.width - 30,
          marginLeft: 15,
          marginBottom: 10,
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400",
        },
        separatorStyle: { opacity: 0.5 },
      },
      (buttonIndex) => {
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
        showSeparators: true,
        title: "Are you sure to delete this account?",
        containerStyle: {
          backgroundColor: isDarkMode ? "#212121" : "#e6e6e6",
          borderRadius: 10,
          width: constants.width - 30,
          marginLeft: 15,
          marginBottom: 10,
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400",
        },
        separatorStyle: { opacity: 0.5 },
      },
      (buttonIndex) => {
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
    { loading: startEditPhoneVerificationLoading },
  ] = useMutation<
    StartEditPhoneVerification,
    StartEditPhoneVerificationVariables
  >(START_EDIT_PHONE_VERIFICATION, {
    variables: {
      countryPhoneNumber: newCountryPhoneNumber,
      phoneNumber: newPhoneNumber.startsWith("0")
        ? newPhoneNumber.substring(1)
        : newPhoneNumber,
    },
  });
  const [
    completeEditPhoneVerificationFn,
    { loading: completeEditPhoneVerificationLoading },
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
      countryPhoneCode: newCountryPhoneCode,
    },
    update(cache, { data: { completeEditPhoneVerification } }) {
      try {
        const data = cache.readQuery<UserProfile, UserProfileVariables>({
          query: GET_USER,
          variables: { uuid: user.uuid },
        });
        if (data) {
          data.userProfile.user.phoneNumber =
            completeEditPhoneVerification.phoneNumber;
          data.userProfile.user.countryPhoneNumber =
            completeEditPhoneVerification.countryPhoneNumber;
          data.userProfile.user.countryPhoneCode =
            completeEditPhoneVerification.countryPhoneCode;
          data.userProfile.user.isVerifiedPhoneNumber =
            completeEditPhoneVerification.isVerifiedPhoneNumber;
          cache.writeQuery({
            query: GET_USER,
            variables: { uuid: user.uuid },
            data,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  });
  const [
    startEditEmailVerificationFn,
    { loading: startEditEmailVerificationLoading },
  ] = useMutation<
    StartEditEmailVerification,
    StartEditEmailVerificationVariables
  >(START_EDIT_EMAIL_VERIFICATION, {
    variables: {
      emailAddress: newEmailAddress,
    },
  });

  const [toggleSettingsFn, { loading: toggleSettingsLoading }] = useMutation<
    ToggleSettings,
    ToggleSettingsVariables
  >(TOGGLE_SETTINGS, {
    update(cache, { data: { toggleSettings } }) {
      try {
        const data = cache.readQuery<UserProfile, UserProfileVariables>({
          query: GET_USER,
          variables: { uuid: user.uuid },
        });
        if (data) {
          data.userProfile.user.isDarkMode = toggleSettings.user.isDarkMode;
          data.userProfile.user.isHidePhotos = toggleSettings.user.isHidePhotos;
          data.userProfile.user.isHideTrips = toggleSettings.user.isHideTrips;
          data.userProfile.user.isHideCities = toggleSettings.user.isHideCities;
          data.userProfile.user.isHideCountries =
            toggleSettings.user.isHideCountries;
          data.userProfile.user.isHideContinents =
            toggleSettings.user.isHideContinents;
          data.userProfile.user.isAutoLocationReport =
            toggleSettings.user.isAutoLocationReport;
          cache.writeQuery({
            query: GET_USER,
            variables: { uuid: user.uuid },
            data,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  });
  const toast = (message: string) => {
    Toast.show(message, {
      duration: 1000,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
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
      countries.find((i) => i.code === country.cca2).phone
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
        setIsHidePhotos((isHidePhotos) => !isHidePhotos);
      } else if (payload === "HIDE_TRIPS") {
        setIsHideTrips((isHideTrips) => !isHideTrips);
      } else if (payload === "HIDE_CITIES") {
        setIsHideCities((isHideCities) => !isHideCities);
      } else if (payload === "HIDE_COUNTRIES") {
        setIsHideCountries((isHideCountries) => !isHideCountries);
      } else if (payload === "HIDE_CONTINENTS") {
        setIsHideContinents((isHideContinents) => !isHideContinents);
      } else if (payload === "AUTO_LOCATION_REPORT") {
        setIsAutoLocationReport(
          (isAutoLocationReport) => !isAutoLocationReport
        );
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
      data: { startEditPhoneVerification },
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
      data: { completeEditPhoneVerification },
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
        data: { editProfile },
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
          data: { startEditEmailVerification },
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
        showSeparators: true,
        containerStyle: {
          backgroundColor: isDarkMode ? "#212121" : "#e6e6e6",
          borderRadius: 10,
          width: constants.width - 30,
          marginLeft: 15,
          marginBottom: 10,
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400",
        },
        separatorStyle: { opacity: 0.5 },
      },
      (buttonIndex) => {
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
        ((me.user.nationality && me.user.nationality.countryCode) ||
          nationalityCode !== user.currentCity.country.countryCode) ||
      residenceCode !==
        ((me.user.residence && me.user.residence.countryCode) ||
          residenceCode !== user.currentCity.country.countryCode) ||
      gender !== me.user.gender ||
      firstName !== me.user.firstName ||
      lastName !== me.user.lastName ||
      bio !== me.user.bio
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  });
  return (
    <EditProfilePresenter
      navigation={navigation}
      isDarkMode={isDarkMode}
      meLoading={meLoading}
      startEditPhoneVerificationLoading={startEditPhoneVerificationLoading}
      completeEditPhoneVerificationLoading={
        completeEditPhoneVerificationLoading
      }
      startEditEmailVerificationLoading={startEditEmailVerificationLoading}
      editProfileLoading={editProfileLoading}
      toggleSettingsLoading={toggleSettingsLoading}
      deleteeLoading={deleteeLoading}
      setNewPhoneNumber={setNewPhoneNumber}
      setVerificationKey={setVerificationKey}
      setNewEmailAddress={setNewEmailAddress}
      setBio={setBio}
      setEditPhoneModalOpen={setEditPhoneModalOpen}
      setDeleteModalOpen={setDeleteModalOpen}
      isEditPhoneMode={isEditPhoneMode}
      isEditEmailMode={isEditEmailMode}
      isChanged={isChanged}
      isHidePhotos={isHidePhotos}
      isHideTrips={isHideTrips}
      isHideCities={isHideCities}
      isHideCountries={isHideCountries}
      isHideContinents={isHideContinents}
      isAutoLocationReport={isAutoLocationReport}
      newCountryPhoneCode={newCountryPhoneCode}
      newCountryPhoneNumber={newCountryPhoneNumber}
      newUsername={newUsername}
      newEmailAddress={newEmailAddress}
      onSelectrEditPhone={onSelectrEditPhone}
      onInputTextChange={onInputTextChange}
      onSelectNationality={onSelectNationality}
      onOpenGenderActionSheet={onOpenGenderActionSheet}
      onSelectrRsidence={onSelectrRsidence}
      onPressToggleIcon={onPressToggleIcon}
      onLogout={onLogout}
      onPress={onPress}
      editPhoneModalOpen={editPhoneModalOpen}
      closeEditPhoneModalOpen={closeEditPhoneModalOpen}
      deleteModalOpen={deleteModalOpen}
      closeDeleteModalOpen={closeDeleteModalOpen}
      editEmailModalOpen={editEmailModalOpen}
      closeEditEmailModalOpen={closeEditEmailModalOpen}
      handlePhoneNumber={handlePhoneNumber}
      handlePhoneVerification={handlePhoneVerification}
      deleteAccountUsername={deleteAccountUsername}
      handleEmailAddress={handleEmailAddress}
      nationalityCode={nationalityCode}
      residenceCode={residenceCode}
      gender={gender}
      firstName={firstName}
      lastName={lastName}
      bio={bio}
      me={me}
      user={user}
      countryPhoneNumber={countryPhoneNumber}
      phoneNumber={phoneNumber}
      countryPhoneCode={countryPhoneCode}
      emailAddress={emailAddress}
      submitModal={submitModal}
      logoutModal={logoutModal}
      deleteModal={deleteModal}
    />
  );
};
