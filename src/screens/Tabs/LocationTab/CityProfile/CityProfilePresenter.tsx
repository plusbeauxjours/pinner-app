import React from "react";
import { RefreshControl } from "react-native";

import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import styled from "styled-components";
import Swiper from "react-native-swiper";
import { FontAwesome } from "@expo/vector-icons";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import { withNavigation } from "react-navigation";

import Loader from "../../../../components/Loader";
import ItemRow from "../../../../components/ItemRow";
import CityLikeBtn from "../../../../components/CityLikeBtn";
import constants from "../../../../../constants";
import { darkMode, lightMode } from "../../../../styles/mapStyles";
import { countries } from "../../../../../countryData";
import Weather from "../../../../components/Weather";

const Container = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  padding: 0 15px 0 15px;
`;

const MapContainer = styled.View``;

const Text = styled.Text`
  color: ${(props) => props.theme.color};
`;

const Bold = styled.Text`
  font-weight: 500;
  font-size: 34px;
  color: ${(props) => props.theme.color};
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
  margin-left: 5px;
  font-size: 18px;
  margin-bottom: 5px;
  color: ${(props) => props.theme.color};
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const More = styled.Text`
  margin-left: 20px;
  color: ${(props) => props.theme.greyColor};
`;

const Touchable = styled.TouchableOpacity``;

const ScrollView = styled.ScrollView`
  background-color: ${(props) => props.theme.bgColor};
`;

const LoaderContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
  justify-content: center;
  align-items: center;
`;

const InfoRow = styled.View`
  width: ${constants.width - 40};
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`;

const IconTouchable = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  margin-left: 10px;
`;

const LocationNameContainer = styled.View`
  width: ${constants.width - 40};
  margin-left: 5px;
  align-self: flex-start;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const LocationInfoContainer = styled.View`
  width: ${constants.width - 40};
  margin-left: 5px;
`;

const NoPhotoContainer = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bgColor};
  height: ${constants.width - 30};
  width: ${constants.width - 30};
  border-radius: 3;
  border: 0.5px solid #999;
`;

interface IProps {
  navigation: any;
  profileLoading: boolean;
  nearCitiesLoading: boolean;
  samenameCitiesLoading: boolean;
  meLoading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  city: any;
  isDarkMode: boolean;
  mapOpen: boolean;
  setMapOpen: (mapOpen: boolean) => void;
  count: number;
  nearCities: any;
  chunk: (arr: any) => any[];
  samenameCities: any;
  usersBefore: any;
  usersNow: any;
  selectReportLocation: () => void;
}

