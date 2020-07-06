import React, { useState } from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import {
  CityProfile,
  CityProfileVariables,
  GetSamenameCities,
  GetSamenameCitiesVariables,
  SlackReportLocations,
  SlackReportLocationsVariables,
  ReportLocation,
  ReportLocationVariables,
  NearCities,
  NearCitiesVariables,
} from "../../../../types/api";
import {
  CITY_PROFILE,
  GET_SAMENAME_CITIES,
  NEAR_CITIES,
} from "./CityProfileQueries";
import {
  SLACK_REPORT_LOCATIONS,
  REPORT_LOCATION,
} from "../../../../sharedQueries";
import constants from "../../../../../constants";
import { useTheme } from "../../../../context/ThemeContext";
import Toast from "react-native-root-toast";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { withNavigation } from "react-navigation";
import { useMe } from "../../../../context/MeContext";
import CityProfilePresenter from "./CityProfilePresenter";

const CityProfileContainer = withNavigation(({ navigation }) => {
  const { me, loading: meLoading } = useMe();
  const isDarkMode = useTheme();
  const [cityId, setCityId] = useState<string>(
    navigation.getParam("cityId") || me.user.currentCity.cityId
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [mapOpen, setMapOpen] = useState<boolean>(false);
  const { showActionSheetWithOptions } = useActionSheet();

  // MUTATION

  const {
    data: { nearCities: { cities: nearCities = null } = {} } = {},
    loading: nearCitiesLoading,
    refetch: nearCitiesRefetch,
  } = useQuery<NearCities, NearCitiesVariables>(NEAR_CITIES, {
    variables: { cityId },
  });
  const [reportLocationFn, { loading: reportLocationLoading }] = useMutation<
    ReportLocation,
    ReportLocationVariables
  >(REPORT_LOCATION);
  const [
    slackReportLocationsFn,
    { loading: slackReportLocationsLoading },
  ] = useMutation<SlackReportLocations, SlackReportLocationsVariables>(
    SLACK_REPORT_LOCATIONS
  );

  // QUERY

  const {
    data: {
      cityProfile: {
        count = null,
        city = null,
        usersBefore = null,
        usersNow = null,
      } = {},
    } = {},
    loading: profileLoading,
    refetch: profileRefetch,
  } = useQuery<CityProfile, CityProfileVariables>(CITY_PROFILE, {
    variables: { cityId, page: 1, payload: "BOX" },
  });
  const {
    data: { getSamenameCities: { cities: samenameCities = null } = {} } = {},
    loading: samenameCitiesLoading,
    refetch: samenameCitiesRefetch,
  } = useQuery<GetSamenameCities, GetSamenameCitiesVariables>(
    GET_SAMENAME_CITIES,
    { variables: { cityId } }
  );

  // FUNC

  const selectReportLocation = () => {
    showActionSheetWithOptions(
      {
        options: ["Inappropriate Photoes", "Wrong Location", "Other", "Cancel"],
        cancelButtonIndex: 3,
        title: `Choose a reason for reporting this city.`,
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
      (buttonIndex) => {
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
        title: `Are you sure to report this city?`,
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
              targetLocationId: cityId,
              targetLocationType: "city",
              payload,
            },
          });
          toast("PIN Reported");
        }
      }
    );
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await profileRefetch();
      await nearCitiesRefetch();
      await samenameCitiesRefetch();
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
    <CityProfilePresenter
      profileLoading={profileLoading}
      nearCitiesLoading={nearCitiesLoading}
      samenameCitiesLoading={samenameCitiesLoading}
      meLoading={meLoading}
      refreshing={refreshing}
      onRefresh={onRefresh}
      city={city}
      isDarkMode={isDarkMode}
      mapOpen={mapOpen}
      setMapOpen={setMapOpen}
      count={count}
      nearCities={nearCities}
      chunk={chunk}
      samenameCities={samenameCities}
      usersBefore={usersBefore}
      usersNow={usersNow}
      selectReportLocation={selectReportLocation}
    />
  );
});

export default CityProfileContainer;
