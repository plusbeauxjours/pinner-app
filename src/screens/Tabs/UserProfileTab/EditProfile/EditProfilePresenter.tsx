import React from "react";
import { Platform, TextInput, ActivityIndicator } from "react-native";

import styled from "styled-components";
import Modal from "react-native-modal";

import { useTheme } from "../../../../hooks/useTheme";
import constants from "../../../../../constants";
import { countries } from "../../../../../countryData";
import CountryPicker, { DARK_THEME } from "react-native-country-picker-modal";
import { Ionicons } from "@expo/vector-icons";

const View = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-color: ${(props) => props.theme.bgColor};
`;

const EditModalContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ToggleContainer = styled.View``;

const ToggleText = styled.Text`
  height: 20px;
  color: ${(props) => props.theme.color};
  font-weight: ${(props) => (props.isChanged ? "300" : "100")};
`;

const SubmitText = styled.Text<ITheme>`
  height: 20px;
  color: ${(props) => (props.isChanged ? "#d60000" : props.theme.color)};
  font-weight: ${(props) => (props.isChanged ? "300" : "100")};
`;

const CountryView = styled.View`
  margin-top: 4px;
  align-items: flex-end;
  flex-direction: column;
`;

const Text = styled.Text`
  color: ${(props) => props.theme.color};
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
  color: ${(props) => props.theme.color};
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

const ExplainText = styled.Text<ITheme>`
  font-size: 11px;
  color: ${(props) => (props.isChanged ? "#d60000" : props.theme.color)};
  font-weight: ${(props) => (props.isChanged ? "300" : "100")};
`;

const FlagExplainText = styled(ExplainText)`
  top: -5px;
`;

const ScrollView = styled.ScrollView`
  background-color: ${(props) => props.theme.bgColor};
`;

const ButtonContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding: 15px;
  max-width: 400px;
`;

const TextContainer = styled.View`
  width: ${constants.width - 30};
  justify-content: center;
  align-items: center;
`;

const SubmitButtonContainer = styled.View`
  width: ${constants.width - 80};
  max-width: 360px;
  height: 40px;
  justify-content: center;
  align-items: center;
  border: 0.5px solid #999;
  border-radius: 5px;
`;

const SubmitButtonText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.color};
`;

const SubmitButton = styled.TouchableOpacity`
  justify-content: center;
  padding: 0 5px 5px 5px;
`;

interface ITheme {
  isChanged: boolean;
}

interface IProps {
  navigation: any;
  isDarkMode: boolean;
  meLoading: boolean;
  startEditPhoneVerificationLoading: boolean;
  completeEditPhoneVerificationLoading: boolean;
  startEditEmailVerificationLoading: boolean;
  editProfileLoading: boolean;
  toggleSettingsLoading: boolean;
  deleteeLoading: boolean;
  setNewPhoneNumber: (newPhoneNumber: string) => void;
  setVerificationKey: (verificationKey: string) => void;
  setNewEmailAddress: (newEmailAddress: string) => void;
  setBio: (bio: string) => void;
  setEditPhoneModalOpen: (editPhoneModalOpen: boolean) => void;
  setDeleteModalOpen: (deleteModalOpen: boolean) => void;
  isEditPhoneMode: boolean;
  isEditEmailMode: boolean;
  isChanged: boolean;
  isHidePhotos: boolean;
  isHideTrips: boolean;
  isHideCities: boolean;
  isHideCountries: boolean;
  isHideContinents: boolean;
  isAutoLocationReport: boolean;
  newCountryPhoneCode: any;
  newCountryPhoneNumber: string;
  newUsername: string;
  newEmailAddress: string;

  onSelectrEditPhone: (country: any) => void;
  onSelectNationality: (country: any) => void;
  onSelectrRsidence: (country: any) => void;
  onInputTextChange: (text: string, state: string) => void;
  onOpenGenderActionSheet: () => void;
  onPressToggleIcon: (payload: string) => void;
  onLogout: () => void;
  onPress: () => void;

  editPhoneModalOpen: boolean;
  closeEditPhoneModalOpen: () => void;
  deleteModalOpen: boolean;
  closeDeleteModalOpen: () => void;
  editEmailModalOpen: boolean;
  closeEditEmailModalOpen: () => void;
  handlePhoneNumber: () => void;
  handlePhoneVerification;
  deleteAccountUsername: string;
  handleEmailAddress;
  nationalityCode: any;
  residenceCode: any;
  gender: string;
  firstName: string;
  lastName: string;
  bio: string;
  me: any;
  user: any;
  countryPhoneNumber: string;
  phoneNumber: string;
  countryPhoneCode: string;
  emailAddress: string;

  submitModal: boolean;
  logoutModal: boolean;
  deleteModal: boolean;
}

