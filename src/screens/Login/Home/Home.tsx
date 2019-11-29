import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-native-modal";
import constants from "../../../../constants";
import { useMutation } from "react-apollo-hooks";
import {
  StartPhoneVerification,
  StartPhoneVerificationVariables,
  CompletePhoneVerification,
  CompletePhoneVerificationVariables,
  StartEmailVerification,
  StartEmailVerificationVariables
} from "../../../types/api";
import Toast from "react-native-root-toast";
import Loader from "../../../components/Loader";
import { Platform, ActivityIndicator } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { DARK_THEME } from "react-native-country-picker-modal";
import CountryPicker from "react-native-country-picker-modal";
import { TextInput } from "react-native-gesture-handler";
import { countries } from "../../../../countryData";
import { useLocation } from "../../../context/LocationContext";
import { useLogIn } from "../../../context/AuthContext";
import {
  EMAIL_SIGN_IN,
  PHONE_SIGN_IN,
  COMPLETE_PHONE_SIGN_IN
} from "./HomeQueries";
import FacebookApproach from "../FacebookApproach";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const Image = styled.Image`
  width: ${constants.width / 2.5};
`;

const LoginLink = styled.View`
  margin-bottom: 10px;
`;
const LoginLinkText = styled.Text`
  color: ${props => props.theme.blueColor};
  margin-top: 20px;
  font-weight: 600;
`;

const LoaderContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bgColor};
  justify-content: center;
  align-items: center;
`;
const ApproachModalContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const Text = styled.Text`
  color: ${props => props.theme.color};
`;
const Bigtext = styled(Text)`
  font-weight: 300;
  font-size: 30;
`;
const ButtonContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding: 15px;
`;
const Void = styled.View`
  height: 40px;
`;
const Touchable = styled.TouchableOpacity``;
const SubmitLoaderContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding: 15px;
  height: 35px;
`;
const EmptyView = styled.View`
  justify-content: center;
  align-items: center;
`;
const AddTripContainer = styled.View`
  width: ${constants.width - 80};
  height: 40px;
  justify-content: center;
  align-items: center;
  border: 0.5px solid #999;
  border-radius: 5px;
`;
const TripText = styled.Text`
  font-size: 16;
  font-weight: 500;
  color: ${props => props.theme.color};
`;
const AddTripBtn = styled.TouchableOpacity`
  justify-content: center;
  padding: 0 5px 5px 5px;
