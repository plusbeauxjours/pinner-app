import React, { useState } from "react";

import { useQuery, useMutation } from "react-apollo-hooks";
import Toast from "react-native-root-toast";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { withNavigation } from "react-navigation";

import { SLACK_REPORT_LOCATIONS } from "../../../../sharedQueries";
import {
  CountryProfile,
  CountryProfileVariables,
  GetCountries,
  GetCountriesVariables,
  SlackReportLocations,
  SlackReportLocationsVariables,
  GetResidenceUsers,
  GetResidenceUsersVariables,
  GetNationalityUsers,
  GetNationalityUsersVariables,
} from "../../../../types/api";
import { COUNTRY_PROFILE, GET_COUNTRIES } from "./CountryProfileQueries";
import constants from "../../../../../constants";
import { useTheme } from "../../../../context/ThemeContext";
import { useMe } from "../../../../context/MeContext";
import { GET_RESIDENCE_USERS } from "../UsersResidence/UsersResidenceQueries";
import { GET_NATIONALITY_USERS } from "../UsersNationality/UsersNationalityQueries";
import CountryProfilePresenter from "./CountryProfilePresenter";

const CountryProfileContainer = ({ navigation }) => {
  const { me, loading: meLoading } = useMe();
  const isDarkMode = useTheme();
  const [countryCode, setCountryCode] = useState<string>(
    navigation.getParam("countryCode") ||
      me.user.currentCity.country.countryCode
  );
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [mapOpen, setMapOpen] = useState<boolean>(false);
  const { showActionSheetWithOptions } = useActionSheet();

  // MUTATION

  const [
    slackReportLocationsFn,
    { loading: slackReportLocationsLoading },
  ] = useMutation<SlackReportLocations, SlackReportLocationsVariables>(
    SLACK_REPORT_LOCATIONS
  );

  // QUERY

  const {
    data: {
      countryProfile: { count = null, country = null, cities = null } = {},
    } = {},
    loading: profileLoading,
    refetch: profileRefetch,
  } = useQuery<CountryProfile, CountryProfileVariables>(COUNTRY_PROFILE, {
    variables: { countryCode, page: 1 },
  });
  const {
    data: { getCountries: { countries = null } = {} } = {},
    loading: countriesLoading,
    refetch: countriesRefetch,
  } = useQuery<GetCountries, GetCountriesVariables>(GET_COUNTRIES, {
    variables: { countryCode },
  });
  const {
    data: { getResidenceUsers: { users: residenceUsers = null } = {} } = {},
    loading: getResidenceUsersLoading,
    refetch: getResidenceUsersRefetch,
  } = useQuery<GetResidenceUsers, GetResidenceUsersVariables>(
    GET_RESIDENCE_USERS,
    {
      variables: { countryCode, payload: "BOX" },
    }
  );
  const {
    data: { getNationalityUsers: { users: nationalityUsers = null } = {} } = {},
    loading: getNationalityUsersLoading,
    refetch: getNationalityUsersRefetch,
  } = useQuery<GetNationalityUsers, GetNationalityUsersVariables>(
    GET_NATIONALITY_USERS,
    {
      variables: { countryCode, payload: "BOX" },
    }
  );

  // FUNC

  const selectReportLocation = () => {
    showActionSheetWithOptions(
      {
        options: ["Inappropriate Photoes", "Wrong Location", "Other", "Cancel"],
        cancelButtonIndex: 3,
        title: `Choose a reason for reporting this country.`,
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
        title: `Are you sure to report this country?`,
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
              targetLocationId: countryCode,
              targetLocationType: "country",
              payload,
            },
          });
          toast("Reported");
        }
      }
    );
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await profileRefetch();
      await countriesRefetch();
      await getResidenceUsersRefetch();
      await getNationalityUsersRefetch();
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
    <CountryProfilePresenter
      profileLoading={profileLoading}
      countriesLoading={countriesLoading}
      meLoading={meLoading}
      refreshing={refreshing}
      onRefresh={onRefresh}
      isDarkMode={isDarkMode}
      selectReportLocation={selectReportLocation}
      count={count}
      chunk={chunk}
      countries={countries}
      country={country}
      mapOpen={mapOpen}
      setMapOpen={setMapOpen}
      getResidenceUsersLoading={getResidenceUsersLoading}
      residenceUsers={residenceUsers}
      getNationalityUsersLoading={getNationalityUsersLoading}
      nationalityUsers={nationalityUsers}
      cities={cities}
    />
  );
};

export default withNavigation(CountryProfileContainer);