const CityProfilePresenter: React.FC<IProps> = ({
  navigation,
  profileLoading,
  nearCitiesLoading,
  samenameCitiesLoading,
  meLoading,
  refreshing,
  onRefresh,
  city,
  isDarkMode,
  mapOpen,
  setMapOpen,
  count,
  nearCities,
  chunk,
  samenameCities,
  usersBefore,
  usersNow,
  selectReportLocation,
}) => {
  if (
    profileLoading ||
    nearCitiesLoading ||
    samenameCitiesLoading ||
    meLoading
  ) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    return (
      <>
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
            {city && (
              <View>
                {mapOpen ? (
                  <MapContainer>
                    <MapView
                      provider={PROVIDER_GOOGLE}
                      style={{
                        height: constants.width - 30,
                        width: constants.width - 30,
                        borderRadius: 3,
                      }}
                      initialRegion={{
                        latitude: city.latitude,
                        longitude: city.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                      }}
                      loadingEnabled={true}
                      rotateEnabled={false}
                      customMapStyle={
                        isDarkMode && isDarkMode === true ? darkMode : lightMode
                      }
                    />
                  </MapContainer>
                ) : (
                  <Touchable onPress={() => setMapOpen(true)}>
                    {city.cityPhoto ? (
                      <ProgressiveImage
                        tint={isDarkMode ? "dark" : "light"}
                        style={{
                          height: constants.width - 30,
                          width: constants.width - 30,
                          borderRadius: 3,
                        }}
                        preview={{
                          uri: city.cityPhoto,
                        }}
                        uri={city.cityPhoto}
                      />
                    ) : (
                      <NoPhotoContainer>
                        <Text>NO</Text>
                        <Text>PHOTO</Text>
                      </NoPhotoContainer>
                    )}
                  </Touchable>
                )}
                <LocationNameContainer>
                  <Bold>{city.cityName}</Bold>
                  <IconTouchable onPress={() => selectReportLocation()}>
                    <FontAwesome
                      name="exclamation-circle"
                      size={18}
                      color={"#999"}
                    />
                  </IconTouchable>
                </LocationNameContainer>
                <LocationInfoContainer>
                  <Text>
                    {city.country.countryName} {city.country.countryEmoji}
                  </Text>
                  {count && count !== 0 ? (
                    <Text>
                      You've been to {city.cityName} {count}
                      {count === 1 ? " time" : " times"}
                    </Text>
                  ) : null}
                  <InfoRow>
                    <Weather
                      latitude={city.latitude}
                      longitude={city.longitude}
                    />
                    <CityLikeBtn
                      height={"15px"}
                      isLiked={city.isLiked}
                      cityId={city.cityId}
                      likeCount={city.likeCount}
                    />
                  </InfoRow>
                </LocationInfoContainer>
              </View>
            )}
            {nearCities && nearCities.length !== 0 && (
              <Item>
                <Title>NEAR CITIES</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: nearCities.length < 3 ? 90 : 135 }}
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
                      marginBottom: 3,
                    }}
                  >
                    {chunk(nearCities).map((cities, index: any) => {
                      return (
                        <UserColumn key={index}>
                          {cities.map((city: any, index: any) => {
                            return (
                              <Touchable
                                key={index}
                                onPress={() =>
                                  navigation.push("CityProfileTabs", {
                                    cityId: city.cityId,
                                    countryCode: city.country.countryCode,
                                    continentCode: countries.find(
                                      (i) => i.code === city.country.countryCode
                                    ).continent,
                                  })
                                }
                              >
                                <ItemRow city={city} type={"nearCity"} />
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
            {samenameCities && samenameCities.length !== 0 && (
              <Item>
                {samenameCities.length === 1 ? (
                  <Title>SAMENAME CITY</Title>
                ) : (
                  <Title>SAMENAME CITIES</Title>
                )}
                <UserContainer>
                  <Swiper
                    style={{ height: samenameCities.length < 3 ? 90 : 135 }}
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
                      marginBottom: 3,
                    }}
                  >
                    {chunk(samenameCities).map((cities, index: any) => {
                      return (
                        <UserColumn key={index}>
                          {cities.map((city: any, index: any) => {
                            return (
                              <Touchable
                                key={index}
                                onPress={() => {
                                  navigation.push("CityProfileTabs", {
                                    cityId: city.cityId,
                                    countryCode: city.country.countryCode,
                                    continentCode: countries.find(
                                      (i) => i.code === city.country.countryCode
                                    ).continent,
                                  });
                                }}
                              >
                                <ItemRow city={city} type={"nearCity"} />
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
            {usersBefore && usersBefore.length !== 0 && (
              <Item>
                {usersBefore.length === 1 ? (
                  <TitleContainer>
                    <Title>USER who is in {city.cityName}, BEFORE</Title>
                  </TitleContainer>
                ) : (
                  <TitleContainer>
                    <Title>USERS who are in {city.cityName}, BEFORE</Title>
                    {usersBefore.length > 15 && (
                      <Touchable
                        onPress={() =>
                          navigation.push("UsersBefore", {
                            cityId: city.cityId,
                            payload: "APP",
                          })
                        }
                      >
                        <More>More</More>
                      </Touchable>
                    )}
                  </TitleContainer>
                )}
                <UserContainer>
                  <Swiper
                    style={{ height: usersBefore.length < 3 ? 90 : 135 }}
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
                      marginBottom: 3,
                    }}
                  >
                    {chunk(usersBefore).map((users, index: any) => {
                      return (
                        <UserColumn key={index}>
                          {users.map((user: any, index: any) => {
                            return (
                              <Touchable
                                key={index}
                                onPress={() =>
                                  navigation.push("UserProfile", {
                                    uuid: user.actor.uuid,
                                    isSelf: user.actor.isSelf,
                                  })
                                }
                              >
                                <ItemRow
                                  user={user.actor}
                                  naturalTime={user.naturalTime}
                                  type={"userBefore"}
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
            {usersNow && usersNow.length !== 0 && (
              <Item>
                {usersNow.length === 1 ? (
                  <Title>USER who is in {city.cityName}, NOW</Title>
                ) : (
                  <Title>USERS who are in {city.cityName}, NOW</Title>
                )}
                {usersNow.map((user: any, index: any) => (
                  <Touchable
                    key={index}
                    onPress={() =>
                      navigation.push("UserProfile", {
                        uuid: user.uuid,
                        isSelf: user.isSelf,
                      })
                    }
                  >
                    <ItemRow user={user} type={"user"} />
                  </Touchable>
                ))}
              </Item>
            )}
          </Container>
        </ScrollView>
      </>
    );
  }
};

export default withNavigation(CityProfilePresenter);
