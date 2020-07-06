import React, { useState, useEffect } from "react";
import { Platform, Alert, Linking } from "react-native";

import { useMutation } from "react-apollo-hooks";
import * as Location from "expo-location";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as IntentLauncher from "expo-intent-launcher";
import Toast from "react-native-root-toast";

import {
  StartPhoneVerification,
  StartPhoneVerificationVariables,
  CompletePhoneVerification,
  CompletePhoneVerificationVariables,
} from "../../../types/api";
import { useTheme } from "../../../context/ThemeContext";
import { countries } from "../../../../countryData";
import { useLogIn } from "../../../context/AuthContext";
import { PHONE_SIGN_IN, COMPLETE_PHONE_SIGN_IN } from "./HomeQueries";
import { useReverseGeoCode } from "../../../hooks/useReverseGeoCode";
import HomePresenter from "./HomePresenter";

export default () => {
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

  // MUTATION

  const [
    startPhoneVerificationFn,
    { loading: startPhoneVerificationLoading },
  ] = useMutation<StartPhoneVerification, StartPhoneVerificationVariables>(
    PHONE_SIGN_IN,
    {
      variables: {
        phoneNumber: `${countryPhoneNumber}${
          phoneNumber.startsWith("0") ? phoneNumber.substring(1) : phoneNumber
        }`,
      },
    }
  );
  const [
    completePhoneVerificationFn,
    { loading: completePhoneVerificationLoading },
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
      cityId,
    },
  });

  // FUNC

  const handleGeoSuccess = (position) => {
    const {
      coords: { latitude, longitude },
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
          countries.find((i) => i.code === address.storableLocation.countryCode)
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

  const onSelectrPhone = (country: any) => {
    setCountryPhoneNumber(countries.find((i) => i.code === country.cca2).phone);
    setCountryPhoneCode(country.cca2);
  };

  const handlePhoneNumber = async () => {
    const phone = `${countryPhoneNumber}${
      phoneNumber.startsWith("0") ? phoneNumber.substring(1) : phoneNumber
    }`;

    const phoneRegex = /(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))\s*[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?([-\s\.]?[0-9]{3})([-\s\.]?[0-9]{3,4})/;
    const {
      data: { startPhoneVerification },
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
      data: { completePhoneVerification },
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
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    const { locationServicesEnabled } = await Location.getProviderStatusAsync();
    if (locationServicesEnabled) {
      if (status === "denied") {
        if (Platform.OS === "ios") {
          Alert.alert(
            "Permission Denied",
            "To enable location, tap Open Settings, then tap on Location, and finally tap on While Using the App.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Open Settings",
                onPress: () => {
                  Linking.openURL("app-settings:"), setLoading(false);
                },
              },
            ]
          );
        } else if (Platform.OS === "android") {
          Alert.alert(
            "Permission Denied",
            "To enable location, tap Open Settings, then tap on Permissions, then tap on Location, and finally tap on Allow only while using the app.",
            [
              { text: "Cancel", style: "cancel" },
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
                    setLoading(false);
                },
              },
            ]
          );
        }
      } else if (status === "granted") {
        const position = await Location.getCurrentPositionAsync();
        handleGeoSuccess(position);
      } else {
        return;
      }
    } else {
      Alert.alert("Location permission required.");
    }
  };
  useEffect(() => {
    askPermission();
  }, []);

  return (
    <HomePresenter
      approachModalOpen={approachModalOpen}
      isDarkMode={isDarkMode}
      setApproachModalOpen={setApproachModalOpen}
      setVerificationKey={setVerificationKey}
      setModalMode={setModalMode}
      modalMode={modalMode}
      loading={loading}
      countryPhoneCode={countryPhoneCode}
      countryPhoneNumber={countryPhoneNumber}
      onSelectrPhone={onSelectrPhone}
      setPhoneNumber={setPhoneNumber}
      startPhoneVerificationLoading={startPhoneVerificationLoading}
      handlePhoneNumber={handlePhoneNumber}
      handlePhoneVerification={handlePhoneVerification}
      completePhoneVerificationLoading={completePhoneVerificationLoading}
      cityId={cityId}
    />
  );
};
