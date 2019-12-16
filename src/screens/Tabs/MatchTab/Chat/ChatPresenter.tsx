import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  GiftedChat,
  InputToolbar,
  Send,
  Composer
} from "react-native-gifted-chat";
import Modal from "react-native-modal";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import {
  Platform,
  Modal as MapModal,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Loader from "../../../../components/Loader";
import constants from "../../../../../constants";
import { useTheme } from "../../../../context/ThemeContext";
import { darkMode, lightMode } from "../../../../styles/mapStyles";
import { useLocation } from "../../../../context/LocationContext";
import { useMe } from "../../../../context/MeContext";

const View = styled.View``;
const ChatContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bgColor};
`;
const AddListContainer = styled.View`
  padding: 0 20px 0 20px;
  justify-content: space-between;
`;
const Text = styled.Text`
  color: ${props => props.theme.color};
`;
const Item = styled.View`
  flex-direction: row;
  align-items: flex-end;
  height: 40px;
  margin-top: 10px;
`;
const AddBtn = styled.TouchableOpacity`
  justify-content: center;
`;
const AddContainer = styled.View`
  width: ${constants.width - 40};
  height: 40px;
  justify-content: center;
  align-items: center;
  border: 0.5px solid #999;
  border-radius: 5px;
`;
const AddText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.color};
`;
const Footer = styled.View`
  margin-left: 20px;
  position: absolute;
  bottom: 25px;
  background-color: ${props => props.theme.bgColor};
`;
const IconContainer = styled.View`
  width: 50px;
  margin-right: 10px;
`;
const AddItemTouchable = styled.TouchableOpacity`
  justify-content: center;
  margin-left: 10px;
`;
const AddItemView = styled.View`
  width: 40px;
  height: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 0.5px solid #999;
  border-radius: 5px;
  padding: 2px;
`;
const AddItemText = styled.Text`
  color: #999;
  text-align: center;
  font-size: 10px;
`;
const MarkerContainer = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  background-color: transparent;
`;
const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const MapText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 500;
  opacity: 1;
`;
const AddHoldItemView = styled.View`
  justify-content: center;
  margin-left: 10px;
  opacity: 0.2;
`;
const MapBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 40px;
  margin: 5px;
  border: 0.5px solid #999;
  border-radius: 5px;
  opacity: 0.65;
  background-color: #96abbf;
