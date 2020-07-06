import React, { useState } from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import Toast from "react-native-root-toast";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { withNavigation } from "react-navigation";

import {
  SlackReportLocations,
  SlackReportLocationsVariables,
  ContinentProfile,
  ContinentProfileVariables,
} from "../../../../types/api";
import { CONTINENT_PROFILE } from "./ContinentProfileQueries";
import { SLACK_REPORT_LOCATIONS } from "../../../../sharedQueries";
import { countries as countryData } from "../../../../../countryData";
import constants from "../../../../../constants";
import { useMe } from "../../../../context/MeContext";
import { useTheme } from "../../../../context/ThemeContext";
import ContinentProfilePresenter from "./ContinentProfilePresenter";

interface IProps {
  navigation: any;
}

const ContinentProfileContainer: React.FC<IProps> = ({ navigation }) => {
  const { me, loading: meLoading } = useMe();
  const isDarkMode = useTheme();
  const [continentCode, setContinentCode] = useState<string>(
    navigation.getParam("continentCode") ||
      countryData.find(
        (i) => i.code === me.user.currentCity.country.countryCode
      ).continent
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const selectReportLocation = () => {
    showActionSheetWithOptions(
      {
        options: ["Inappropriate Photoes", "Wrong Location", "Other", "Cancel"],
        cancelButtonIndex: 3,
        title: `Choose a reason for reporting this continent.`,
        showSeparators: true,
        containerStyle: {
          backgroundColor: isDarkMode ? "#212121" : "#e6e6e6",
          borderRadius: 10,
          width: constants.width - 30,
          marginLeft: 15,
          marginBottom: 10,
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400",
        },
        separatorStyle: { opacity: 0.5 },
      },
      async (buttonIndex) => {
        if (buttonIndex === 0) {
          reportLocation("PHOTO");
        } else if (buttonIndex === 1) {
          reportLocation("LOCATION");
        } else if (buttonIndex === 2) {
          reportLocation("OTHER");
        } else {
          null;
        }
      }
    );
  };
  const reportLocation = (payload: string) => {
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
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        showSeparators: true,
        title: `Are you sure to report this continent?`,
        containerStyle: {
          backgroundColor: isDarkMode ? "#212121" : "#e6e6e6",
          borderRadius: 10,
          width: constants.width - 30,
          marginLeft: 15,
          marginBottom: 10,
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400",
        },
        separatorStyle: { opacity: 0.5 },
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          slackReportLocationsFn({
            variables: {
              targetLocationId: continentCode,
              targetLocationType: "continent",
              payload,
            },
          });
          toast("Reported");
        }
      }
    );
  };
  const {
    data: {
      continentProfile: {
        count = null,
        continent = null,
        continents = null,
        countries = null,
      } = {},
    } = {},
    loading: profileLoading,
    refetch: profileRefetch,
  } = useQuery<ContinentProfile, ContinentProfileVariables>(CONTINENT_PROFILE, {
    variables: { continentCode, page: 1 },
  });
  const [
    slackReportLocationsFn,
    { loading: slackReportLocationsLoading },
  ] = useMutation<SlackReportLocations, SlackReportLocationsVariables>(
    SLACK_REPORT_LOCATIONS
  );
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await profileRefetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };
  const chunk = (arr) => {
    let chunks = [],
      i = 0,
      n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, (i += 3)));
    }
    return chunks;
  };
  return (
    <ContinentProfilePresenter
      profileLoading={profileLoading}
      meLoading={meLoading}
      refreshing={refreshing}
      onRefresh={onRefresh}
      isDarkMode={isDarkMode}
      selectReportLocation={selectReportLocation}
      count={count}
      chunk={chunk}
      continent={continent}
      countries={countries}
      continents={continents}
      continentCode={continentCode}
    />
  );
};

export default withNavigation(ContinentProfileContainer);
