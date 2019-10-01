import React, { useState } from "react";
import { useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { useTheme } from "../../../../hooks/useTheme";
import { useMe } from "../../../../context/MeContext";
import { useLocation } from "../../../../context/LocationContext";
import {
  EditProfile,
  EditProfileVariables,
  DeleteProfile,
  StartEditPhoneVerification,
  StartEditPhoneVerificationVariables,
  CompleteEditPhoneVerification,
  CompleteEditPhoneVerificationVariables,
  ToggleSettings,
  ToggleSettingsVariables,
  UserProfile
} from "../../../../types/api";
import {
  EDIT_PROFILE,
  DELETE_PROFILE,
  START_EDIT_PHONE_VERIFICATION,
  COMPLETE_EDIT_PHONE_VERIFICATION,
  START_EDIT_EMAIL_VERIFICATION,
  TOGGLE_SETTINGS
} from "./EditProfileQueries";
import Loader from "../../../../components/Loader";
import {
  StartEditEmailVerification,
  StartEditEmailVerificationVariables
} from "../../../../types/api";
import { theme } from "../../../../styles/theme";
import NavIcon from "../../../../components/NavIcon";
import { GET_USER } from "../UserProfile/UserProfileQueries";
import { UserProfileVariables } from "../../../../types/api";
import { ScrollView, RefreshControl, Platform } from "react-native";

const View = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 15px;
`;

const ToggleContainer = styled.View``;
const ToggleText = styled.Text``;

const Text = styled.Text``;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 20;
`;
const Item = styled.View`
  margin-top: 15px;
  flex-direction: row;
  justify-content: space-between;
`;

const ToggleIcon = styled.TouchableOpacity``;
const ExplainText = styled.Text`
  font-size: 12px;
  font-weight: 100;
`;

export default ({ navigation }) => {
  const profileRefetch = navigation.getParam("profileRefetch");
  const profile = navigation.getParam("profile");
  const me = useMe();
  const location = useLocation();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>(
    navigation.getParam("username")
  );
  const [bio, setBio] = useState<string>(profile.bio);
  const [gender, setGender] = useState<string>(profile.gender);
  const [firstName, setFirstName] = useState<string>(
    navigation.getParam("firstName")
  );
  const [lastName, setLastName] = useState<string>(
    navigation.getParam("lastName")
  );
  const [nationalityCode, setNationalityCode] = useState<string>(
    profile.nationality && profile.nationality.countryCode
  );
  const [residenceCode, setResidenceCode] = useState<string>(
    profile.residence && profile.residence.countryCode
  );
  const [isDarkMode, setIsDarkMode] = useState<boolean>(theme);
  const [isHideTrips, setIsHideTrips] = useState<boolean>(profile.isHideTrips);
  const [isHideCoffees, setIsHideCoffees] = useState<boolean>(
    profile.isHideCoffees
  );
  const [isHideCities, setIsHideCities] = useState<boolean>(
    profile.isHideCities
  );
  const [isHideCountries, setIsHideCountries] = useState<boolean>(
    profile.isHideCountries
  );
  const [isHideContinents, setIsHideContinents] = useState<boolean>(
    profile.isHideContinents
  );
  const [isAutoLocationReport, setIsAutoLocationReport] = useState<boolean>(
    profile.isAutoLocationReport
  );

  const [phoneNumber, setPhoneNumber] = useState<string>(profile.phoneNumber);
  const [countryPhoneNumber, setCountryPhoneNumber] = useState<string>(
    profile.countryPhoneNumber
  );

  const [editProfileFn] = useMutation<EditProfile, EditProfileVariables>(
    EDIT_PROFILE,
    {
      variables: {
        username,
        bio,
        gender,
        firstName,
        lastName,
        nationalityCode,
        residenceCode
      }
    }
  );
  const [deleteProfileFn] = useMutation<DeleteProfile>(DELETE_PROFILE);
  const [startEditPhoneVerificationFn] = useMutation<
    StartEditPhoneVerification,
    StartEditPhoneVerificationVariables
  >(START_EDIT_PHONE_VERIFICATION, {
    variables: {
      phoneNumber,
      countryPhoneNumber
    }
  });
  const [completeEditPhoneVerificationFn] = useMutation<
    CompleteEditPhoneVerification,
    CompleteEditPhoneVerificationVariables
  >(COMPLETE_EDIT_PHONE_VERIFICATION, {
    variables: {
      key: "",
      phoneNumber,
      countryPhoneNumber,
      countryPhoneCode: ""
    }
  });
  const [startEditEmailVerificationFn] = useMutation<
    StartEditEmailVerification,
    StartEditEmailVerificationVariables
  >(START_EDIT_EMAIL_VERIFICATION, {
    variables: {
      emailAddress: ""
    }
  });
  const [toggleSettingsFn] = useMutation<
    ToggleSettings,
    ToggleSettingsVariables
  >(TOGGLE_SETTINGS, {
    update(cache, { data: { toggleSettings } }) {
      try {
        const data = cache.readQuery<UserProfile, UserProfileVariables>({
          query: GET_USER,
          variables: { username }
        });
        if (data) {
          data.userProfile.user.profile.isDarkMode =
            toggleSettings.user.profile.isDarkMode;
          data.userProfile.user.profile.isHideTrips =
            toggleSettings.user.profile.isHideTrips;
          data.userProfile.user.profile.isHideCoffees =
            toggleSettings.user.profile.isHideCoffees;
          data.userProfile.user.profile.isHideCities =
            toggleSettings.user.profile.isHideCities;
          data.userProfile.user.profile.isHideCountries =
            toggleSettings.user.profile.isHideCountries;
          data.userProfile.user.profile.isHideContinents =
            toggleSettings.user.profile.isHideContinents;
          data.userProfile.user.profile.isAutoLocationReport =
            toggleSettings.user.profile.isAutoLocationReport;
          cache.writeQuery({
            query: GET_USER,
            variables: { username },
            data
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
  const onPressToggleIcon = async (payload: string) => {
    if (payload === "HIDE_TRIPS") {
      setIsHideTrips(isHideTrips => !isHideTrips);
    } else if (payload === "HIDE_COFFEES") {
      setIsHideCoffees(isHideCoffees => !isHideCoffees);
    } else if (payload === "HIDE_CITIES") {
      setIsHideCities(isHideCities => !isHideCities);
    } else if (payload === "HIDE_COUNTRIES") {
      setIsHideCountries(isHideCountries => !isHideCountries);
    } else if (payload === "HIDE_CONTINENTS") {
      setIsHideContinents(isHideContinents => !isHideContinents);
    } else if (payload === "AUTO_LOCATION_REPORT") {
      setIsAutoLocationReport(isAutoLocationReport => !isAutoLocationReport);
    }
    await toggleSettingsFn({
      variables: { payload }
    });
  };
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
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {loading ? (
        <Loader />
      ) : (
        <View>
          <Bold>EditProfile</Bold>
          <Bold>{me.user.username}</Bold>
          <ToggleContainer>
            <Item>
              <ToggleText>DARK MODE</ToggleText>
              <ToggleIcon onPress={toggleTheme}>
                <NavIcon
                  size={20}
                  name={
                    Platform.OS === "ios"
                      ? theme
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : theme
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                />
              </ToggleIcon>
            </Item>
            {isDarkMode ? (
              <ExplainText>Set to make light background.</ExplainText>
            ) : (
              <ExplainText>Set to make dark background.</ExplainText>
            )}

            <Item>
              <ToggleText>HIDE TRIPS</ToggleText>
              <ToggleIcon onPress={() => onPressToggleIcon("HIDE_TRIPS")}>
                <NavIcon
                  size={20}
                  name={
                    Platform.OS === "ios"
                      ? isHideTrips
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : isHideTrips
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                />
              </ToggleIcon>
            </Item>
            <ExplainText>
              If you set your trips hide, only you can see your trips, otherwise
              only number of trips and your trip distance are shown.
            </ExplainText>

            <Item>
              <ToggleText>HIDE COFFEES</ToggleText>
              <ToggleIcon onPress={() => onPressToggleIcon("HIDE_COFFEES")}>
                <NavIcon
                  size={20}
                  name={
                    Platform.OS === "ios"
                      ? isHideCoffees
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : isHideCoffees
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                />
              </ToggleIcon>
            </Item>
            <ExplainText>
              If you set your coffees hide, only you can see you coffees
              request, otherwise only number of coffees request is shown.
            </ExplainText>

            <Item>
              <ToggleText>HIDE CITIES</ToggleText>
              <ToggleIcon onPress={() => onPressToggleIcon("HIDE_CITIES")}>
                <NavIcon
                  size={20}
                  name={
                    Platform.OS === "ios"
                      ? isHideCities
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : isHideCities
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                />
              </ToggleIcon>
            </Item>
            <ExplainText>
              If you set your cities hide, only you can see cities where you've
              been before, otherwise only number of cities is shown.
            </ExplainText>

            <Item>
              <ToggleText>HIDE COUNTRIES</ToggleText>
              <ToggleIcon onPress={() => onPressToggleIcon("HIDE_COUNTRIES")}>
                <NavIcon
                  size={20}
                  name={
                    Platform.OS === "ios"
                      ? isHideCountries
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : isHideCities
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                />
              </ToggleIcon>
            </Item>
            <ExplainText>
              If you set your coutries hide, only you can see countries where
              You've been to before, otherwise only number of countries is shown.
            </ExplainText>

            <Item>
              <ToggleText>HIDE CONTINENTS</ToggleText>
              <ToggleIcon onPress={() => onPressToggleIcon("HIDE_CONTINENTS")}>
                <NavIcon
                  size={20}
                  name={
                    Platform.OS === "ios"
                      ? isHideContinents
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : isHideContinents
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                />
              </ToggleIcon>
            </Item>
            <ExplainText>
              If you set your coutries hide, only you can see countries where
              You've been to before, otherwise only number of countries is shown.
            </ExplainText>

            <Item>
              <ToggleText>AUTO LOCATION REPORT</ToggleText>
              <ToggleIcon
                onPress={() => onPressToggleIcon("AUTO_LOCATION_REPORT")}
              >
                <NavIcon
                  size={20}
                  name={
                    Platform.OS === "ios"
                      ? isAutoLocationReport
                        ? "ios-radio-button-on"
                        : "ios-radio-button-off"
                      : isAutoLocationReport
                      ? "md-radio-button-on"
                      : "md-radio-button-off"
                  }
                />
              </ToggleIcon>
            </Item>
            <ExplainText>
              If you set auto location report off, the app cannot find where you
              are. Your lacation will be shown on your profile
            </ExplainText>
          </ToggleContainer>
        </View>
      )}
    </ScrollView>
  );
};
