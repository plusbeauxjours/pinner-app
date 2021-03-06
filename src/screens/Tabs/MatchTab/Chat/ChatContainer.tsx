import React from "react";
import { GiftedChat } from "react-native-gifted-chat";
import * as Permissions from "expo-permissions";
import * as IntentLauncher from "expo-intent-launcher";
import { withNavigation, NavigationScreenProp } from "react-navigation";
import * as Location from "expo-location";
import Constants from "expo-constants";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import firebase from "firebase";
import CustomView from "./CustomView";
import { chat_send } from "../../../../../Fire";
import {
  TouchableOpacity,
  BackHandler,
  View,
  Text,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { BACKEND_URL } from "../../../../../constants";
import ChatPresenter from "./ChatPresenter";
import {
  get_new_key,
  UserChatMessage,
  ChatMessage,
  get_old_chat_messages,
  update_message_info,
  fb_db,
} from "../../../../../Fire";
import * as moment from "moment-timezone";
import Toast from "react-native-root-toast";
import { Image } from "react-native";
import { useReverseGeoCode } from "../../../../hooks/useReverseGeoCode";
import { useReversePlaceId } from "../../../../hooks/useReversePlaceId";
import { REPORT_LOCATION } from "../../../../sharedQueries";
import { Mutation } from "react-apollo";
import { ReportLocation, ReportLocationVariables } from "../../../../types/api";

interface IProps {
  navigation: NavigationScreenProp<{
    chatId: string;
    userId: string;
    receiverId: string;
    receiverAvatar: string;
    uuid: string;
    userName: string;
    userUrl: string;
    targetUuid: string;
  }>;
}

interface IState {
  chatId: string;
  userId: string;
  receiverId: string;
  receiverAvatar: string;
  receiverPushToken: string;
  uuid: string;
  userName: string;
  userUrl: string;
  userAvatarUrl: string;
  targetUuid: string;
  hasPermission: boolean;
  nowShowing: string;
  imageUrl: string;
  mapModalOpen: boolean;
  snsModalOpen: boolean;
  messages: any;
  resolution: "full" | "high" | "low";
  loadingEarlier: boolean;
  overlayVisible: boolean;
  dbref: any;
  imageLoading: boolean;
  region: any;
  mapLoading: boolean;
  isDarkMode: boolean;
}

class ChatContainer extends React.Component<IProps, IState> {
  public reportLocationFn: any;
  constructor(props) {
    super(props);
    console.ignoredYellowBox = ["Setting a timer"];
    this.state = {
      chatId: this.props.navigation.getParam("chatId"),
      userId: this.props.navigation.getParam("userId"),
      receiverId: this.props.navigation.getParam("receiverId"),
      receiverAvatar: this.props.navigation.getParam("receiverAvatar"),
      receiverPushToken: this.props.navigation.getParam("receiverPushToken"),
      uuid: this.props.navigation.getParam("uuid"),
      userName: this.props.navigation.getParam("userName"),
      userUrl: this.props.navigation.getParam("userUrl"),
      userAvatarUrl: `${BACKEND_URL}/media/${this.props.navigation.getParam(
        "userUrl"
      )}`,
      targetUuid: this.props.navigation.getParam("targetUuid"),
      hasPermission: false,
      nowShowing: "",
      imageUrl: "",
      mapModalOpen: false,
      snsModalOpen: false,
      messages: [],
      resolution: "high",
      loadingEarlier: false,
      overlayVisible: false,
      dbref: firebase
        .database()
        .ref("messages")
        .child(this.props.navigation.getParam("chatId")),
      imageLoading: false,
      region: {
        latitude: this.props.navigation.getParam("latitude"),
        longitude: this.props.navigation.getParam("longitude"),
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      mapLoading: false,
      isDarkMode: this.props.navigation.getParam("isDarkMode"),
    };
  }
  public toast = (message: string) => {
    Toast.show(message, {
      duration: 1000,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };
  public onRegionChangeComplete = (region) => {
    this.setState({ region });
  };
  public onSend = (messages = []) => {
    let msg = messages[0];
    if (msg) {
      msg._id = get_new_key("messages");
      msg.user.name = this.state.userName;
      msg.receiverPushToken = this.state.receiverPushToken;
      msg.status = false;
      chat_send(this.state.chatId, msg).catch((e) => console.log(e));
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, msg),
      }));
    }
  };

  public closeSnsModal = () => {
    this.setState({ snsModalOpen: false });
  };

  public onSendSnsId = (snsId: string, snsIdPlatform: string) => {
    let new_key = get_new_key("messages");
    let user: UserChatMessage = {
      _id: this.state.userId,
      name: this.state.userName,
    };
    let messageSnsId: ChatMessage = {
      _id: new_key,
      createdAt: new Date(),
      status: false,
      user: user,
      snsId,
      snsIdPlatform,
      receiverPushToken: this.state.receiverPushToken,
    };
    let messages = [];
    messages.push(messageSnsId);
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
      snsModalOpen: false,
    }));
    chat_send(this.state.chatId, messageSnsId).catch((e) => console.log(e));
  };

  public onSendLocation = (latitude: string, longitude: string) => {
    let new_key = get_new_key("messages");
    let user: UserChatMessage = {
      _id: this.state.userId,
      name: this.state.userName,
    };
    let messageLocation: ChatMessage = {
      _id: new_key,
      createdAt: new Date(),
      status: false,
      user: user,
      location: { latitude, longitude },
      receiverPushToken: this.state.receiverPushToken,
    };
    let messages = [];
    messages.push(messageLocation);
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
      mapModalOpen: false,
    }));
    chat_send(this.state.chatId, messageLocation).catch((e) => console.log(e));
  };

  public renderCustomView = (props) => {
    return <CustomView {...props} />;
  };
  public renderAvatar = () => {
    const { targetUuid, isDarkMode } = this.state;
    const randomAvatar = {
      0: require(`../../../../Images/thumbnails/earth6.png`),
      1: require(`../../../../Images/thumbnails/earth1.png`),
      2: require(`../../../../Images/thumbnails/earth2.png`),
      3: require(`../../../../Images/thumbnails/earth3.png`),
      4: require(`../../../../Images/thumbnails/earth4.png`),
      5: require(`../../../../Images/thumbnails/earth5.png`),
      6: require(`../../../../Images/thumbnails/earth6.png`),
      7: require(`../../../../Images/thumbnails/earth7.png`),
      8: require(`../../../../Images/thumbnails/earth8.png`),
      9: require(`../../../../Images/thumbnails/earth9.png`),
    };
    return (
      <>
        {this.state.receiverAvatar ? (
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.push("UserProfile", {
                uuid: targetUuid,
                isSelf: false,
              })
            }
          >
            <ProgressiveImage
              tint={isDarkMode ? "dark" : "light"}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
              }}
              preview={{
                uri: `${BACKEND_URL}/media/${this.state.receiverAvatar}`,
              }}
              uri={`${BACKEND_URL}/media/${this.state.receiverAvatar}`}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.push("UserProfile", {
                uuid: targetUuid,
                isSelf: false,
              })
            }
          >
            <Image
              style={{
                height: 36,
                width: 36,
                borderRadius: 18,
              }}
              source={randomAvatar[Math.round(Math.random() * 9)]}
            />
          </TouchableOpacity>
        )}
      </>
    );
  };

  public renderActions = () => (
    <View
      style={{
        top: -2,
        flexDirection: "row",
        marginLeft: 5,
        maxWidth: 85,
        width: 100,
        justifyContent: "space-between",
      }}
    >
      <TouchableOpacity
        style={{
          justifyContent: "center",
        }}
        onPress={() => {
          this.askPermission();
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderColor: "#999",
            borderStyle: "solid",
            borderWidth: 0.5,
            borderRadius: 5,
            padding: 2,
          }}
        >
          <Text style={{ color: "#999", textAlign: "center", fontSize: 10 }}>
            MAP
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          justifyContent: "center",
        }}
        onPress={() => this.setState({ snsModalOpen: true })}
      >
        <View
          style={{
            width: 40,
            height: 40,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            borderColor: "#999",
            borderStyle: "solid",
            borderWidth: 0.5,
            borderRadius: 5,
            padding: 2,
          }}
        >
          <Text style={{ color: "#999", textAlign: "center", fontSize: 10 }}>
            SNS
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  public closeMapModal = () => {
    this.setState({ mapModalOpen: false });
  };

  public sortByDate = (a, b) => {
    let date1 = new Date(a.createdAt).getTime();
    let date2 = new Date(b.createdAt).getTime();
    return date1 < date2 ? 1 : date2 < date1 ? -1 : 0;
  };

  public componentDidMount() {
    this.setState({ mapModalOpen: false });
    this.setState({ snsModalOpen: false });
    BackHandler.addEventListener("hardwareBackPress", () => {
      if (!this.state.overlayVisible) {
        this.props.navigation.navigate("Match");
        return true;
      } else {
        this.setState({ overlayVisible: false });
        return true;
      }
    });
    get_old_chat_messages(
      this.state.chatId,
      this.state.resolution,
      this.state.userId
    ).then((messages) => {
      if (messages) {
        let promises = messages.map((m) =>
          update_message_info(m, this.state.chatId, this.state.userId)
        );
        Promise.all(promises).then((results) => {
          this.setState({
            messages: results.filter((r) => r).sort(this.sortByDate),
          });
        });
      }
    });
    let start_key = get_new_key("messages");
    fb_db.ref
      .child("messages")
      .child(this.state.chatId)
      .orderByKey()
      .startAt(start_key)
      .on("child_changed", (child) => {
        if (child && child.val()) {
          if (child.val()["status"] === true) {
            this.setState({
              messages: this.state.messages.map((previousState) =>
                previousState._id === child.val()["_id"]
                  ? { ...previousState, ...child.val() }
                  : previousState
              ),
            });
          }
        }
      });
    fb_db.ref
      .child("messages")
      .child(this.state.chatId)
      .orderByKey()
      .startAt(start_key)
      .on("child_added", (child) => {
        /* tslint:disable:no-string-literal */
        if (child && child.val()) {
          let message_container = [];
          let new_message = child.val();
          if (
            new_message.system ||
            new_message.user._id !== this.state.userId
          ) {
            update_message_info(
              new_message,
              this.state.chatId,
              this.state.userId
            ).then((updated_message) => {
              message_container.push(new_message);
              this.setState((previousState) => ({
                messages: GiftedChat.append(
                  previousState.messages,
                  message_container
                ).sort(this.sortByDate),
              }));
              // }
            });
          }
        }
      });
  }
  public didBlurSubscription = this.props.navigation.addListener(
    "didBlur",
    (payload) => {
      BackHandler.removeEventListener("hardwareBackPress", () => {
        return;
      });
      this.state.dbref.off("child_added");
    }
  );
  public componentDidUnMount() {
    this.didBlurSubscription.remove();
  }
  public messageFooter = (timeProps) => {
    const { currentMessage, position } = timeProps;
    const timeZone = moment.tz.guess();
    const time = moment.tz(currentMessage.createdAt, timeZone).format("LT");
    if (position === "left") {
      const text = (
        <Text style={{ left: 10, fontSize: 8, color: "black" }}>{time}</Text>
      );
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            width: 50,
          }}
        >
          {text}
        </View>
      );
    } else if (position === "right") {
      const text = (
        <Text
          style={{
            right: 10,
            fontSize: 8,
            color: "white",
          }}
        >
          {time}
        </Text>
      );
      return (
        <>
          {currentMessage.status ? (
            <View
              style={{
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                width: 50,
              }}
            >
              {text}
              <Text style={{ fontSize: 11, color: "white", right: 10 }}>
                Read
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                width: 50,
              }}
            >
              {text}
            </View>
          )}
        </>
      );
    } else {
      return;
    }
  };
  public askPermission = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    const { locationServicesEnabled } = await Location.getProviderStatusAsync();
    if (locationServicesEnabled) {
      if (Platform.OS === "ios" && status === "denied") {
        Alert.alert(
          "Permission Denied",
          "To enable location, tap Open Settings, then tap on Location, and finally tap on While Using the App.",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                this.setState({ mapLoading: false, mapModalOpen: false });
              },
            },
            {
              text: "Open Settings",
              onPress: () => {
                Linking.openURL("app-settings:"),
                  this.setState({ mapLoading: false, mapModalOpen: false });
              },
            },
          ]
        );
      } else if (Platform.OS === "android" && status === "denied") {
        Alert.alert(
          "Permission Denied",
          "To enable location, tap Open Settings, then tap on Permissions, then tap on Location, and finally tap on Allow only while using the app.",
          [
            {
              text: "Cancel",
              style: "cancel",
              onPress: () => {
                this.setState({ mapLoading: false, mapModalOpen: false });
              },
            },
            {
              text: "Open Settings",
              onPress: () => {
                const pkg = Constants.manifest.releaseChannel
                  ? Constants.manifest.android.package
                  : "host.exp.exponent";
                IntentLauncher.startActivityAsync(
                  IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
                  { data: "package:" + pkg }
                ),
                  this.setState({ mapLoading: false, mapModalOpen: false });
              },
            },
          ]
        );
      } else if (status === "granted") {
        this.setState({ mapLoading: true, mapModalOpen: true });
        const position = await Location.getCurrentPositionAsync({
          timeout: 5000,
        });
        this.handleGeoSuccess(position);
      } else {
        return;
      }
    } else {
      Alert.alert("Location permission required.");
    }
  };
  public handleGeoSuccess = (position) => {
    const {
      coords: { latitude, longitude },
    } = position;
    this.setState({
      region: {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      mapLoading: false,
    });
    this.getAddress(latitude, longitude);
  };
  public getAddress = async (latitude: number, longitude: number) => {
    try {
      const address = await useReverseGeoCode(latitude, longitude);
      if (address) {
        const cityInfo = await useReversePlaceId(
          address.storableLocation.cityId
        );
        await this.reportLocationFn({
          variables: {
            currentLat: cityInfo.storableLocation.latitude,
            currentLng: cityInfo.storableLocation.longitude,
            currentCityId: address.storableLocation.cityId,
            currentCityName: address.storableLocation.cityName,
            currentCountryCode: address.storableLocation.countryCode,
          },
        });
        // await AsyncStorage.setItem("cityId", address.storableLocation.cityId);
        // await AsyncStorage.setItem(
        //   "countryCode",
        //   address.storableLocation.countryCode
        // );
      }
    } catch (e) {
      console.log(e);
    }
  };
  public render() {
    const {
      mapModalOpen,
      snsModalOpen,
      messages,
      userId,
      region,
      mapLoading,
    } = this.state;
    return (
      <Mutation<ReportLocation, ReportLocationVariables>
        mutation={REPORT_LOCATION}
      >
        {(reportLocationFn) => {
          this.reportLocationFn = reportLocationFn;
          return (
            <ChatPresenter
              userId={userId}
              snsModalOpen={snsModalOpen}
              mapModalOpen={mapModalOpen}
              messages={messages}
              onSend={this.onSend}
              onSendSnsId={this.onSendSnsId}
              onSendLocation={this.onSendLocation}
              renderCustomView={this.renderCustomView}
              renderActions={this.renderActions}
              closeMapModal={this.closeMapModal}
              messageFooter={this.messageFooter}
              renderAvatar={this.renderAvatar}
              closeSnsModal={this.closeSnsModal}
              region={region}
              onRegionChangeComplete={this.onRegionChangeComplete}
              mapLoading={mapLoading}
            />
          );
        }}
      </Mutation>
    );
  }
}

export default withNavigation(ChatContainer);
