import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  GiftedChat,
  InputToolbar,
  Send,
  Composer,
} from "react-native-gifted-chat";
import Modal from "react-native-modal";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import {
  Platform,
  Modal as MapModal,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import Loader from "../../../../components/Loader";
import constants from "../../../../../constants";
import { useTheme } from "../../../../context/ThemeContext";
import { darkSendMode, lightSendMode } from "../../../../styles/mapStyles";
import { useMe } from "../../../../context/MeContext";
import { useMutation } from "react-apollo";
import { UPDATE_SNS } from "./ChatQueries";
import { UpdateSns, UpdateSnsVariables, Me } from "../../../../types/api";
import { ME } from "../../../../sharedQueries";

const View = styled.View``;

const EditView = styled.View``;

const AddView = styled.View`
  margin-bottom: 65px;
`;

const ChatContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
`;

const AddListContainer = styled.View`
  padding: 30px 20px 40px 20px;
`;

const Item = styled.View`
  flex-direction: row;
  align-items: flex-end;
  height: 40px;
  margin-top: 10px;
`;

const AddBtn = styled.TouchableOpacity`
  justify-content: center;
  width: ${(constants.width - 50) / 2};
  height: 40px;
  justify-content: center;
  align-items: center;
  border: 0.5px solid #999;
  border-radius: 5px;
  background-color: ${(props) => props.theme.bgColor};
`;

const EditBtn = styled.TouchableOpacity`
  justify-content: center;
  width: ${constants.width - 40};
  height: 40px;
  justify-content: center;
  align-items: center;
  border: 0.5px solid #999;
  border-radius: 5px;
  background-color: ${(props) => props.theme.bgColor};
`;

const AddText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.color};
`;

const Footer = styled.View`
  margin-left: 20px;
  position: absolute;
  bottom: 25px;
  justify-content: space-between;
  width: ${constants.width - 40};
  flex-direction: row;
`;

const AddBackBtn = styled.View`
  width: ${(constants.width - 50) / 2};
  height: 40px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.bgColor};
`;

const EditBackBtn = styled.View`
  width: ${constants.width - 40};
  height: 40px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.bgColor};
`;

const ItemTouchable = styled.TouchableOpacity``;

const AddItemView = styled.View`
  width: 40px;
  height: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 0.5px solid ${(props) => props.theme.shadowColor};
  border-radius: 5px;
  padding: 2px;
  margin-left: 10px;
`;

const AddItemText = styled.Text`
  color: ${(props) => props.theme.shadowColor};
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

const LoadingContainer = styled.View`
  background-color: ${(props) => props.theme.modalBgColor};
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const MapText = styled.Text`
  color: ${(props) => props.theme.color};
  font-size: 16px;
  font-weight: 500;
  opacity: 1;
`;

const MapBtn = styled.TouchableOpacity`
  justify-content: center;
  width: ${(constants.width - 50) / 2};
  height: 40px;
  justify-content: center;
  align-items: center;
  border: 0.5px solid #999;
  border-radius: 5px;
  background-color: ${(props) => props.theme.bgColor};
`;

const MapBackBtn = styled.View`
  width: ${(constants.width - 50) / 2};
  height: 40px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.bgColor};
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

const EmptyContainer = styled.View`
  height: 20px;
`;

const TextContainer = styled.View`
  margin-top: 15px;
  justify-content: center;
  align-items: center;
`;

const Text = styled.Text`
  color: ${(props) => props.theme.color};
  font-size: 8px;
  margin-left: 5px;
`;

interface IProps {
  userId: string;
  mapModalOpen: boolean;
  snsModalOpen: boolean;
  messages: any;
  onSend: any;
  onSendSnsId: any;
  onSendLocation: any;
  renderCustomView: any;
  renderActions: any;
  closeMapModal: () => void;
  messageFooter: (timeProps: any) => void;
  renderAvatar: any;
  closeSnsModal: () => void;
  region: any;
  onRegionChangeComplete: (region: any) => void;
  mapLoading: boolean;
}

const ChatPresenter: React.FunctionComponent<IProps> = ({
  userId,
  mapModalOpen,
  snsModalOpen,
  messages,
  onSend,
  onSendSnsId,
  onSendLocation,
  renderCustomView,
  renderActions,
  closeMapModal,
  messageFooter,
  renderAvatar,
  closeSnsModal,
  region,
  onRegionChangeComplete,
  mapLoading,
}) => {
  const { me, loading: meLoading } = useMe();
  const isDarkMode = useTheme();
  const [snsAddMode, setSnsAddMode] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [sendInstagram, setSendInstagram] = useState<string>(
    me.user.sendInstagram && me.user.sendInstagram.length > 0
      ? me.user.sendInstagram
      : ""
  );
  const [isChangedSendInstagram, setIsChangedSendInstagram] = useState<boolean>(
    false
  );
  const [sendPhone, setSendPhone] = useState<string>(
    me.user.sendPhone && me.user.sendPhone.length > 0 ? me.user.sendPhone : ""
  );
  const [isChangedSendPhone, setIsChangedSendPhone] = useState<boolean>(false);
  const [sendEmail, setSendEmail] = useState<string>(
    me.user.sendEmail && me.user.sendEmail.length > 0 ? me.user.sendEmail : ""
  );
  const [isChangedSendEmail, setIsChangedSendEmail] = useState<boolean>(false);
  const [sendKakao, setSendKakao] = useState<string>(
    me.user.sendKakao && me.user.sendKakao.length > 0 ? me.user.sendKakao : ""
  );
  const [isChangedSendKakao, setIsChangedSendKakao] = useState<boolean>(false);
  const [sendFacebook, setSendFacebook] = useState<string>(
    me.user.sendFacebook && me.user.sendFacebook.length > 0
      ? me.user.sendFacebook
      : ""
  );
  const [isChangedSendFacebook, setIsChangedSendFacebook] = useState<boolean>(
    false
  );
  const [sendYoutube, setSendYoutube] = useState<string>(
    me.user.sendYoutube && me.user.sendYoutube.length > 0
      ? me.user.sendYoutube
      : ""
  );
  const [isChangedSendYoutube, setIsChangedSendYoutube] = useState<boolean>(
    false
  );
  const [sendTwitter, setSendTwitter] = useState<string>(
    me.user.sendTwitter && me.user.sendTwitter.length > 0
      ? me.user.sendTwitter
      : ""
  );
  const [isChangedSendTwitter, setIsChangedSendTwitter] = useState<boolean>(
    false
  );
  const [sendTelegram, setSendTelegram] = useState<string>(
    me.user.sendTelegram && me.user.sendTelegram.length > 0
      ? me.user.sendTelegram
      : ""
  );
  const [isChangedSendTelegram, setIsChangedSendTelegram] = useState<boolean>(
    false
  );
  const [sendSnapchat, setSendSnapchat] = useState<string>(
    me.user.sendSnapchat && me.user.sendSnapchat.length > 0
      ? me.user.sendSnapchat
      : ""
  );
  const [isChangedSendSnapchat, setIsChangedSendSnapchat] = useState<boolean>(
    false
  );
  const [sendLine, setSendLine] = useState<string>(
    me.user.sendLine && me.user.sendLine.length > 0 ? me.user.sendLine : ""
  );
  const [isChangedSendLine, setIsChangedSendLine] = useState<boolean>(false);
  const [sendWechat, setSendWechat] = useState<string>(
    me.user.sendWechat && me.user.sendWechat.length > 0
      ? me.user.sendWechat
      : ""
  );
  const [isChangedSendWechat, setIsChangedSendWechat] = useState<boolean>(
    false
  );
  const [sendKik, setSendKik] = useState<string>(
    me.user.sendKik && me.user.sendKik.length > 0 ? me.user.sendKik : ""
  );
  const [isChangedSendKik, setIsChangedSendKik] = useState<boolean>(false);
  const [sendVk, setSendVk] = useState<string>(
    me.user.sendVk && me.user.sendVk.length > 0 ? me.user.sendVk : ""
  );
  const [isChangedSendVk, setIsChangedSendVk] = useState<boolean>(false);
  const [sendWhatsapp, setSendWhatsapp] = useState<string>(
    me.user.sendWhatsapp && me.user.sendWhatsapp.length > 0
      ? me.user.sendWhatsapp
      : ""
  );
  const [isChangedSendWhatsapp, setIsChangedSendWhatsapp] = useState<boolean>(
    false
  );
  const [sendBehance, setSendBehance] = useState<string>(
    me.user.sendBehance && me.user.sendBehance.length > 0
      ? me.user.sendBehance
      : ""
  );
  const [isChangedSendBehance, setIsChangedSendBehance] = useState<boolean>(
    false
  );
  const [sendLinkedin, setSendLinkedin] = useState<string>(
    me.user.sendLinkedin && me.user.sendLinkedin.length > 0
      ? me.user.sendLinkedin
      : ""
  );
  const [isChangedSendLinkedin, setIsChangedSendLinkedin] = useState<boolean>(
    false
  );
  const [sendPinterest, setSendPinterest] = useState<string>(
    me.user.sendPinterest && me.user.sendPinterest.length > 0
      ? me.user.sendPinterest
      : ""
  );
  const [isChangedSendPinterest, setIsChangedSendPinterest] = useState<boolean>(
    false
  );
  const [sendVine, setSendVine] = useState<string>(
    me.user.sendVine && me.user.sendVine.length > 0 ? me.user.sendVine : ""
  );
  const [isChangedSendVine, setIsChangedSendVine] = useState<boolean>(false);
  const [sendTumblr, setSendTumblr] = useState<string>(
    me.user.sendTumblr && me.user.sendTumblr.length > 0
      ? me.user.sendTumblr
      : ""
  );
  const [isChangedSendTumblr, setIsChangedSendTumblr] = useState<boolean>(
    false
  );

  // MUTATION

  const [updateSnsFn, { loading: updateSnsLoading }] = useMutation<
    UpdateSns,
    UpdateSnsVariables
  >(UPDATE_SNS, {
    update(cache, { data: { updateSns } }) {
      try {
        const data = cache.readQuery<Me>({
          query: ME,
        });
        if (data) {
          data.me.user.sendInstagram = updateSns.user.sendInstagram;
          data.me.user.sendPhone = updateSns.user.sendPhone;
          data.me.user.sendEmail = updateSns.user.sendEmail;
          data.me.user.sendKakao = updateSns.user.sendKakao;
          data.me.user.sendFacebook = updateSns.user.sendFacebook;
          data.me.user.sendYoutube = updateSns.user.sendYoutube;
          data.me.user.sendTwitter = updateSns.user.sendTwitter;
          data.me.user.sendTelegram = updateSns.user.sendTelegram;
          data.me.user.sendSnapchat = updateSns.user.sendSnapchat;
          data.me.user.sendLine = updateSns.user.sendLine;
          data.me.user.sendWechat = updateSns.user.sendWechat;
          data.me.user.sendKik = updateSns.user.sendKik;
          data.me.user.sendVk = updateSns.user.sendVk;
          data.me.user.sendWhatsapp = updateSns.user.sendWhatsapp;
          data.me.user.sendBehance = updateSns.user.sendBehance;
          data.me.user.sendLinkedin = updateSns.user.sendLinkedin;
          data.me.user.sendPinterest = updateSns.user.sendPinterest;
          data.me.user.sendVine = updateSns.user.sendVine;
          data.me.user.sendTumblr = updateSns.user.sendTumblr;
          cache.writeQuery({
            query: ME,
            data,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  // FUNC

  const onInputTextChange = (text, state) => {
    const replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;
    const item = text
      .replace(/^\s\s*/, "")
      .replace(/\s\s*$/, "")
      .replace(replaceChar, "");
    if (state === "INSTAGRAM") {
      if (sendInstagram.length < 199) {
        setSendInstagram(item);
      }
    } else if (state === "PHONE") {
      if (sendPhone.length < 20) {
        setSendPhone(text);
      }
    } else if (state === "EMAIL") {
      if (sendEmail.length < 199) {
        setSendEmail(text);
      }
    } else if (state === "KAKAOTALK") {
      if (sendKakao.length < 199) {
        setSendKakao(item);
      }
    } else if (state === "FACEBOOK") {
      if (sendFacebook.length < 199) {
        setSendFacebook(item);
      }
    } else if (state === "YOUTUBE") {
      if (sendYoutube.length < 199) {
        setSendYoutube(item);
      }
    } else if (state === "TWITTER") {
      if (sendTwitter.length < 199) {
        setSendTwitter(item);
      }
    } else if (state === "TELEGRAM") {
      if (sendTelegram.length < 199) {
        setSendTelegram(item);
      }
    } else if (state === "SNAPCHAT") {
      if (sendSnapchat.length < 199) {
        setSendSnapchat(item);
      }
    } else if (state === "LINE") {
      if (sendLine.length < 199) {
        setSendLine(item);
      }
    } else if (state === "WECHAT") {
      if (sendWechat.length < 199) {
        setSendWechat(item);
      }
    } else if (state === "KIK") {
      if (sendKik.length < 199) {
        setSendKik(item);
      }
    } else if (state === "VK") {
      if (sendVk.length < 199) {
        setSendVk(item);
      }
    } else if (state === "WHATSAPP") {
      if (sendWhatsapp.length < 199) {
        setSendWhatsapp(item);
      }
    } else if (state === "BEHANCE") {
      if (sendBehance.length < 199) {
        setSendBehance(item);
      }
    } else if (state === "LINKEDIN") {
      if (sendLinkedin.length < 199) {
        setSendLinkedin(item);
      }
    } else if (state === "PINTEREST") {
      if (sendPinterest.length < 199) {
        setSendPinterest(item);
      }
    } else if (state === "VINE") {
      if (sendVine.length < 199) {
        setSendVine(item);
      }
    } else if (state === "TUMBLR") {
      if (sendTumblr.length < 199) {
        setSendTumblr(item);
      }
    } else {
      return null;
    }
  };

  const snsList = [
    {
      value: sendInstagram,
      payload: "INSTAGRAM",
      image: require("../../../../../assets/instagram.png"),
      meData: me.user.sendInstagram,
      isChanged: isChangedSendInstagram,
      setIsChanged: () => setIsChangedSendInstagram(false),
    },
    {
      value: sendPhone,
      payload: "PHONE",
      image: require("../../../../../assets/phone.png"),
      meData: me.user.sendPhone,
      isChanged: isChangedSendPhone,
      setIsChanged: () => setIsChangedSendPhone(false),
    },
    {
      value: sendEmail,
      payload: "EMAIL",
      image: require("../../../../../assets/email.png"),
      meData: me.user.sendEmail,
      isChanged: isChangedSendEmail,
      setIsChanged: () => setIsChangedSendEmail(false),
    },
    {
      value: sendKakao,
      payload: "KAKAOTALK",
      image: require("../../../../../assets/kakao.png"),
      meData: me.user.sendKakao,
      isChanged: isChangedSendKakao,
      setIsChanged: () => setIsChangedSendKakao(false),
    },
    {
      value: sendFacebook,
      payload: "FACEBOOK",
      image: require("../../../../../assets/facebook.png"),
      meData: me.user.sendFacebook,
      isChanged: isChangedSendFacebook,
      setIsChanged: () => setIsChangedSendFacebook(false),
    },
    {
      value: sendYoutube,
      payload: "YOUTUBE",
      image: require("../../../../../assets/youtube.png"),
      meData: me.user.sendYoutube,
      isChanged: isChangedSendYoutube,
      setIsChanged: () => setIsChangedSendYoutube(false),
    },
    {
      value: sendTwitter,
      payload: "TWITTER",
      image: require("../../../../../assets/twitter.png"),
      meData: me.user.sendTwitter,
      isChanged: isChangedSendTwitter,
      setIsChanged: () => setIsChangedSendTwitter(false),
    },
    {
      value: sendTelegram,
      payload: "TELEGRAM",
      image: require("../../../../../assets/telegram.png"),
      meData: me.user.sendTelegram,
      isChanged: isChangedSendTelegram,
      setIsChanged: () => setIsChangedSendTelegram(false),
    },
    {
      value: sendSnapchat,
      payload: "SNAPCHAT",
      image: require("../../../../../assets/snapchat.png"),
      meData: me.user.sendSnapchat,
      isChanged: isChangedSendSnapchat,
      setIsChanged: () => setIsChangedSendSnapchat(false),
    },
    {
      value: sendLine,
      payload: "LINE",
      image: require("../../../../../assets/line.png"),
      meData: me.user.sendLine,
      isChanged: isChangedSendLine,
      setIsChanged: () => setIsChangedSendLine(false),
    },
    {
      value: sendWechat,
      payload: "WECHAT",
      image: require("../../../../../assets/wechat.png"),
      meData: me.user.sendWechat,
      isChanged: isChangedSendWechat,
      setIsChanged: () => setIsChangedSendWechat(false),
    },
    {
      value: sendKik,
      payload: "KIK",
      image: require("../../../../../assets/kik.png"),
      meData: me.user.sendKik,
      isChanged: isChangedSendKik,
      setIsChanged: () => setIsChangedSendKik(false),
    },
    {
      value: sendVk,
      payload: "VK",
      image: require("../../../../../assets/vk.png"),
      meData: me.user.sendVk,
      isChanged: isChangedSendVk,
      setIsChanged: () => setIsChangedSendVk(false),
    },
    {
      value: sendWhatsapp,
      payload: "WHATSAPP",
      image: require("../../../../../assets/whatsapp.png"),
      meData: me.user.sendWhatsapp,
      isChanged: isChangedSendWhatsapp,
      setIsChanged: () => setIsChangedSendWhatsapp(false),
    },
    {
      value: sendBehance,
      payload: "BEHANCE",
      image: require("../../../../../assets/behance.png"),
      meData: me.user.sendBehance,
      isChanged: isChangedSendBehance,
      setIsChanged: () => setIsChangedSendBehance(false),
    },
    {
      value: sendLinkedin,
      payload: "LINKEDIN",
      image: require("../../../../../assets/linkedin.png"),
      meData: me.user.sendLinkedin,
      isChanged: isChangedSendLinkedin,
      setIsChanged: () => setIsChangedSendLinkedin(false),
    },
    {
      value: sendPinterest,
      payload: "PINTEREST",
      image: require("../../../../../assets/pinterest.png"),
      meData: me.user.sendPinterest,
      isChanged: isChangedSendPinterest,
      setIsChanged: () => setIsChangedSendPinterest(false),
    },
    {
      value: sendVine,
      payload: "VINE",
      image: require("../../../../../assets/vine.png"),
      meData: me.user.sendVine,
      isChanged: isChangedSendVine,
      setIsChanged: () => setIsChangedSendVine(false),
    },
    {
      value: sendTumblr,
      payload: "TUMBLR",
      image: require("../../../../../assets/tumblr.png"),
      meData: me.user.sendTumblr,
      isChanged: isChangedSendTumblr,
      setIsChanged: () => setIsChangedSendTumblr(false),
    },
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
          username: value,
        },
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

  const renderComposer = (props) => <Composer {...props} />;

  const renderSend = (props) => (
    <Send {...props}>
      <View
        style={{
          top: -2,
          backgroundColor: "transparent",
          height: 40,
          width: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesome name="send" size={22} color="#999" />
      </View>
    </Send>
  );

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        textInputStyle={{
          color: isDarkMode ? "white" : "black",
        }}
        containerStyle={{
          backgroundColor: isDarkMode ? "#212121" : "#e6e6e6",
          height: 45,
        }}
        {...props}
      >
        {renderSend(props)}
        {renderComposer(props)}
      </InputToolbar>
    );
  };

  useEffect(() => {
    setSnsAddMode(false);
  }, []);

  useEffect(() => {
    setIsChangedSendInstagram(me.user.sendInstagram !== sendInstagram);
    setIsChangedSendPhone(me.user.sendPhone !== sendPhone);
    setIsChangedSendEmail(me.user.sendEmail !== sendEmail);
    setIsChangedSendKakao(me.user.sendKakao !== sendKakao);
    setIsChangedSendFacebook(me.user.sendFacebook !== sendFacebook);
    setIsChangedSendYoutube(me.user.sendYoutube !== sendYoutube);
    setIsChangedSendTwitter(me.user.sendTwitter !== sendTwitter);
    setIsChangedSendTelegram(me.user.sendTelegram !== sendTelegram);
    setIsChangedSendSnapchat(me.user.sendSnapchat !== sendSnapchat);
    setIsChangedSendLine(me.user.sendLine !== sendLine);
    setIsChangedSendWechat(me.user.sendWechat !== sendWechat);
    setIsChangedSendKik(me.user.sendKik !== sendKik);
    setIsChangedSendVk(me.user.sendVk !== sendVk);
    setIsChangedSendWhatsapp(me.user.sendWhatsapp !== sendWhatsapp);
    setIsChangedSendBehance(me.user.sendBehance !== sendBehance);
    setIsChangedSendLinkedin(me.user.sendLinkedin !== sendLinkedin);
    setIsChangedSendPinterest(me.user.sendPinterest !== sendPinterest);
    setIsChangedSendVine(me.user.sendVine !== sendVine);
    setIsChangedSendTumblr(me.user.sendTumblr !== sendTumblr);
  }, [
    sendInstagram,
    sendPhone,
    sendEmail,
    sendKakao,
    sendFacebook,
    sendYoutube,
    sendTwitter,
    sendTelegram,
    sendSnapchat,
    sendLine,
    sendWechat,
    sendKik,
    sendVk,
    sendWhatsapp,
    sendBehance,
    sendLinkedin,
    sendPinterest,
    sendVine,
    sendTumblr,
  ]);

  if (!meLoading) {
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
            Platform.OS === "android" && snsAddMode
              ? setSnsAddMode(false)
              : closeSnsModal()
          }
          onModalHide={() =>
            snsAddMode ? setSnsAddMode(false) : closeSnsModal()
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
          {!snsAddMode ? (
            <>
              <AddView>
                <ScrollView
                  keyboardShouldPersistTaps={"always"}
                  keyboardDismissMode={
                    Platform.OS === "ios" ? "interactive" : "on-drag"
                  }
                  contentContainerStyle={{ flexGrow: 1 }}
                  showsVerticalScrollIndicator={false}
                >
                  <AddListContainer>
                    {!me.user.phoneNumber &&
                      !me.user.emailAddress &&
                      snsList.length === 0 && (
                        <TextContainer>
                          <Text>No SNS yet...</Text>
                        </TextContainer>
                      )}
                    {me.user.countryPhoneNumber && me.user.phoneNumber && (
                      <Item>
                        <Image
                          resizeMode={"contain"}
                          source={require("../../../../../assets/phone_second.png")}
                        />
                        <SNSTextContainer>
                          <SNSText>
                            {me.user.countryPhoneNumber}
                            {me.user.phoneNumber}
                          </SNSText>
                        </SNSTextContainer>
                        <ItemTouchable
                          onPress={() => {
                            onSendSnsId(
                              `${me.user.countryPhoneNumber}${me.user.phoneNumber}`,
                              "PHONE_SECOND"
                            ),
                              closeSnsModal();
                          }}
                        >
                          <EditItemView>
                            <EditItemText>SEND</EditItemText>
                          </EditItemView>
                        </ItemTouchable>
                      </Item>
                    )}
                    {me.user.emailAddress && (
                      <Item>
                        <Image
                          resizeMode={"contain"}
                          source={require("../../../../../assets/email_second.png")}
                        />
                        <SNSTextContainer>
                          <SNSText>{me.user.emailAddress}</SNSText>
                        </SNSTextContainer>
                        <ItemTouchable
                          onPress={() => {
                            onSendSnsId(
                              `${me.user.emailAddress}`,
                              "EMAIL_SECOND"
                            ),
                              closeSnsModal();
                          }}
                        >
                          <EditItemView>
                            <EditItemText>SEND</EditItemText>
                          </EditItemView>
                        </ItemTouchable>
                      </Item>
                    )}
                    <EmptyContainer />
                    {snsList.map((snsItem, index) => {
                      if (snsItem.meData && snsItem.meData.length > 0) {
                        return (
                          <Item key={index}>
                            <Image
                              resizeMode={"contain"}
                              source={snsItem.image}
                            />
                            <SNSTextContainer>
                              <SNSText>{snsItem.meData}</SNSText>
                            </SNSTextContainer>
                            <ItemTouchable
                              onPress={() => {
                                onSendSnsId(
                                  `${snsItem.meData}`,
                                  `${snsItem.payload}`
                                ),
                                  closeSnsModal();
                              }}
                            >
                              <EditItemView>
                                <EditItemText>SEND</EditItemText>
                              </EditItemView>
                            </ItemTouchable>
                          </Item>
                        );
                      } else {
                        return null;
                      }
                    })}
                  </AddListContainer>
                </ScrollView>
              </AddView>
              <Footer>
                <AddBackBtn>
                  <AddBtn onPress={() => closeSnsModal()}>
                    <AddText>BACK</AddText>
                  </AddBtn>
                </AddBackBtn>
                <AddBackBtn>
                  <AddBtn onPress={() => setSnsAddMode(true)}>
                    <AddText>SNS</AddText>
                  </AddBtn>
                </AddBackBtn>
              </Footer>
            </>
          ) : (
            <>
              <KeyboardAvoidingView
                enabled
                behavior={Platform.OS === "ios" ? "padding" : false}
                style={{ marginBottom: 65 }}
              >
                <EditView>
                  <ScrollView
                    keyboardShouldPersistTaps={"always"}
                    keyboardDismissMode={
                      Platform.OS === "ios" ? "interactive" : "on-drag"
                    }
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                  >
                    <AddListContainer>
                      {snsList.map((snsItem, index) => (
                        <Item key={index}>
                          <Image
                            resizeMode={"contain"}
                            source={snsItem.image}
                          />
                          <TextInput
                            style={{
                              width: constants.width - 140,
                              backgroundColor: "transparent",
                              borderBottomWidth: 0.5,
                              borderBottomColor: "#999",
                              color: "#999",
                              fontSize: 22,
                              padding: 5,
                              textAlign: "center",
                            }}
                            placeholder={snsItem.payload}
                            placeholderTextColor={
                              isDarkMode
                                ? "rgba(55, 55, 55, 1)"
                                : "rgba(207, 207, 207, 0.6)"
                            }
                            value={snsItem.value}
                            returnKeyType="done"
                            onChangeText={(text) =>
                              onInputTextChange(text, snsItem.payload)
                            }
                            keyboardType={
                              snsItem.payload === "PHONE"
                                ? "phone-pad"
                                : "email-address"
                            }
                            autoCorrect={false}
                            autoCapitalize={"none"}
                          />
                          {snsItem.meData && snsItem.meData.length > 0 ? (
                            snsItem.isChanged ? (
                              <ItemTouchable
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
                              onPress={() =>
                                onPressSendSns(
                                  snsItem.payload,
                                  snsItem.value,
                                  snsItem.setIsChanged
                                )
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
                </EditView>
              </KeyboardAvoidingView>
              <Footer>
                <EditBackBtn>
                  <EditBtn onPress={() => setSnsAddMode(false)}>
                    <AddText>DONE</AddText>
                  </EditBtn>
                </EditBackBtn>
              </Footer>
            </>
          )}
        </Modal>
        <MapModal visible={mapModalOpen} transparent={true}>
          {mapLoading ? (
            <LoadingContainer>
              <Loader />
            </LoadingContainer>
          ) : (
            <>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={{
                  borderRadius: 5,
                  height: constants.height,
                }}
                initialRegion={region}
                showsUserLocation={true}
                showsMyLocationButton={false}
                onMapReady={onMapReady}
                loadingEnabled={true}
                rotateEnabled={false}
                onRegionChangeComplete={onRegionChangeComplete}
                customMapStyle={
                  isDarkMode && isDarkMode === true
                    ? darkSendMode
                    : lightSendMode
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
              <Footer>
                <MapBackBtn>
                  <MapBtn onPress={() => closeMapModal()}>
                    <MapText>BACK</MapText>
                  </MapBtn>
                </MapBackBtn>
                <MapBackBtn>
                  <MapBtn
                    onPress={() =>
                      onSendLocation(region.latitude, region.longitude)
                    }
                  >
                    <MapText>SEND</MapText>
                  </MapBtn>
                </MapBackBtn>
              </Footer>
            </>
          )}
        </MapModal>
        <ChatContainer>
          <SafeAreaView style={{ flex: 1 }}>
            <GiftedChat
              messages={messages}
              onSend={(messages) => onSend(messages)}
              user={{
                _id: userId,
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
        </ChatContainer>
      </>
    );
  } else {
    return;
  }
};

export default ChatPresenter;