`;
export default ({ navigation }) => {
  const logIn = useLogIn();
  const isDarkMode = useTheme();
  const { location, loading: locationLoading } = useLocation();
  const [approachModalOpen, setApproachModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<string>("phoneApproach");
  const [verificationKey, setVerificationKey] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [countryPhoneCode, setCountryPhoneCode] = useState<any>(
    "KR"
    // location.currentCountryCode
  );
  const [countryPhoneNumber, setCountryPhoneNumber] = useState(
    "+82"
    // countries.find(i => i.code === location.currentCountryCode).phone
  );

  const [loading, setLoading] = useState(false);
  const [
    startPhoneVerificationFn,
    { loading: startPhoneVerificationLoading }
  ] = useMutation<StartPhoneVerification, StartPhoneVerificationVariables>(
    PHONE_SIGN_IN,
    {
      variables: {
        phoneNumber: `${countryPhoneNumber}${
          phoneNumber.startsWith("0") ? phoneNumber.substring(1) : phoneNumber
        }`
      }
    }
  );
  const [
    completePhoneVerificationFn,
    { loading: completePhoneVerificationLoading }
  ] = useMutation<
    CompletePhoneVerification,
    CompletePhoneVerificationVariables
  >(COMPLETE_PHONE_SIGN_IN, {
    variables: {
      key: verificationKey,
      phoneNumber: phoneNumber.startsWith("0")
        ? phoneNumber.substring(1)
        : phoneNumber,
      countryPhoneNumber,
      countryPhoneCode,
      cityId: location && location.currentCityId
    }
  });
  const [
    startEmailVerificationFn,
    { loading: startEmailVerificationLoading }
  ] = useMutation<StartEmailVerification, StartEmailVerificationVariables>(
    EMAIL_SIGN_IN,
    {
      variables: { emailAddress }
    }
  );
  const toast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  };
  const onSelectrPhone = (country: any) => {
    setCountryPhoneNumber(countries.find(i => i.code === country.cca2).phone);
    setCountryPhoneCode(country.cca2);
  };
  const closePhoneApproachModalOpen = () => {
    setApproachModalOpen(false);
    setModalMode("phoneApproach");
    setVerificationKey("");
  };
  const handlePhoneNumber = async () => {
    const phone = `${countryPhoneNumber}${
      phoneNumber.startsWith("0") ? phoneNumber.substring(1) : phoneNumber
    }`;
    const phoneRegex = /(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/;
    const {
      data: { startPhoneVerification }
    } = await startPhoneVerificationFn();
    if (startPhoneVerification.ok) {
      setModalMode("phoneVerification");
      setVerificationKey("");
    } else if (phoneNumber === "") {
      closePhoneApproachModalOpen();
      toast("Phone number can't be empty");
    } else if (countryPhoneNumber === "") {
      closePhoneApproachModalOpen();
      toast("Please choose a country");
    } else if (!phoneRegex.test(phone)) {
      closePhoneApproachModalOpen();
      toast("This phone number is invalid");
    } else if (!startPhoneVerification.ok) {
      closePhoneApproachModalOpen();
      toast("Could not send you a Key");
    } else {
      closePhoneApproachModalOpen();
      toast("Please write a valid phone number");
    }
  };
  const handleEmailAddress = async () => {
    if (emailAddress !== "") {
      const isValid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        emailAddress
      );
      if (isValid) {
        const {
          data: { startEmailVerification }
        } = await startEmailVerificationFn();
        if (startEmailVerification.ok) {
          setModalMode("emailVerification");
        } else {
          setApproachModalOpen(false);
          toast("Requested email address is already verified");
        }
      } else {
        setApproachModalOpen(false);
        toast("Please write a valid email");
      }
    } else {
      setApproachModalOpen(false);
      toast("Please write a email address");
    }
  };
  const handlePhoneVerification = async () => {
    const {
      data: { completePhoneVerification }
    } = await completePhoneVerificationFn();
    setApproachModalOpen(false);
    setModalMode("phoneApproach");
    setVerificationKey("");
    if (completePhoneVerification.ok) {
      logIn(completePhoneVerification);
      toast("Your phone number is verified! Welcome!");
    } else {
      toast("Could not be Verified your phone number");
    }
  };
  if (loading || locationLoading) {
    <LoaderContainer>
      <Loader />
    </LoaderContainer>;
  }
  return (
    <>
      <Modal
        isVisible={approachModalOpen}
        backdropColor={isDarkMode ? "#161616" : "#EFEFEF"}
        onBackdropPress={() => closePhoneApproachModalOpen()}
        onBackButtonPress={() =>
          Platform.OS !== "ios" && closePhoneApproachModalOpen()
        }
        propagateSwipe={true}
        scrollHorizontal={true}
        backdropOpacity={0.9}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        {(() => {
          switch (modalMode) {
            case "phoneApproach":
              return (
                <>
                  <ApproachModalContainer>
                    {countryPhoneCode && (
                      <CountryPicker
                        theme={isDarkMode && DARK_THEME}
                        countryCode={countryPhoneCode}
                        withFilter={true}
                        withFlag={true}
                        withAlphaFilter={true}
                        withEmoji={true}
                        onSelect={onSelectrPhone}
                      />
                    )}
                    {countryPhoneNumber && (
                      <Bigtext>{countryPhoneNumber}</Bigtext>
                    )}
                    <TextInput
                      style={{
                        width: 220,
                        backgroundColor: "transparent",
                        borderBottomWidth: 1,
                        borderBottomColor: "#999",
                        color: isDarkMode ? "white" : "black",
                        marginLeft: 5,
                        fontSize: 32,
                        fontWeight: "300"
                      }}
                      keyboardType="phone-pad"
                      returnKeyType="send"
                      onChangeText={number => setPhoneNumber(number)}
                    />
                  </ApproachModalContainer>
                  <ButtonContainer>
                    <Text>
                      When you tap "SEND SMS", Pinner will send a text with
                      verification code. Message and data rates may apply. The
                      verified phone number can be used to login.
                    </Text>
                    <Text style={{ marginTop: 15 }}>
                      Changed your phone number?{" "}
                    </Text>
                    <Touchable onPress={() => setModalMode("emailApproach")}>
                      <Text style={{ textDecorationLine: "underline" }}>
                        Login with email
                      </Text>
                    </Touchable>
                    <Void />
                    <AddTripBtn
                      disabled={startPhoneVerificationLoading}
                      onPress={handlePhoneNumber}
                    >
                      <AddTripContainer>
                        {startPhoneVerificationLoading ? (
                          <ActivityIndicator color={"#999"} />
                        ) : (
                          <TripText>SEND SMS</TripText>
                        )}
                      </AddTripContainer>
                    </AddTripBtn>
                  </ButtonContainer>
                </>
              );
            case "phoneVerification":
              return (
                <>
                  <TextInput
                    style={{
                      width: constants.width - 80,
                      backgroundColor: "transparent",
                      borderBottomWidth: 1,
                      borderBottomColor: "#999",
                      color: isDarkMode ? "white" : "black",
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
                    <Void />
                    <AddTripBtn
                      disabled={completePhoneVerificationLoading}
                      onPress={handlePhoneVerification}
                    >
                      <AddTripContainer>
                        {completePhoneVerificationLoading ? (
                          <ActivityIndicator color={"#999"} />
                        ) : (
                          <TripText>VERIFY KEY</TripText>
                        )}
                      </AddTripContainer>
                    </AddTripBtn>
                  </ButtonContainer>
                </>
              );
            case "emailApproach":
              return (
                <>
                  <ApproachModalContainer>
                    <TextInput
                      style={{
                        width: constants.width - 80,
                        backgroundColor: "transparent",
                        borderBottomWidth: 1,
                        borderBottomColor: "#999",
                        color: isDarkMode ? "white" : "black",
                        fontSize: 32,
                        fontWeight: "300"
                      }}
                      keyboardType="email-address"
                      returnKeyType="send"
                      onChangeText={adress => setEmailAddress(adress)}
                    />
                  </ApproachModalContainer>
                  <ButtonContainer>
                    <Text>
                      When you tap "SEND EMAIL", Pinner will email you a link
                      that will instantly log you in.
                    </Text>
                    <Void />
                    <AddTripBtn
                      disabled={startEmailVerificationLoading}
                      onPress={handleEmailAddress}
                    >
                      <AddTripContainer>
                        {startEmailVerificationLoading ? (
                          <ActivityIndicator color={"#999"} />
                        ) : (
                          <TripText>SEND EMAIL</TripText>
                        )}
                      </AddTripContainer>
                    </AddTripBtn>
                  </ButtonContainer>
                </>
              );
            case "emailVerification":
              return (
                <>
                  <Text>{emailAddress}, an email has been sent</Text>
                  <Text>
                    Please check your email in a moment to verify email address.
                  </Text>
                  <Text>Didn't receive a link?</Text>
                  <Touchable onPress={() => setModalMode("emailApproach")}>
                    <Text> Use a different email.</Text>
                  </Touchable>
                </>
              );
            default:
              return null;
          }
        })()}
      </Modal>
      <View>
        <Image
          resizeMode={"contain"}
          source={require("../../../../assets/logo.png")}
        />
        <Touchable onPress={() => setApproachModalOpen(true)}>
          <LoginLink>
            <LoginLinkText>LOG IN WITH PHONE NUMBER</LoginLinkText>
          </LoginLink>
        </Touchable>
        <FacebookApproach />
      </View>
    </>
  );
};
