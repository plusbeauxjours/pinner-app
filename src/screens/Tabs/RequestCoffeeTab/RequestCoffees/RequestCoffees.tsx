import React, { useEffect } from "react";
import styled from "styled-components";
import { useState } from "react";
import { useLocation } from "../../../../context/LocationContext";
import { useMutation } from "react-apollo-hooks";
import { RequestCoffee, RequestCoffeeVariables } from "../../../../types/api";
import { useMe } from "../../../../context/MeContext";
import { REQUEST_COFFEE } from "./RequestCoffeesQueries";
import { withNavigation } from "react-navigation";
import { useActionSheet } from "@expo/react-native-action-sheet";
import Modal from "react-native-modal";
import { Platform } from "react-native";
import NavIcon from "../../../../components/NavIcon";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

const RequestCoffees = ({ navigation }) => {
  const me = useMe();
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
  const { showActionSheetWithOptions } = useActionSheet();
  const selectReportUser = () => {
    showActionSheetWithOptions(
      {
        options: ["Everyone", "Nationality", "Residence", "Gender", "Cancel"],
        cancelButtonIndex: 4,
        title: `Choose a target.`,
        showSeparators: true
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          requestCoffeeFn({ variables: { target: "everyone", currentCityId } });
        } else if (buttonIndex === 1) {
          requestCoffeeFn({
            variables: {
              target: "nationality",
              currentCityId,
              countryCode: me.profile.nationality.countryCode
            }
          });
        } else if (buttonIndex === 2) {
          requestCoffeeFn({
            variables: {
              target: "residence",
              currentCityId,
              countryCode: me.profile.residence.countryCode
            }
          });
        } else if (buttonIndex === 3) {
          requestCoffeeFn({
            variables: {
              target: "gender",
              currentCityId,
              gender: me.profile.gender
            }
          });
        } else {
          null;
        }
      }
    );
  };
  const [requestCoffeeFn] = useMutation<RequestCoffee, RequestCoffeeVariables>(
    REQUEST_COFFEE
  );
  useEffect(() => {
    selectReportUser();
  }, []);
  return <NavIcon name={Platform.OS === "ios" ? "ios-add" : "md-add"} />;
};

export default withNavigation(RequestCoffees);
