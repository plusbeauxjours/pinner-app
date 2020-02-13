import React, { useEffect, useState } from "react";
import styled from "styled-components";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { Alert, Platform, Linking, AsyncStorage } from "react-native";
import Constants from "expo-constants";
import * as IntentLauncher from "expo-intent-launcher";

const View = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background-color: ${props => props.theme.bgColor};
`;

const Text = styled.Text``;

export default ({ navigation }) => {
  // const [getDarkMode, setGetDarkMode] = useState(null);
  // const [getToken, setGetToken] = useState(null);
  // const [getIsLoggedIn, setGetIsLoggedIn] = useState(null);
  // const nani = async () => {
  //   const getDarkMode = await AsyncStorage.getItem("isDarkMode");
  //   setGetDarkMode(getDarkMode);
  //   const getToken = await AsyncStorage.getItem("jwt");
  //   setGetToken(getToken);
  //   const getIsLoggedIn = await AsyncStorage.getItem("isLoggedIn");
  //   setGetIsLoggedIn(getIsLoggedIn);
  // };

  // const askPermission = async () => {
  //   const { status: locationStatus } = await Permissions.askAsync(
  //     Permissions.LOCATION
  //   );
  //   const { locationServicesEnabled } = await Location.getProviderStatusAsync();
  //   if (locationServicesEnabled) {
  //     if (Platform.OS === "ios" && locationStatus === "denied") {
  //       Alert.alert(
  //         "Permission Denied",
  //         "To enable location, tap Open Settings, then tap on Location, and finally tap on While Using the App.",
  //         [
  //           {
  //             text: "Cancel",
  //             style: "cancel"
  //           },
  //           {
  //             text: "Open Settings",
  //             onPress: () => {
  //               Linking.openURL("app-settings:");
  //             }
  //           }
  //         ]
  //       );
  //     } else if (Platform.OS === "android" && locationStatus === "denied") {
  //       Alert.alert(
  //         "Permission Denied",
  //         "To enable location, tap Open Settings, then tap on Permissions, then tap on Location, and finally tap on Allow only while using the app.",
  //         [
  //           {
  //             text: "Cancel",
  //             style: "cancel"
  //           },
  //           {
  //             text: "Open Settings",
  //             onPress: () => {
  //               const pkg = Constants.manifest.releaseChannel
  //                 ? Constants.manifest.android.package
  //                 : "host.exp.exponent";
  //               IntentLauncher.startActivityAsync(
  //                 IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
  //                 { data: "package:" + pkg }
  //               );
  //             }
  //           }
  //         ]
  //       );
  //     } else if (locationStatus === "granted") {
  //       const position = await Location.getCurrentPositionAsync({
  //         timeout: 5000
  //       });
  //       console.log(position);
  //       Alert.alert("Yes", "What the fuck");
  //     } else {
  //       return;
  //     }
  //   } else {
  //     Alert.alert("Location permission required.");
  //   }
  // };
  // useEffect(() => {
  //   askPermission();
  // }, []);
  // useEffect(() => {
  //   nani();
  // }, []);
  // console.log(getDarkMode);
  // console.log(getToken);
  // console.log(getIsLoggedIn);
  return (
    <View>
      {/* <Text>
        {getDarkMode
          ? `getDarkMode${getDarkMode}`
          : "getDarkMode NOOOONONONONNOONO"}
      </Text>
      <Text>
        {getToken ? `getToken${getToken}` : "getToken NOOOONONONONNOONO"}
      </Text>
      <Text>
        {getIsLoggedIn
          ? `getIsLoggedIn${getIsLoggedIn}`
          : "getIsLoggedIn NOOOONONONONNOONO"}
      </Text> */}
      <Text>hahiahaihi</Text>
    </View>
  );
};
