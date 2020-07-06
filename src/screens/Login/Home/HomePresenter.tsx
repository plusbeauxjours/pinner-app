import React from "react";
import { Platform, TextInput, ActivityIndicator } from "react-native";

import styled from "styled-components";
import Modal from "react-native-modal";
import { FontAwesome } from "@expo/vector-icons";
import { DARK_THEME } from "react-native-country-picker-modal";
import CountryPicker from "react-native-country-picker-modal";

import Loader from "../../../components/Loader";

import FacebookApproach from "../FacebookApproach";
import AppleApproach from "../AppleApproach";
import constants from "../../../../constants";

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
  color: ${(props) => props.theme.color};
`;

const Bigtext = styled.Text`
  color: ${(props) => props.theme.color};
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
  color: ${(props) => props.theme.color};
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

interface IProps {
  approachModalOpen: boolean;
  isDarkMode: boolean;
  setApproachModalOpen: (approachModalOpen: boolean) => void;
  setVerificationKey: (verificationKey: string) => void;
  setModalMode: (modalMode: string) => void;
  modalMode: string;
  loading: boolean;
  countryPhoneCode: any;
  countryPhoneNumber: string;
  onSelectrPhone: (country: any) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  startPhoneVerificationLoading: boolean;
  handlePhoneNumber: () => void;
  handlePhoneVerification: () => void;
  completePhoneVerificationLoading: boolean;
  cityId: string;
}

const HomePresenter: React.FC<IProps> = ({
  approachModalOpen,
  isDarkMode,
  setApproachModalOpen,
  setVerificationKey,
  setModalMode,
  modalMode,
  loading,
  countryPhoneCode,
  countryPhoneNumber,
  onSelectrPhone,
  setPhoneNumber,
  startPhoneVerificationLoading,
  handlePhoneNumber,
  handlePhoneVerification,
  completePhoneVerificationLoading,
  cityId,
}) => {
  return (
    <>
      <Modal
        style={{ justifyContent: "center", alignItems: "center" }}
        isVisible={approachModalOpen}
        backdropColor={isDarkMode ? "#161616" : "#EFEFEF"}
        onBackdropPress={() => setApproachModalOpen(false)}
        onBackButtonPress={() =>
          Platform.OS === "android" && setApproachModalOpen(false)
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
                          fontWeight: "300",
                        }}
                        keyboardType="phone-pad"
                        returnKeyType="send"
                        onChangeText={(number) => setPhoneNumber(number)}
                      />
                    </ApproachModalContainer>
                    <ButtonContainer>
                      <Text>
                        When you tap "SEND SMS", Pinner will send a text with
                        verification code. Message and data rates may apply. The
                        verified phone number can be used to login.
                      </Text>
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
                      textAlign: "center",
                    }}
                    keyboardType="phone-pad"
                    returnKeyType="send"
                    onChangeText={(number) => setVerificationKey(number)}
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

export default HomePresenter;
