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
import { useMutation } from "react-apollo";
import { UPDATE_SNS } from "./ChatQueries";
import { UpdateSns, UpdateSnsVariables, Me } from "../../../../types/api";
import { ME } from "../../../../sharedQueries";

const View = styled.View``;
const ChatContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bgColor};
`;
const AddListContainer = styled.View`
  padding: 30px 20px 40px 20px;
  justify-content: space-between;
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
const ItemTouchable = styled.TouchableOpacity``;
const AddItemView = styled.View`
  width: 40px;
  height: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 0.5px solid ${props => props.theme.shadowColor};
  border-radius: 5px;
  padding: 2px;
  margin-left: 10px;
`;
const AddItemText = styled.Text`
  color: ${props => props.theme.shadowColor};
  text-align: center;
  font-size: 10px;
`;
const EditItemText = styled(AddItemText)`
  color: #999;
`;
const EditItemView = styled(AddItemView)`
  border: 0.5px solid #999;
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
const Image = styled.Image`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;
const SNSText = styled.Text`
  font-size: 22px;
  padding: 5px;
  color: #999;

  text-align: center;
`;
const SNSTextContainer = styled.View`
  width: ${constants.width - 140};
  border-bottom-width: 0.5px;
  border-bottom-color: #999;
`;

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
    me.user.profile.sendInstagram && me.user.profile.sendInstagram.length > 0
      ? me.user.profile.sendInstagram
      : ""
  );
  const [isChangedSendInstagram, setIsChangedSendInstagram] = useState<boolean>(
    false
  );
  const [sendPhone, setSendPhone] = useState<string>(
    me.user.profile.sendPhone && me.user.profile.sendPhone.length > 0
      ? me.user.profile.sendPhone
      : ""
  );
  const [isChangedSendPhone, setIsChangedSendPhone] = useState<boolean>(false);
  const [sendEmail, setSendEmail] = useState<string>(
    me.user.profile.sendEmail && me.user.profile.sendEmail.length > 0
      ? me.user.profile.sendEmail
      : ""
  );
  const [isChangedSendEmail, setIsChangedSendEmail] = useState<boolean>(false);
  const [sendKakao, setSendKakao] = useState<string>(
    me.user.profile.sendKakao && me.user.profile.sendKakao.length > 0
      ? me.user.profile.sendKakao
      : ""
  );
  const [isChangedSendKakao, setIsChangedSendKakao] = useState<boolean>(false);
  const [sendFacebook, setSendFacebook] = useState<string>(
    me.user.profile.sendFacebook && me.user.profile.sendFacebook.length > 0
      ? me.user.profile.sendFacebook
      : ""
  );
  const [isChangedSendFacebook, setIsChangedSendFacebook] = useState<boolean>(
    false
  );
  const [sendYoutube, setSendYoutube] = useState<string>(
    me.user.profile.sendYoutube && me.user.profile.sendYoutube.length > 0
      ? me.user.profile.sendYoutube
      : ""
  );
  const [isChangedSendYoutube, setIsChangedSendYoutube] = useState<boolean>(
    false
  );
  const [sendTwitter, setSendTwitter] = useState<string>(
    me.user.profile.sendTwitter && me.user.profile.sendTwitter.length > 0
      ? me.user.profile.sendTwitter
      : ""
  );
  const [isChangedSendTwitter, setIsChangedSendTwitter] = useState<boolean>(
    false
  );
  const [sendTelegram, setSendTelegram] = useState<string>(
    me.user.profile.sendTelegram && me.user.profile.sendTelegram.length > 0
      ? me.user.profile.sendTelegram
      : ""
  );
  const [isChangedSendTelegram, setIsChangedSendTelegram] = useState<boolean>(
    false
  );
  const [sendSnapchat, setSendSnapchat] = useState<string>(
    me.user.profile.sendSnapchat && me.user.profile.sendSnapchat.length > 0
      ? me.user.profile.sendSnapchat
      : ""
  );
  const [isChangedSendSnapchat, setIsChangedSendSnapchat] = useState<boolean>(
    false
  );
  const [sendLine, setSendLine] = useState<string>(
    me.user.profile.sendLine && me.user.profile.sendLine.length > 0
      ? me.user.profile.sendLine
      : ""
  );
  const [isChangedSendLine, setIsChangedSendLine] = useState<boolean>(false);
  const [sendWechat, setSendWechat] = useState<string>(
    me.user.profile.sendWechat && me.user.profile.sendWechat.length > 0
      ? me.user.profile.sendWechat
      : ""
  );
  const [isChangedSendWechat, setIsChangedSendWechat] = useState<boolean>(
    false
  );
  const [sendKik, setSendKik] = useState<string>(
    me.user.profile.sendKik && me.user.profile.sendKik.length > 0
      ? me.user.profile.sendKik
      : ""
  );
  const [isChangedSendKik, setIsChangedSendKik] = useState<boolean>(false);
  const [sendVk, setSendVk] = useState<string>(
    me.user.profile.sendVk && me.user.profile.sendVk.length > 0
      ? me.user.profile.sendVk
      : ""
  );
  const [isChangedSendVk, setIsChangedSendVk] = useState<boolean>(false);
  const [sendWhatsapp, setSendWhatsapp] = useState<string>(
    me.user.profile.sendWhatsapp && me.user.profile.sendWhatsapp.length > 0
      ? me.user.profile.sendWhatsapp
      : ""
  );
  const [isChangedSendWhatsapp, setIsChangedSendWhatsapp] = useState<boolean>(
    false
  );
  const [sendBehance, setSendBehance] = useState<string>(
    me.user.profile.sendBehance && me.user.profile.sendBehance.length > 0
      ? me.user.profile.sendBehance
      : ""
  );
  const [isChangedSendBehance, setIsChangedSendBehance] = useState<boolean>(
    false
  );
  const [sendLinkedin, setSendLinkedin] = useState<string>(
    me.user.profile.sendLinkedin && me.user.profile.sendLinkedin.length > 0
      ? me.user.profile.sendLinkedin
      : ""
  );
  const [isChangedSendLinkedin, setIsChangedSendLinkedin] = useState<boolean>(
    false
  );
  const [sendPinterest, setSendPinterest] = useState<string>(
    me.user.profile.sendPinterest && me.user.profile.sendPinterest.length > 0
      ? me.user.profile.sendPinterest
      : ""
  );
  const [isChangedSendPinterest, setIsChangedSendPinterest] = useState<boolean>(
    false
  );
  const [sendVine, setSendVine] = useState<string>(
    me.user.profile.sendVine && me.user.profile.sendVine.length > 0
      ? me.user.profile.sendVine
      : ""
  );
  const [isChangedSendVine, setIsChangedSendVine] = useState<boolean>(false);
  const [sendTumblr, setSendTumblr] = useState<string>(
    me.user.profile.sendTumblr && me.user.profile.sendTumblr.length > 0
      ? me.user.profile.sendTumblr
      : ""
  );
  const [isChangedSendTumblr, setIsChangedSendTumblr] = useState<boolean>(
    false
  );

  const [updateSnsFn, { loading: updateSnsLoading }] = useMutation<
    UpdateSns,
    UpdateSnsVariables
  >(UPDATE_SNS, {
    update(cache, { data: { updateSns } }) {
      try {
        const data = cache.readQuery<Me>({
          query: ME
        });
        if (data) {
          data.me.user.profile.sendInstagram =
            updateSns.user.profile.sendInstagram;
          data.me.user.profile.sendPhone = updateSns.user.profile.sendPhone;
          data.me.user.profile.sendEmail = updateSns.user.profile.sendEmail;
          data.me.user.profile.sendKakao = updateSns.user.profile.sendKakao;
          data.me.user.profile.sendFacebook =
            updateSns.user.profile.sendFacebook;
          data.me.user.profile.sendSnapchat =
            updateSns.user.profile.sendSnapchat;
          data.me.user.profile.sendLine = updateSns.user.profile.sendLine;
          data.me.user.profile.sendWechat = updateSns.user.profile.sendWechat;
          data.me.user.profile.sendKik = updateSns.user.profile.sendKik;
          data.me.user.profile.sendVk = updateSns.user.profile.sendVk;
          data.me.user.profile.sendWhatsapp =
            updateSns.user.profile.sendWhatsapp;
          data.me.user.profile.sendYoutube = updateSns.user.profile.sendYoutube;
          data.me.user.profile.sendTwitter = updateSns.user.profile.sendTwitter;
          data.me.user.profile.sendTelegram =
            updateSns.user.profile.sendTelegram;
          data.me.user.profile.sendBehance = updateSns.user.profile.sendBehance;
          data.me.user.profile.sendLinkedin =
            updateSns.user.profile.sendLinkedin;
          data.me.user.profile.sendPinterest =
            updateSns.user.profile.sendPinterest;
          data.me.user.profile.sendVine = updateSns.user.profile.sendVine;
          data.me.user.profile.sendTumblr = updateSns.user.profile.sendTumblr;
          cache.writeQuery({
            query: ME,
            data
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
  const onInputTextChange = (text, state) => {
    console.log("text", text, state);
    const replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>0-9\/.\`:\"\\,\[\]?|{}]/gi;
    const item = text
      .replace(/^\s\s*/, "")
      .replace(/\s\s*$/, "")
      .replace(replaceChar, "")
      .replace(/[^a-z|^A-Z|^0-9]/, "");
    if (state === "INSTAGRAM") {
      setIsChangedSendInstagram(me.user.profile.sendInstagram !== sendInstagram);
      setSendInstagram(item);
    } else if (state === "PHONE") {
      setIsChangedSendPhone(me.user.profile.sendPhone !== sendPhone);
      setSendPhone(item);
    } else if (state === "EMAIL") {
      setIsChangedSendEmail(me.user.profile.sendEmail !== sendEmail);
      setSendEmail(item);
    } else if (state === "KAKAOTALK") {
      setIsChangedSendKakao(me.user.profile.sendKakao !== sendKakao);
      setSendKakao(item);
    } else if (state === "FACEBOOK") {
      setIsChangedSendFacebook(me.user.profile.sendFacebook !== sendFacebook);
      setSendFacebook(item);
    } else if (state === "YOUTUBE") {
      setIsChangedSendYoutube(me.user.profile.sendYoutube !== sendYoutube);
      setSendYoutube(item);
    } else if (state === "TWITTER") {
      setIsChangedSendTwitter(me.user.profile.sendTwitter !== sendTwitter);
      setSendTwitter(item);
    } else if (state === "TELEGRAM") {
      setIsChangedSendTelegram(me.user.profile.sendTelegram !== sendTelegram);
      setSendTelegram(item);
    } else if (state === "SNAPCHAT") {
      setIsChangedSendSnapchat(me.user.profile.sendSnapchat !== sendSnapchat);
      setSendSnapchat(item);
    } else if (state === "LINE") {
      setIsChangedSendLine(me.user.profile.sendLine !== sendLine);
      setSendLine(item);
    } else if (state === "WECHAT") {
      setIsChangedSendWechat(me.user.profile.sendWechat !== sendWechat);
      setSendWechat(item);
    } else if (state === "KIK") {
      setIsChangedSendKik(me.user.profile.sendKik !== sendKik);
      setSendKik(item);
    } else if (state === "VK") {
      setIsChangedSendVk(me.user.profile.sendVk !== sendVk);
      setSendVk(item);
    } else if (state === "WHATSAPP") {
      setIsChangedSendWhatsapp(me.user.profile.sendWhatsapp !== sendWhatsapp);
      setSendWhatsapp(item);
    } else if (state === "BEHANCE") {
      setIsChangedSendBehance(me.user.profile.sendBehance !== sendBehance);
      setSendBehance(item);
    } else if (state === "LINKEDIN") {
      setIsChangedSendLinkedin(me.user.profile.sendLinkedin !== sendLinkedin);
      setSendLinkedin(item);
    } else if (state === "PINTEREST") {
      setIsChangedSendPinterest(me.user.profile.sendPinterest !== sendPinterest);
      setSendPinterest(item);
    } else if (state === "VINE") {
      setIsChangedSendVine(me.user.profile.sendVine !== sendVine);
      setSendVine(item);
    } else if (state === "TUMBLR") {
      setIsChangedSendTumblr(me.user.profile.sendTumblr !== sendTumblr);
      setSendTumblr(item);
    } else {
      return null;
    }
  };
  const snsList = [
    {
      value: sendInstagram,
      payload: "INSTAGRAM",
      image: require("../../../../../assets/instagram.png"),
      meData: me.user.profile.sendInstagram,
      isChanged: isChangedSendInstagram,
      setIsChanged: () => setIsChangedSendInstagram(false)
    },
    {
      value: sendPhone,
      payload: "PHONE",
      image: require("../../../../../assets/phone.png"),
      meData: me.user.profile.sendPhone,
      isChanged: isChangedSendPhone,
      setIsChanged: () => setIsChangedSendPhone(false)
    },
    {
      value: sendEmail,
      payload: "EMAIL",
      image: require("../../../../../assets/email.png"),
      meData: me.user.profile.sendEmail,
      isChanged: isChangedSendEmail,
      setIsChanged: () => setIsChangedSendEmail(false)
    },
    {
      value: sendKakao,
      payload: "KAKAOTALK",
      image: require("../../../../../assets/kakao.png"),
      meData: me.user.profile.sendKakao,
      isChanged: isChangedSendKakao,
      setIsChanged: () => setIsChangedSendKakao(false)
    },
    {
      value: sendFacebook,
      payload: "FACEBOOK",
      image: require("../../../../../assets/facebook.png"),
      meData: me.user.profile.sendFacebook,
      isChanged: isChangedSendFacebook,
      setIsChanged: () => setIsChangedSendFacebook(false)
    },
    {
      value: sendYoutube,
      payload: "YOUTUBE",
      image: require("../../../../../assets/youtube.png"),
      meData: me.user.profile.sendYoutube,
      isChanged: isChangedSendYoutube,
      setIsChanged: () => setIsChangedSendYoutube(false)
    },
    {
      value: sendTwitter,
      payload: "TWITTER",
      image: require("../../../../../assets/twitter.png"),
      meData: me.user.profile.sendTwitter,
      isChanged: isChangedSendTwitter,
      setIsChanged: () => setIsChangedSendTwitter(false)
    },
    {
      value: sendTelegram,
      payload: "TELEGRAM",
      image: require("../../../../../assets/telegram.png"),
      meData: me.user.profile.sendTelegram,
      isChanged: isChangedSendTelegram,
      setIsChanged: () => setIsChangedSendTelegram(false)
    },
    {
      value: sendSnapchat,
      payload: "SNAPCHAT",
      image: require("../../../../../assets/snapchat.png"),
      meData: me.user.profile.sendSnapchat,
      isChanged: isChangedSendSnapchat,
      setIsChanged: () => setIsChangedSendSnapchat(false)
    },
    {
      value: sendLine,
      payload: "LINE",
      image: require("../../../../../assets/line.png"),
      meData: me.user.profile.sendLine,
      isChanged: isChangedSendLine,
      setIsChanged: () => setIsChangedSendLine(false)
    },
    {
      value: sendWechat,
      payload: "WECHAT",
      image: require("../../../../../assets/wechat.png"),
      meData: me.user.profile.sendWechat,
      isChanged: isChangedSendWechat,
      setIsChanged: () => setIsChangedSendWechat(false)
    },
    {
      value: sendKik,
      payload: "KIK",
      image: require("../../../../../assets/kik.png"),
      meData: me.user.profile.sendKik,
      isChanged: isChangedSendKik,
      setIsChanged: () => setIsChangedSendKik(false)
    },
    {
      value: sendVk,
      payload: "VK",
      image: require("../../../../../assets/vk.png"),
      meData: me.user.profile.sendVk,
      isChanged: isChangedSendVk,
      setIsChanged: () => setIsChangedSendVk(false)
    },
    {
      value: sendWhatsapp,
      payload: "WHATSAPP",
      image: require("../../../../../assets/whatsapp.png"),
      meData: me.user.profile.sendWhatsapp,
      isChanged: isChangedSendWhatsapp,
      setIsChanged: () => setIsChangedSendWhatsapp(false)
    },
    {
      value: sendBehance,
      payload: "BEHANCE",
      image: require("../../../../../assets/behance.png"),
      meData: me.user.profile.sendBehance,
      isChanged: isChangedSendBehance,
      setIsChanged: () => setIsChangedSendBehance(false)
    },
    {
      value: sendLinkedin,
      payload: "LINKEDIN",
      image: require("../../../../../assets/linkedin.png"),
      meData: me.user.profile.sendLinkedin,
      isChanged: isChangedSendLinkedin,
      setIsChanged: () => setIsChangedSendLinkedin(false)
    },
    {
      value: sendPinterest,
      payload: "PINTEREST",
      image: require("../../../../../assets/pinterest.png"),
      meData: me.user.profile.sendPinterest,
      isChanged: isChangedSendPinterest,
      setIsChanged: () => setIsChangedSendPinterest(false)
    },
    {
      value: sendVine,
      payload: "VINE",
      image: require("../../../../../assets/vine.png"),
      meData: me.user.profile.sendVine,
      isChanged: isChangedSendVine,
      setIsChanged: () => setIsChangedSendVine(false)
    },
    {
      value: sendTumblr,
      payload: "TUMBLR",
      image: require("../../../../../assets/tumblr.png"),
      meData: me.user.profile.sendTumblr,
      isChanged: isChangedSendTumblr,
      setIsChanged: () => setIsChangedSendTumblr(false)
    }
  ];

  const onPressSendSns = (
    payload: string,
    value: string,
    setIsChanged: () => void
  ) => {
    try {
      setIsChanged();
      updateSnsFn({
        variables: {
          payload: payload,
          username: value
        }
      });
    } catch (e) {
      console.log(e);
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
    setSnsAddMode(false);
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
          {!snsAddMode ? (
            <>
              <KeyboardAvoidingView
                enabled
                behavior={Platform.OS === "ios" ? "padding" : false}
                style={{ height: constants.height - 65 }}
              >
                <ScrollView
                  keyboardShouldPersistTaps={"always"}
                  keyboardDismissMode={
                    Platform.OS === "ios" ? "interactive" : "on-drag"
                  }
                >
                  <AddListContainer>
                    {snsList.map((snsItem, index) => {
                      <Item key={index}>
                        <Image resizeMode={"contain"} source={snsItem.image} />
                        <SNSTextContainer>
                          <SNSText>{snsItem.meData}</SNSText>
                        </SNSTextContainer>
                        <ItemTouchable
                          disabled={updateSnsLoading}
                          onPress={() => {
                            console.log("sendsend"), closeSnsModal();
                          }}
                        >
                          <EditItemView>
                            <EditItemText>SEND</EditItemText>
                          </EditItemView>
                        </ItemTouchable>
                      </Item>;
                    })}
                  </AddListContainer>
                </ScrollView>
              </KeyboardAvoidingView>
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
                style={{ height: constants.height - 65 }}
              >
                <ScrollView
                  keyboardShouldPersistTaps={"always"}
                  keyboardDismissMode={
                    Platform.OS === "ios" ? "interactive" : "on-drag"
                  }
                >
                  <AddListContainer>
                    {snsList.map((snsItem, index) => (
                      <Item key={index}>
                        <Image resizeMode={"contain"} source={snsItem.image} />
                        <TextInput
                          style={{
                            width: constants.width - 140,
                            backgroundColor: "transparent",
                            borderBottomWidth: 0.5,
                            borderBottomColor: "#999",
                            color: "#999",
                            fontSize: 22,
                            padding: 5,
                            textAlign: "center"
                          }}
                          placeholder={snsItem.payload}
                          placeholderTextColor={
                            isDarkMode
                              ? "rgba(55, 55, 55, 1)"
                              : "rgba(207, 207, 207, 0.6)"
                          }
                          value={snsItem.value}
                          returnKeyType="done"
                          onChangeText={text =>
                            onInputTextChange(text, snsItem.payload)
                          }
                          autoCorrect={false}
                        />
                        {snsItem.meData && snsItem.meData.length > 0 ? (
                          snsItem.isChanged ? (
                            <ItemTouchable
                              disabled={updateSnsLoading}
                              onPress={() =>
                                onPressSendSns(
                                  snsItem.payload,
                                  snsItem.value,
                                  snsItem.setIsChanged
                                )
                              }
                            >
                              <EditItemView>
                                <EditItemText>EDIT</EditItemText>
                              </EditItemView>
                            </ItemTouchable>
                          ) : (
                            <AddItemView>
                              <AddItemText>EDIT</AddItemText>
                            </AddItemView>
                          )
                        ) : snsItem.isChanged ? (
                          <ItemTouchable
                            disabled={updateSnsLoading}
                            onPress={() =>
                              updateSnsFn({
                                variables: {
                                  payload: snsItem.payload,
                                  username: snsItem.value
                                }
                              })
                            }
                          >
                            <EditItemView>
                              <EditItemText>ADD</EditItemText>
                            </EditItemView>
                          </ItemTouchable>
                        ) : (
                          <AddItemView>
                            <AddItemText>ADD</AddItemText>
                          </AddItemView>
                        )}
                      </Item>
                    ))}
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