const EditProfilePresenter: React.FC<IProps> = ({
  navigation,
  isDarkMode,
  meLoading,
  startEditPhoneVerificationLoading,
  completeEditPhoneVerificationLoading,
  startEditEmailVerificationLoading,
  editProfileLoading,
  toggleSettingsLoading,
  deleteeLoading,

  setNewPhoneNumber,
  setVerificationKey,
  setNewEmailAddress,
  setBio,
  setEditPhoneModalOpen,
  setDeleteModalOpen,

  isEditPhoneMode,
  isEditEmailMode,
  isChanged,
  isHidePhotos,
  isHideTrips,
  isHideCities,
  isHideCountries,
  isHideContinents,
  isAutoLocationReport,

  newCountryPhoneCode,
  newCountryPhoneNumber,
  newUsername,
  newEmailAddress,

  onSelectrEditPhone,
  onInputTextChange,
  onSelectNationality,
  onOpenGenderActionSheet,
  onSelectrRsidence,
  onPressToggleIcon,
  onLogout,
  onPress,
  editPhoneModalOpen,
  closeEditPhoneModalOpen,
  deleteModalOpen,
  closeDeleteModalOpen,
  editEmailModalOpen,
  closeEditEmailModalOpen,
  handlePhoneNumber,
  handlePhoneVerification,
  deleteAccountUsername,
  handleEmailAddress,
  nationalityCode,
  residenceCode,
  gender,
  firstName,
  lastName,
  bio,
  me,
  user,
  countryPhoneNumber,
  phoneNumber,
  countryPhoneCode,
  emailAddress,
  submitModal,
  logoutModal,
  deleteModal,
}) => {
  const { theme, toggleTheme } = useTheme();
  if (!meLoading) {
    return (
      <>
        <Modal
          style={{ justifyContent: "center", alignItems: "center" }}
          isVisible={editPhoneModalOpen}
          backdropColor={theme ? "#161616" : "#EFEFEF"}
          onBackdropPress={() => closeEditPhoneModalOpen()}
          onBackButtonPress={() =>
            Platform.OS === "android" && closeEditPhoneModalOpen()
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
                    fontWeight: "300",
                  }}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  onChangeText={(number) => setNewPhoneNumber(number)}
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
                  textAlign: "center",
                }}
                keyboardType="phone-pad"
                returnKeyType="done"
                onChangeText={(number) => setVerificationKey(number)}
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
            Platform.OS === "android" && closeDeleteModalOpen()
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
              textAlign: "center",
            }}
            value={deleteAccountUsername}
            placeholderTextColor="#999"
            placeholder={newUsername}
            returnKeyType="done"
            onChangeText={(text) =>
              onInputTextChange(text, "deleteAccountUsername")
            }
            autoCorrect={false}
            autoCapitalize={"none"}
          />
          <TextContainer>
            <Void />
            <ConfirmBold>Are you absolutely sure?</ConfirmBold>
            <Text>
              This action cannot be undone. This will permanently delete
              the&nbsp;
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
            Platform.OS === "android" && closeEditEmailModalOpen()
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
                    fontWeight: "300",
                  }}
                  keyboardType="email-address"
                  returnKeyType="done"
                  onChangeText={(adress) => setNewEmailAddress(adress)}
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
                    color: "#999",
                  }}
                  value={newUsername}
                  returnKeyType="done"
                  onChangeText={(text) =>
                    onInputTextChange(text, "newUsername")
                  }
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
                  />
                  <FlagExplainText>
                    {countries.find((i) => i.code === nationalityCode).name}
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
                    {countries.find((i) => i.code === residenceCode).name}
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
                    color: "#999",
                  }}
                  value={firstName}
                  returnKeyType="done"
                  onChangeText={(text) => onInputTextChange(text, "firstName")}
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
                    color: "#999",
                  }}
                  value={lastName}
                  returnKeyType="done"
                  onChangeText={(text) => onInputTextChange(text, "lastName")}
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
                    marginBottom: 10,
                  }}
                  placeholderTextColor="#999"
                  value={bio}
                  placeholder={"BIO"}
                  returnKeyType="done"
                  onChangeText={(text) => setBio(text)}
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
                  ((me.user.nationality && me.user.nationality.countryCode) ||
                    nationalityCode !== user.currentCity.country.countryCode) &&
                  "NATIONALITY "}
                {residenceCode !==
                  ((me.user.residence && me.user.residence.countryCode) ||
                    residenceCode !== user.currentCity.country.countryCode) &&
                  "RESIDENCE "}
                {gender !== me.user.gender && "GENDER "}
                {firstName !== me.user.firstName && "FIRSTNAME "}
                {lastName !== me.user.lastName && "LASTNAME "}
                {bio !== me.user.bio && "BIO "}
                {isChanged && "is changed. Please press submit button to save."}
              </ExplainText>
              <Item>
                <ToggleText>PHONE</ToggleText>
                {countryPhoneCode && countryPhoneNumber ? (
                  <Touchable onPress={() => setEditPhoneModalOpen(true)}>
                    <ToggleText>
                      {countries.find((i) => i.code === countryPhoneCode).emoji}
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
              {user.isVerifiedPhoneNumber ? (
                <ExplainText>
                  Your phone number is already verified in&nbsp;
                  {countries.find((i) => i.code === countryPhoneCode).name}.
                </ExplainText>
              ) : (
                <ExplainText>Verify your phone number to login.</ExplainText>
              )}
              <Item>
                <ToggleText>EMAIL</ToggleText>
                {emailAddress && <ToggleText>{emailAddress}</ToggleText>}
                {/* {emailAddress ? (
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
              )} */}
              </Item>
              {user.isVerifiedEmailAddress ? (
                <ExplainText>
                  Your email address is already verified.
                </ExplainText>
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
                If you set your trips hide, only you can see your trips,
                otherwise only number of trips and your trip distance are shown.
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
                If you set your cities hide, only you can see cities where
                you've been before, otherwise only number of cities is shown.
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
                If you set auto location report off, the app cannot find where
                you are. Your lacation will be shown on your profile.
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
  } else {
    return;
  }
};

export default EditProfilePresenter;
