import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "react-native-modal";
import constants from "../../../../constants";
import { useMutation } from "react-apollo-hooks";
import * as Permissions from "expo-permissions";
import {
  StartPhoneVerification,
  StartPhoneVerificationVariables,
  CompletePhoneVerification,
  CompletePhoneVerificationVariables
  // StartEmailVerification,
  // StartEmailVerificationVariables
} from "../../../types/api";
import Toast from "react-native-root-toast";
import { useTheme } from "../../../context/ThemeContext";
import { DARK_THEME } from "react-native-country-picker-modal";
import CountryPicker from "react-native-country-picker-modal";
import {
  Platform,
  TextInput,
  ActivityIndicator,
  Alert,
  Linking
} from "react-native";
import { countries } from "../../../../countryData";
import { useLogIn } from "../../../context/AuthContext";
import Loader from "../../../components/Loader";
import {
  // EMAIL_SIGN_IN,
  PHONE_SIGN_IN,
  COMPLETE_PHONE_SIGN_IN
} from "./HomeQueries";
import FacebookApproach from "../FacebookApproach";
import { useReverseGeoCode } from "../../../hooks/useReverseGeoCode";
import AppleApproach from "../AppleApproach";
import { FontAwesome } from "@expo/vector-icons";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const Image = styled.Image`
  width: 180px;
  height: 180px;
`;
const Container = styled.View`
  flex-direction: column;
  align-items: center;
`;
const LoginLink = styled.View`
  flex-direction: row;
  border: 0.5px solid #999;
  width: 260px;
  height: 40px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
`;
const LoginTextContainer = styled.View`
  width: 220px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const LoginLinkText = styled.Text`
  color: #999;
  font-weight: 600;
`;
const ApproachModalContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const Text = styled.Text`
  color: ${props => props.theme.color};
`;
const Bigtext = styled.Text`
  color: ${props => props.theme.color};
  font-weight: 300;
  font-size: 30px;
