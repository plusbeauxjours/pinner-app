import React, { useEffect } from "react";
import styled from "styled-components";
import { useState } from "react";
import { useMe } from "../../../../context/MeContext";
import { useLocation } from "../../../../context/LocationContext";
import { useMutation } from "react-apollo-hooks";
import { RequestCoffee, RequestCoffeeVariables } from "../../../../types/api";
import { REQUEST_COFFEE } from "./RequestCoffeesQueries";
import { Platform } from "react-native";
import Modal from "react-native-modal";
import { useTheme } from "../../../../context/ThemeContext";
import { withNavigation } from "react-navigation";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

const RequestCoffees = ({ navigation }) => {
  const me = useMe();
  const isDarkMode = useTheme();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState<boolean>(true);
  const [countryCode, setCountryCode] = useState<string>(
    location.currentCountryCode
  );
  const [gender, setGender] = useState<string>();
  const [currentCityId, setCurrentCityId] = useState<string>(
    location.currentCityId
  );
  const [target, setTarget] = useState<string>();
  const [requestCoffeeFn] = useMutation<RequestCoffee, RequestCoffeeVariables>(
    REQUEST_COFFEE,
    { variables: { countryCode, gender, currentCityId, target } }
  );
  const onPress = () => {
    navigation.popToTop();
    setModalOpen(false);
  };
  useEffect(() => {
    console.log("navigation");
    setModalOpen(true);
  }, []);
  return (
    <View>
      <Text>RequestCoffee</Text>
    </View>
  );
};

export default withNavigation(RequestCoffees);