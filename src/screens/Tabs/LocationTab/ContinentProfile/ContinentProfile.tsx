import React, { useState } from "react";
import { RefreshControl, Platform } from "react-native";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { useTheme } from "../../../../context/ThemeContext";
import Loader from "../../../../components/Loader";
import UserRow from "../../../../components/UserRow";
import Swiper from "react-native-swiper";
import {
  SlackReportLocations,
  SlackReportLocationsVariables,
  ContinentProfile,
  ContinentProfileVariables
} from "../../../../types/api";
import { SLACK_REPORT_LOCATIONS } from "../../../../sharedQueries";
import { CONTINENT_PROFILE } from "./ContinentProfileQueries";
import { countries as countryData } from "../../../../../countryData";
import constants from "../../../../../constants";
import Toast from "react-native-root-toast";
import { Ionicons } from "@expo/vector-icons";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { withNavigation } from "react-navigation";
import { useMe } from "../../../../context/MeContext";

const Container = styled.View`
  background-color: ${props => props.theme.bgColor};
  padding: 0 15px 0 15px;
`;

const Text = styled.Text`
  color: ${props => props.theme.color};
`;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 34px;
  color: ${props => props.theme.color};
`;

const View = styled.View`
  justify-content: center;
  margin: 15px 0 15px 0;
`;
const UserContainer = styled.View``;

const UserColumn = styled.View``;

const Item = styled.View`
  flex: 1;
  margin-bottom: 25px;
`;
const Title = styled.Text`
  font-weight: 500;
  font-size: 18px;
  margin-bottom: 5px;
  color: ${props => props.theme.color};
`;
const Touchable = styled.TouchableOpacity``;
const ScrollView = styled.ScrollView`
  background-color: ${props => props.theme.bgColor};
`;
const LoaderContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bgColor};
  justify-content: center;
  align-items: center;
`;
const IconTouchable = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  margin-left: 10px;
`;
const LocationNameContainer = styled.View`
  width: ${constants.width - 30};
  align-self: flex-start;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;
const NoPhotoContainer = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.bgColor};
`;
export default withNavigation(({ navigation }) => {
  const { me, loading: meLoading } = useMe();
  const isDarkMode = useTheme();
  const [continentCode, setContinentCode] = useState<string>(
    navigation.getParam("continentCode") ||
      countryData.find(
        i => i.code === me.user.profile.currentCity.country.countryCode
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
          marginBottom: 10
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400"
        },
        separatorStyle: { opacity: 0.5 }
      },
      async buttonIndex => {
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
        delay: 0
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
          marginBottom: 10
        },
        textStyle: { color: isDarkMode ? "#EFEFEF" : "#161616" },
        titleTextStyle: {
          color: isDarkMode ? "#EFEFEF" : "#161616",
          fontWeight: "400"
        },
        separatorStyle: { opacity: 0.5 }
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          slackReportLocationsFn({
            variables: {
              targetLocationId: continentCode,
              targetLocationType: "continent",
              payload
            }
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
        countries = null
      } = {}
    } = {},
    loading: profileLoading,
    refetch: profileRefetch
  } = useQuery<ContinentProfile, ContinentProfileVariables>(CONTINENT_PROFILE, {
    variables: { continentCode, page: 1 }
  });
  const [
    slackReportLocationsFn,
    { loading: slackReportLocationsLoading }
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
  const chunk = arr => {
    let chunks = [],
      i = 0,
      n = arr.length;
    while (i < n) {
      chunks.push(arr.slice(i, (i += 3)));
    }
    return chunks;
  };
  if (profileLoading || meLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={"#999"}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <Container>
          {continent && (
            <View>
              {continent.continentPhoto ? (
                <ProgressiveImage
                  tint={isDarkMode ? "dark" : "light"}
                  style={{
                    height: constants.width - 30,
                    width: constants.width - 30,
                    borderRadius: 3
                  }}
                  preview={{
                    uri: continent.continentPhoto
                  }}
                  uri={continent.continentPhoto}
                />
              ) : (
                <NoPhotoContainer>
                  <Text>NO</Text>
                  <Text>PHOTO</Text>
                </NoPhotoContainer>
              )}
              <LocationNameContainer>
                <Bold>{continent.continentName}</Bold>
                <IconTouchable onPress={() => selectReportLocation()}>
                  <Ionicons
                    name={Platform.OS === "ios" ? "ios-list" : "md-list"}
                    size={25}
                    color={"#999"}
                  />
                </IconTouchable>
              </LocationNameContainer>
              {count && count !== 0 ? (
                <Text>
                  You've been to {continent.continentName} {count}
                  {count === 1 ? " time" : " times"}
                </Text>
              ) : null}
            </View>
          )}
          {continents && continents.length !== 0 && (
            <Item>
              <Title>CONTINENTS</Title>
              <UserContainer>
                <Swiper
                  style={{ height: 135 }}
                  paginationStyle={{ bottom: -15 }}
                  loop={false}
                  index={0}
                  dotColor={isDarkMode ? "#424242" : "#DADADA"}
                  activeDotStyle={{
                    backgroundColor: isDarkMode ? "#EFEFEF" : "#161616",
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginLeft: 3,
                    marginRight: 3,
                    marginTop: 3,
                    marginBottom: 3
                  }}
                >
                  {chunk(continents).map((continentItem, index) => {
                    return (
                      <UserColumn key={index}>
                        {continentItem.map((continent: any, index: any) => {
                          return (
                            <Touchable
                              key={index}
                              onPress={() => {
                                if (continentCode !== continent.continentCode) {
                                  navigation.push("ContinentProfile", {
                                    continentCode: continent.continentCode
                                  });
                                }
                              }}
                            >
                              <UserRow
                                continent={continent}
                                type={"continent"}
                              />
                            </Touchable>
                          );
                        })}
                      </UserColumn>
                    );
                  })}
                </Swiper>
              </UserContainer>
            </Item>
          )}
          {countries && countries.length !== 0 && (
            <Item>
              <Title>
                {continent.countryCount}
                {continent.countryCount === 1 ? " COUNTRY" : " COUNTRIES"}
              </Title>
              {countries.map((country, index) => (
                <Touchable
                  key={index}
                  onPress={() => {
                    if (
                      navigation.getParam("countryCode") !==
                        country.countryCode ||
                      navigation.getParam("cityId")
                    ) {
                      navigation.push("CountryProfileTabs", {
                        countryCode: country.countryCode,
                        continentCode: country.continent.continentCode
                      });
                    } else {
                      navigation.goBack(null);
                    }
                  }}
                >
                  <UserRow country={country} type={"country"} />
                </Touchable>
              ))}
            </Item>
          )}
        </Container>
      </ScrollView>
    );
  }
});