`;
const ButtonContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding: 15px;
  max-width: 400px;
`;
const Void = styled.View`
  height: 40px;
`;
const Title = styled.Text`
  font-weight: 300;
  font-size: 23px;
  top: -25px;
  font-family: "Georgia";
  color: #3897f0;
`;
const Touchable = styled.TouchableOpacity``;
const BtnContainer = styled.View`
  position: absolute;
  bottom: 70px;
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
  color: ${props => props.theme.color};
`;
const SubmitButton = styled.TouchableOpacity`
  justify-content: center;
  padding: 0 5px 5px 5px;
`;
const LoaderContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
export default ({ navigation }) => {
  const logIn = useLogIn();
  const isDarkMode = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [cityId, setCityId] = useState<string>("ChIJOwg_06VPwokRYv534QaPC8g");
  const [approachModalOpen, setApproachModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<string>("phoneApproach");
  const [verificationKey, setVerificationKey] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [countryPhoneCode, setCountryPhoneCode] = useState<any>("US");
  const [countryPhoneNumber, setCountryPhoneNumber] = useState("+1");
  // const [emailAddress, setEmailAddress] = useState<string>("");
  // const [
  //   startEmailVerificationFn,
  //   { loading: startEmailVerificationLoading }
  // ] = useMutation<StartEmailVerification, StartEmailVerificationVariables>(
  //   EMAIL_SIGN_IN,
  //   {
  //     variables: { emailAddress }
  //   }
  // );
  // const handleEmailAddress = async () => {
  //   if (emailAddress !== "") {
  //     const isValid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
  //       emailAddress
  //     );
  //     if (isValid) {
  //       const {
  //         data: { startEmailVerification }
  //       } = await startEmailVerificationFn();
  //       if (startEmailVerification.ok) {
  //         setModalMode("emailVerification");
  //       } else {
  //         setApproachModalOpen(false);
  //         toast("Requested email address is already verified");
  //       }
  //     } else {
  //       setApproachModalOpen(false);
  //       toast("Please write a valid email");
  //     }
  //   } else {
  //     setApproachModalOpen(false);
  //     toast("Please write a email address");
  //   }
  // };
  const handleGeoSuccess = (position: Position) => {
    const {
      coords: { latitude, longitude }
    } = position;
    getAddress(latitude, longitude);
  };
  const getAddress = async (latitude: number, longitude: number) => {
    try {
      const address = await useReverseGeoCode(latitude, longitude);
      if (
        address &&
        address.storableLocation.cityId.length > 0 &&
        address.storableLocation.countryCode.length > 0
      ) {
        setCityId(address.storableLocation.cityId);
        setCountryPhoneCode(address.storableLocation.countryCode);
        setCountryPhoneNumber(
          countries.find(i => i.code === address.storableLocation.countryCode)
            .phone
        );
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const handleGeoError = () => {
    setLoading(false);
    console.log("No location");
  };
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
      cityId
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
  const onSelectrPhone = (country: any) => {
    setCountryPhoneNumber(countries.find(i => i.code === country.cca2).phone);
    setCountryPhoneCode(country.cca2);
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
    } else if (phoneNumber === "") {
      setApproachModalOpen(false);
      toast("Phone number can't be empty");
    } else if (countryPhoneNumber === "") {
      setApproachModalOpen(false);
      toast("Please choose a country");
    } else if (!phoneRegex.test(phone)) {
      setApproachModalOpen(false);
      toast("This phone number is invalid");
    } else if (!startPhoneVerification.ok) {
      setApproachModalOpen(false);
      toast("Could not send you a key");
    } else {
      setApproachModalOpen(false);
      toast("Please write a valid phone number");
    }
  };

  const handlePhoneVerification = async () => {
    const {
      data: { completePhoneVerification }
    } = await completePhoneVerificationFn();
    setApproachModalOpen(false);
    if (completePhoneVerification.ok) {
      logIn(completePhoneVerification);
      toast("Your phone number is verified! welcome!");
    } else {
      toast("Could not be verified your phone number");
    }
  };
  const askPermission = async () => {
    const { status: existingLocationStatus } = await Permissions.getAsync(
      Permissions.LOCATION
    );
    let finalLocationStatus = existingLocationStatus;
    if (Platform.OS === "ios" && existingLocationStatus === "denied") {
      Alert.alert(
        "Permission Denied",
        "To enable location, tap Open Settings, then tap on Location, and finally tap on While Using the App.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Open Settings",
            onPress: () => {
              Linking.openURL("app-settings:");
            }
          }
        ]
      );
    } else if (existingLocationStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);
      finalLocationStatus = status;
    } else if (finalLocationStatus !== "granted") {
      return;
    }
  };
  useEffect(() => {
    askPermission();
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
  }, []);
  return (
    <>
      <Modal
        style={{ justifyContent: "center", alignItems: "center" }}
        isVisible={approachModalOpen}
        backdropColor={isDarkMode ? "#161616" : "#EFEFEF"}
        onBackdropPress={() => setApproachModalOpen(false)}
        onBackButtonPress={() =>
          Platform.OS !== "ios" && setApproachModalOpen(false)
        }
        onModalHide={() => {
          setVerificationKey(""), setModalMode("phoneApproach");
        }}
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
        {(() => {
          switch (modalMode) {
            case "phoneApproach":
              if (
                loading ||
                countryPhoneCode.length === 0 ||
                countryPhoneNumber.length === 0
              ) {
                return (
                  <LoaderContainer>
                    <Loader />
                  </LoaderContainer>
                );
              } else {
                return (
                  <>
                    <ApproachModalContainer>
                      {countryPhoneCode && countryPhoneCode.length !== 0 && (
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
                      {countryPhoneNumber && countryPhoneNumber.length > 0 && (
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
                      {/* <Text style={{ marginTop: 15 }}>
                      Changed your phone number?
                    </Text>
                    <Touchable onPress={() => setModalMode("emailApproach")}>
                      <Text style={{ textDecorationLine: "underline" }}>
                        Login with email
                      </Text>
                    </Touchable> */}
                      <Void />
                      <SubmitButton
                        disabled={startPhoneVerificationLoading}
                        onPress={handlePhoneNumber}
                      >
                        <SubmitButtonContainer>
                          {startPhoneVerificationLoading ? (
                            <ActivityIndicator color={"#999"} />
                          ) : (
                            <SubmitButtonText>SEND SMS</SubmitButtonText>
                          )}
                        </SubmitButtonContainer>
                      </SubmitButton>
                    </ButtonContainer>
                  </>
                );
              }
            case "phoneVerification":
              return (
                <>
                  <TextInput
                    style={{
                      width: constants.width - 80,
                      maxWidth: 360,
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
                    <Text>Didn't receive text?</Text>
                    <Touchable onPress={() => setModalMode("phoneApproach")}>
                      <Text style={{ textDecorationLine: "underline" }}>
                        Resend
                      </Text>
                    </Touchable>
                    <Void />
                    <SubmitButton
                      disabled={completePhoneVerificationLoading}
                      onPress={handlePhoneVerification}
                    >
                      <SubmitButtonContainer>
                        {completePhoneVerificationLoading ? (
                          <ActivityIndicator color={"#999"} />
                        ) : (
                          <SubmitButtonText>VERIFY KEY</SubmitButtonText>
                        )}
                      </SubmitButtonContainer>
                    </SubmitButton>
                  </ButtonContainer>
                </>
              );
            // case "emailApproach":
            //   return (
            //     <>
            //       <ApproachModalContainer>
            //         <TextInput
            //           style={{
            //             width: constants.width - 80,
            //             backgroundColor: "transparent",
            //             borderBottomWidth: 1,
            //             borderBottomColor: "#999",
            //             color: isDarkMode ? "white" : "black",
            //             fontSize: 32,
            //             fontWeight: "300"
            //           }}
            //           keyboardType="email-address"
            //           returnKeyType="send"
            //           onChangeText={adress => setEmailAddress(adress)}
            //         />
            //       </ApproachModalContainer>
            //       <ButtonContainer>
            //         <Text>
            //           When you tap "SEND EMAIL", Pinner will email you a link
            //           that will instantly log you in.
            //         </Text>
            //         <Text style={{ marginTop: 15 }}>
            //           Do you want to login with phone number?
            //         </Text>
            //         <Touchable onPress={() => setModalMode("phoneApproach")}>
            //           <Text style={{ textDecorationLine: "underline" }}>
            //             Login with phone number
            //           </Text>
            //         </Touchable>
            //         <Void />
            //         <SubmitButton
            //           disabled={startEmailVerificationLoading}
            //           onPress={handleEmailAddress}
            //         >
            //           <SubmitButtonContainer>
            //             {startEmailVerificationLoading ? (
            //               <ActivityIndicator color={"#999"} />
            //             ) : (
            //               <SubmitButtonText>SEND EMAIL</SubmitButtonText>
            //             )}
            //           </SubmitButtonContainer>
            //         </SubmitButton>
            //       </ButtonContainer>
            //     </>
            //   );
            // case "emailVerification":
            //   return (
            //     <>
            //       <Text>{emailAddress}, an email has been sent</Text>
            //       <Text>
            //         Please check your email in a moment to verify email address.
            //       </Text>
            //       <Text>Didn't receive a link?</Text>
            //       <Touchable onPress={() => setModalMode("emailApproach")}>
            //         <Text> Use a different email.</Text>
            //       </Touchable>
            //     </>
            //   );
            default:
              return null;
          }
        })()}
      </Modal>
      <View>
        <Container>
          <Image
            resizeMode={"contain"}
            source={require("../../../../assets/logo.png")}
          />
          <Title>PINNER</Title>
        </Container>
        <BtnContainer>
          <Touchable
            onPress={() => {
              setApproachModalOpen(true);
            }}
          >
            <LoginLink>
              <LoginTextContainer>
                <FontAwesome
                  name={"phone"}
                  color={"#999"}
                  size={25}
                  style={{ marginRight: 10 }}
                />
                <LoginLinkText>Continue with Phone</LoginLinkText>
              </LoginTextContainer>
            </LoginLink>
          </Touchable>
          <FacebookApproach cityId={cityId} countryCode={countryPhoneCode} />
          {Platform.OS === "ios" && (
            <AppleApproach cityId={cityId} countryCode={countryPhoneCode} />
          )}
        </BtnContainer>
      </View>
    </>
  );
};