`;
const ScrollView = styled.ScrollView``;
interface IProps {
  userId: string;
  mapModalOpen: boolean;
  snsModalOpen: boolean;
  loading: boolean;
  messages: any;
  onSend: any;
  onSendLocation: any;
  renderCustomView: any;
  renderActions: any;
  closeMapModal: () => void;
  messageFooter: (timeProps: any) => void;
  renderAvatar: any;
  closeSnsModal: () => void;
  openSnsModal: () => void;
}

const ChatPresenter: React.FunctionComponent<IProps> = ({
  userId,
  mapModalOpen,
  snsModalOpen,
  loading,
  messages,
  onSend,
  onSendLocation,
  renderCustomView,
  renderActions,
  closeMapModal,
  messageFooter,
  renderAvatar,
  closeSnsModal,
  openSnsModal
}) => {
  let mapRef: MapView | null;
  const { me } = useMe();
  const isDarkMode = useTheme();
  const location = useLocation();
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = 0.01;
  const [snsAddMode, setSnsAddMode] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [region, setRegion] = useState({
    latitude: location.currentLat,
    longitude: location.currentLng,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });
  const [sendInstagram, setSendInstagram] = useState<string>(
    me.user.profile.sendInstagram ? me.user.profile.sendInstagram : ""
  );
  const [sendPhone, setSendPhone] = useState<string>(
    me.user.profile.sendPhone ? me.user.profile.sendPhone : ""
  );
  const [sendEmail, setSendEmail] = useState<string>(
    me.user.profile.sendEmail ? me.user.profile.sendEmail : ""
  );
  const [sendKakao, setSendKakao] = useState<string>(
    me.user.profile.sendKakao ? me.user.profile.sendKakao : ""
  );
  const [sendFacebook, setSendFacebook] = useState<string>(
    me.user.profile.sendFacebook ? me.user.profile.sendFacebook : ""
  );
  const [sendSnapchat, setSendSnapchat] = useState<string>(
    me.user.profile.sendSnapchat ? me.user.profile.sendSnapchat : ""
  );
  const [sendLine, setSendLine] = useState<string>(
    me.user.profile.sendLine ? me.user.profile.sendLine : ""
  );
  const [sendWechat, setSendWechat] = useState<string>(
    me.user.profile.sendWechat ? me.user.profile.sendWechat : ""
  );
  const [sendKik, setSendKik] = useState<string>(
    me.user.profile.sendKik ? me.user.profile.sendKik : ""
  );
  const [sendVk, setSendVk] = useState<string>(
    me.user.profile.sendVk ? me.user.profile.sendVk : ""
  );
  const [sendWhatsapp, setSendWhatsapp] = useState<string>(
    me.user.profile.sendWhatsapp ? me.user.profile.sendWhatsapp : ""
  );
  const onInputTextChange = (text, state) => {
    const replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>0-9\/.\`:\"\\,\[\]?|{}]/gi;
    const item = text
      .replace(/^\s\s*/, "")
      .replace(/\s\s*$/, "")
      .replace(replaceChar, "")
      .replace(/[^a-z|^A-Z|^0-9]/, "");
    if (state === "sendInstagram") {
      setSendInstagram(item);
    } else if (state === "sendPhone") {
      setSendPhone(item);
    } else if (state === "sendEmail") {
      setSendEmail(item);
    } else if (state === "sendKakao") {
      setSendKakao(item);
    } else if (state === "sendFacebook") {
      setSendFacebook(item);
    } else if (state === "sendSnapchat") {
      setSendSnapchat(item);
    } else if (state === "sendLine") {
      setSendLine(item);
    } else if (state === "sendWechat") {
      setSendWechat(item);
    } else if (state === "sendKik") {
      setSendKik(item);
    } else if (state === "sendVk") {
      setSendVk(item);
    } else if (state === "sendWhatsapp") {
      setSendWhatsapp(item);
    } else {
      return null;
    }
  };
  const onMapReady = () => {
    if (!ready) {
      setReady(true);
    }
  };
  const onRegionChangeComplete = region => {
    setRegion(region);
  };
  const handleGeoSuccess = (position: Position) => {
    const {
      coords: { latitude, longitude }
    } = position;
    setRegion({
      latitude,
      longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    });
  };
  const handleGeoError = () => {
    console.log("No location");
  };
  const renderComposer = props => <Composer {...props} />;
  const renderSend = props => (
    <Send {...props}>
      <View
        style={{
          top: -2,
          backgroundColor: "transparent",
          height: 40,
          width: 40,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <FontAwesome name="send" size={22} color="#999" />
      </View>
    </Send>
  );
  const renderInputToolbar = props => {
    return (
      <InputToolbar
        textInputStyle={{
          color: isDarkMode ? "white" : "black"
        }}
        containerStyle={{
          backgroundColor: isDarkMode ? "#212121" : "#e6e6e6",
          height: 45
        }}
        {...props}
      >
        {renderSend(props)}
        {renderComposer(props)}
      </InputToolbar>
    );
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
    setSendInstagram("");
    setSendPhone("");
    setSendEmail("");
    setSendKakao("");
    setSendFacebook("");
    setSendSnapchat("");
    setSendLine("");
    setSendWechat("");
    setSendKik("");
    setSendVk("");
    setSendWhatsapp("");
  }, []);
  if (loading) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  } else {
    return (
      <>
        <Modal
          style={{ margin: 0, justifyContent: "center" }}
          isVisible={snsModalOpen}
          backdropColor={
            isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
          }
          onBackdropPress={() =>
            snsAddMode ? setSnsAddMode(false) : closeSnsModal()
          }
          onBackButtonPress={() =>
            Platform.OS !== "ios" && snsAddMode
              ? setSnsAddMode(false)
              : closeSnsModal()
          }
          onModalHide={() =>
            snsAddMode ? setSnsAddMode(false) : closeSnsModal()
          }
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.95}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={200}
        >
          {console.log(me.user.profile)}
          {!snsAddMode ? (
            <>
              <Text>sendInstagram</Text>
              {me.user.profile.sendInstagram && (
                <Text>sendInstagram{sendInstagram}</Text>
              )}
              {me.user.profile.sendPhone && <Text>sendPhone{sendPhone}</Text>}
              {me.user.profile.sendEmail && <Text>sendEmail{sendEmail}</Text>}
              {me.user.profile.sendKakao && <Text>sendKakao{sendKakao}</Text>}
              {me.user.profile.sendFacebook && (
                <Text>sendFacebook{sendFacebook}</Text>
              )}
              {me.user.profile.sendSnapchat && (
                <Text>sendSnapchat{sendSnapchat}</Text>
              )}
              {me.user.profile.sendLine && <Text>sendLine{sendLine}</Text>}
              {me.user.profile.sendWechat && (
                <Text>sendWechat{sendWechat}</Text>
              )}
              {me.user.profile.sendKik && <Text>sendKik{sendKik}</Text>}
              {me.user.profile.sendVk && <Text>sendVk{sendVk}</Text>}
              {me.user.profile.sendWhatsapp && (
                <Text>sendWhatsapp{sendWhatsapp}</Text>
              )}
              <Footer>
                <AddBtn onPress={() => setSnsAddMode(true)}>
                  <AddContainer>
                    <AddText>ADD SNS</AddText>
                  </AddContainer>
                </AddBtn>
              </Footer>
            </>
          ) : (
            <>
              <KeyboardAvoidingView
                enabled
                behavior={Platform.OS === "ios" ? "padding" : false}
                style={{ flex: 1 }}
              >
                <ScrollView
                  keyboardShouldPersistTaps={"always"}
                  keyboardDismissMode={
                    Platform.OS === "ios" ? "interactive" : "on-drag"
                  }
                >
                  <AddListContainer>
                    {!me.user.profile.sendInstagram && (
                      <Item>
                        <IconContainer>
                          <Text>sendInstagram</Text>
                        </IconContainer>
                        <TextInput
                          style={{
                            width: constants.width - 150,
                            backgroundColor: "transparent",
                            borderBottomWidth: 1,
                            borderBottomColor: "#999",
                            color: "#999",
                            fontSize: 22,
                            padding: 5,
                            textAlign: "center"
                          }}
                          value={sendInstagram}
                          returnKeyType="done"
                          onChangeText={text =>
                            onInputTextChange(text, "sendInstagram")
                          }
                          autoCorrect={false}
                        />
                        {sendInstagram.length !== 0 && (
                          <AddItemTouchable
                            onPress={() => console.log("nasnannai")}
                          >
                            <AddItemView>
                              <AddItemText>ADD</AddItemText>
                            </AddItemView>
                          </AddItemTouchable>
                        )}
                      </Item>
                    )}
                    {!me.user.profile.sendPhone && (
                      <Item>
                        <IconContainer>
                          <Text>sendPhone</Text>
                        </IconContainer>
                        <TextInput
                          style={{
                            width: constants.width - 150,
                            backgroundColor: "transparent",
                            borderBottomWidth: 1,
                            borderBottomColor: "#999",
                            color: "#999",
                            fontSize: 22,
                            padding: 5,
                            textAlign: "center"
                          }}
                          value={sendPhone}
                          returnKeyType="done"
                          onChangeText={text =>
                            onInputTextChange(text, "sendPhone")
                          }
                          autoCorrect={false}
                        />
                        {sendPhone.length !== 0 && (
                          <AddItemTouchable
                            onPress={() => console.log("nasnannai")}
                          >
                            <AddItemView>
                              <AddItemText>ADD</AddItemText>
                            </AddItemView>
                          </AddItemTouchable>
                        )}
                      </Item>
                    )}
                    {!me.user.profile.sendEmail && (
                      <Item>
                        <IconContainer>
                          <Text>sendEmail</Text>
                        </IconContainer>
                        <TextInput
                          style={{
                            width: constants.width - 150,
                            backgroundColor: "transparent",
                            borderBottomWidth: 1,
                            borderBottomColor: "#999",
                            color: "#999",
                            fontSize: 22,
                            padding: 5,
                            textAlign: "center"
                          }}
                          value={sendEmail}
                          returnKeyType="done"
                          onChangeText={text =>
                            onInputTextChange(text, "sendEmail")
                          }
                          autoCorrect={false}
                        />
                        {sendEmail.length !== 0 && (
                          <AddItemTouchable
                            onPress={() => console.log("nasnannai")}
                          >
                            <AddItemView>
                              <AddItemText>ADD</AddItemText>
                            </AddItemView>
                          </AddItemTouchable>
                        )}
                      </Item>
                    )}
                    {!me.user.profile.sendKakao && (
                      <Item>
                        <IconContainer>
                          <Text>sendKakao</Text>
                        </IconContainer>
                        <TextInput
                          style={{
                            width: constants.width - 150,
                            backgroundColor: "transparent",
                            borderBottomWidth: 1,
                            borderBottomColor: "#999",
                            color: "#999",
                            fontSize: 22,
                            padding: 5,
                            textAlign: "center"
                          }}
                          value={sendKakao}
                          returnKeyType="done"
                          onChangeText={text =>
                            onInputTextChange(text, "sendKakao")
                          }
                          autoCorrect={false}
                        />
                        {sendKakao.length !== 0 && (
                          <AddItemTouchable
                            onPress={() => console.log("nasnannai")}
                          >
                            <AddItemView>
                              <AddItemText>ADD</AddItemText>
                            </AddItemView>
                          </AddItemTouchable>
                        )}
                      </Item>
                    )}
                    {!me.user.profile.sendFacebook && (
                      <Item>
                        <IconContainer>
                          <Text>sendFacebook</Text>
                        </IconContainer>
                        <TextInput
                          style={{
                            width: constants.width - 150,
                            backgroundColor: "transparent",
                            borderBottomWidth: 1,
                            borderBottomColor: "#999",
                            color: "#999",
                            fontSize: 22,
                            padding: 5,
                            textAlign: "center"
                          }}
                          value={sendFacebook}
                          returnKeyType="done"
                          onChangeText={text =>
                            onInputTextChange(text, "sendFacebook")
                          }
                          autoCorrect={false}
                        />
                        {sendFacebook.length !== 0 && (
                          <AddItemTouchable
                            onPress={() => console.log("nasnannai")}
                          >
                            <AddItemView>
                              <AddItemText>ADD</AddItemText>
                            </AddItemView>
                          </AddItemTouchable>
                        )}
                      </Item>
                    )}
                    {!me.user.profile.sendSnapchat && (
                      <Item>
                        <IconContainer>
                          <Text>sendSnapchat</Text>
                        </IconContainer>
                        <TextInput
                          style={{
                            width: constants.width - 150,
                            backgroundColor: "transparent",
                            borderBottomWidth: 1,
                            borderBottomColor: "#999",
                            color: "#999",
                            fontSize: 22,
                            padding: 5,
                            textAlign: "center"
                          }}
                          value={sendSnapchat}
                          returnKeyType="done"
                          onChangeText={text =>
                            onInputTextChange(text, "sendSnapchat")
                          }
                          autoCorrect={false}
                        />
                        {sendSnapchat.length !== 0 && (
                          <AddItemTouchable
                            onPress={() => console.log("nasnannai")}
                          >
                            <AddItemView>
                              <AddItemText>ADD</AddItemText>
                            </AddItemView>
                          </AddItemTouchable>
                        )}
                      </Item>
                    )}
                    {!me.user.profile.sendLine && (
                      <Item>
                        <IconContainer>
                          <Text>sendLine</Text>
                        </IconContainer>
                        <TextInput
                          style={{
                            width: constants.width - 150,
                            backgroundColor: "transparent",
                            borderBottomWidth: 1,
                            borderBottomColor: "#999",
                            color: "#999",
                            fontSize: 22,
                            padding: 5,
                            textAlign: "center"
                          }}
                          value={sendLine}
                          returnKeyType="done"
                          onChangeText={text =>
                            onInputTextChange(text, "sendLine")
                          }
                          autoCorrect={false}
                        />
                        {sendLine.length !== 0 && (
                          <AddItemTouchable
                            onPress={() => console.log("nasnannai")}
                          >
                            <AddItemView>
                              <AddItemText>ADD</AddItemText>
                            </AddItemView>
                          </AddItemTouchable>
                        )}
                      </Item>
                    )}
                    {!me.user.profile.sendWechat && (
                      <Item>
                        <IconContainer>
                          <Text>sendWechat</Text>
                        </IconContainer>
                        <TextInput
                          style={{
                            width: constants.width - 150,
                            backgroundColor: "transparent",
                            borderBottomWidth: 1,
                            borderBottomColor: "#999",
                            color: "#999",
                            fontSize: 22,
                            padding: 5,
                            textAlign: "center"
                          }}
                          value={sendWechat}
                          returnKeyType="done"
                          onChangeText={text =>
                            onInputTextChange(text, "sendWechat")
                          }
                          autoCorrect={false}
                        />
                        {sendWechat.length !== 0 && (
                          <AddItemTouchable
                            onPress={() => console.log("nasnannai")}
                          >
                            <AddItemView>
                              <AddItemText>ADD</AddItemText>
                            </AddItemView>
                          </AddItemTouchable>
                        )}
                      </Item>
                    )}
                    {!me.user.profile.sendKik && (
                      <Item>
                        <IconContainer>
                          <Text>sendKik</Text>
                        </IconContainer>
                        <TextInput
                          style={{
                            width: constants.width - 150,
                            backgroundColor: "transparent",
                            borderBottomWidth: 1,
                            borderBottomColor: "#999",
                            color: "#999",
                            fontSize: 22,
                            padding: 5,
                            textAlign: "center"
                          }}
                          value={sendKik}
                          returnKeyType="done"
                          onChangeText={text =>
                            onInputTextChange(text, "sendKik")
                          }
                          autoCorrect={false}
                        />
                        {sendKik.length !== 0 && (
                          <AddItemTouchable
                            onPress={() => console.log("nasnannai")}
                          >
                            <AddItemView>
                              <AddItemText>ADD</AddItemText>
                            </AddItemView>
                          </AddItemTouchable>
                        )}
                      </Item>
                    )}
                    {!me.user.profile.sendVk && (
                      <Item>
                        <IconContainer>
                          <Text>sendVk</Text>
                        </IconContainer>
                        <TextInput
                          style={{
                            width: constants.width - 150,
                            backgroundColor: "transparent",
                            borderBottomWidth: 1,
                            borderBottomColor: "#999",
                            color: "#999",
                            fontSize: 22,
                            padding: 5,
                            textAlign: "center"
                          }}
                          value={sendVk}
                          returnKeyType="done"
                          onChangeText={text =>
                            onInputTextChange(text, "sendVk")
                          }
                          autoCorrect={false}
                        />
                        {sendVk.length !== 0 && (
                          <AddItemTouchable
                            onPress={() => console.log("nasnannai")}
                          >
                            <AddItemView>
                              <AddItemText>ADD</AddItemText>
                            </AddItemView>
                          </AddItemTouchable>
                        )}
                      </Item>
                    )}
                    {!me.user.profile.sendWhatsapp && (
                      <Item>
                        <IconContainer>
                          <Text>sendWhatsapp</Text>
                        </IconContainer>
                        <TextInput
                          style={{
                            width: constants.width - 150,
                            backgroundColor: "transparent",
                            borderBottomWidth: 1,
                            borderBottomColor: "#999",
                            color: "#999",
                            fontSize: 22,
                            padding: 5,
                            textAlign: "center"
                          }}
                          value={sendWhatsapp}
                          returnKeyType="done"
                          onChangeText={text =>
                            onInputTextChange(text, "sendWhatsapp")
                          }
                          autoCorrect={false}
                        />
                        {sendWhatsapp.length !== 0 ? (
                          <AddItemTouchable
                            onPress={() => console.log("nasnannai")}
                          >
                            <AddItemView>
                              <AddItemText>ADD</AddItemText>
                            </AddItemView>
                          </AddItemTouchable>
                        ) : (
                          <AddHoldItemView
                            onPress={() => console.log("nasnannai")}
                          >
                            <AddItemView>
                              <AddItemText>ADD</AddItemText>
                            </AddItemView>
                          </AddHoldItemView>
                        )}
                      </Item>
                    )}
                  </AddListContainer>
                </ScrollView>
              </KeyboardAvoidingView>
              <Footer>
                <AddBtn onPress={() => setSnsAddMode(false)}>
                  <AddContainer>
                    <AddText>DONE</AddText>
                  </AddContainer>
                </AddBtn>
              </Footer>
            </>
          )}
        </Modal>
        <MapModal visible={mapModalOpen} transparent={true}>
          <MapView
            ref={map => {
              mapRef = map;
            }}
            provider={PROVIDER_GOOGLE}
            style={{
              borderRadius: 5,
              height: constants.height
            }}
            initialRegion={region}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onMapReady={onMapReady}
            loadingEnabled={true}
            rotateEnabled={false}
            onRegionChangeComplete={onRegionChangeComplete}
            customMapStyle={
              isDarkMode && isDarkMode === true ? darkMode : lightMode
            }
          />
          <MarkerContainer pointerEvents="none">
            <Ionicons
              name={Platform.OS === "ios" ? "ios-pin" : "md-pin"}
              size={40}
              color={"#3897f0"}
              pointerEvents="none"
              containerStyle={{ marginBottom: 30 }}
            />
          </MarkerContainer>
          <View
            style={{
              bottom: 20,
              position: "absolute",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: constants.width,
              paddingRight: 10,
              paddingLeft: 10,
              marginBottom: 0
            }}
          >
            <MapBtn onPress={() => closeMapModal()}>
              <MapText>BACK</MapText>
            </MapBtn>
            <MapBtn
              onPress={() => onSendLocation(region.latitude, region.longitude)}
            >
              <MapText>SEND</MapText>
            </MapBtn>
          </View>
        </MapModal>
        <ChatContainer>
          {Platform.OS === "android" ? (
            <SafeAreaView style={{ flex: 1 }}>
              <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                  _id: userId
                }}
                renderCustomView={renderCustomView}
                renderActions={renderActions}
                //@ts-ignore
                renderTime={messageFooter}
                renderAvatar={renderAvatar}
                isAnimated
                scrollToBottom
                alwaysShowSend
                submitOnReturn
                placeholderTextColor={"#999"}
                renderInputToolbar={renderInputToolbar}
                renderSend={renderSend}
                // keyboardShouldPersistTaps={"handled"}
                minInputToolbarHeight={45}
              />
              <KeyboardSpacer />
            </SafeAreaView>
          ) : (
            <SafeAreaView style={{ flex: 1 }}>
              <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                  _id: userId
                }}
                renderCustomView={renderCustomView}
                renderActions={renderActions}
                //@ts-ignore
                renderTime={messageFooter}
                renderAvatar={renderAvatar}
                isAnimated
                scrollToBottom
                alwaysShowSend
                submitOnReturn
                placeholderTextColor={"#999"}
                renderInputToolbar={renderInputToolbar}
                renderSend={renderSend}
                // keyboardShouldPersistTaps={"handled"}
                minInputToolbarHeight={45}
              />
            </SafeAreaView>
          )}
        </ChatContainer>
      </>
    );
  }
};

export default ChatPresenter;
