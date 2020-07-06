import React from "react";
import { RefreshControl } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import styled from "styled-components";
import Loader from "../../../../components/Loader";
import ItemRow from "../../../../components/ItemRow";
import Swiper from "react-native-swiper";

import constants from "../../../../../constants";
import { countries as countryData } from "../../../../../countryData";
import { darkMode, lightMode } from "../../../../styles/mapStyles";
import { FontAwesome } from "@expo/vector-icons";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import { withNavigation } from "react-navigation";

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

const Flag = styled.Text`
  font-size: 24px;
  color: ${(props) => props.theme.color};
`;

const View = styled.View`
  justify-content: center;
  margin: 15px 0 15px 0;
`;

const CountryNameContainer = styled.View`
  align-items: center;
  flex-direction: row;
`;

const UserContainer = styled.View``;

const UserColumn = styled.View``;

const Item = styled.View`
  flex: 1;
  margin-bottom: 25px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.Text`
  font-weight: 500;
  margin-left: 5px;
  font-size: 18px;
  margin-bottom: 5px;
  color: ${(props) => props.theme.color};
`;

const CountryTitle = styled(Title)`
  text-transform: uppercase;
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
  countriesLoading: boolean;
  meLoading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  isDarkMode: boolean;
  selectReportLocation: () => void;
  count: number;
  chunk: (arr: any) => any[];
  countries: any;
  country: any;
  mapOpen: boolean;
  setMapOpen: (mapOpen: boolean) => void;
  getResidenceUsersLoading: boolean;
  residenceUsers: any;
  getNationalityUsersLoading: boolean;
  nationalityUsers: any;
  cities: any;
}

const CountryProfilePresenter: React.FC<IProps> = ({
  navigation,
  profileLoading,
  countriesLoading,
  meLoading,
  refreshing,
  onRefresh,
  isDarkMode,
  selectReportLocation,
  count,
  chunk,
  countries,
  country,
  mapOpen,
  setMapOpen,
  getResidenceUsersLoading,
  residenceUsers,
  getNationalityUsersLoading,
  nationalityUsers,
  cities,
}) => {
  if (profileLoading || countriesLoading || meLoading) {
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
          {country && (
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
                      latitude: country.latitude,
                      longitude: country.longitude,
                      latitudeDelta: 10,
                      longitudeDelta: 10,
                    }}
                    rotateEnabled={false}
                    customMapStyle={
                      isDarkMode && isDarkMode === true ? darkMode : lightMode
                    }
                  />
                </MapContainer>
              ) : (
                <Touchable onPress={() => setMapOpen(true)}>
                  {country.countryPhoto ? (
                    <ProgressiveImage
                      tint={isDarkMode ? "dark" : "light"}
                      style={{
                        height: constants.width - 30,
                        width: constants.width - 30,
                        borderRadius: 3,
                      }}
                      preview={{
                        uri: country.countryPhoto,
                      }}
                      uri={country.countryPhoto}
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
                <CountryNameContainer>
                  <Bold>{country.countryName}</Bold>
                  <Flag>{country.countryEmoji}</Flag>
                </CountryNameContainer>
                <IconTouchable onPress={() => selectReportLocation()}>
                  <FontAwesome
                    name="exclamation-circle"
                    size={18}
                    color={"#999"}
                  />
                </IconTouchable>
              </LocationNameContainer>
              {count && count !== 0 ? (
                <Text>
                  You've been to {country.countryName} {count}
                  {count === 1 ? " time" : " times"}
                </Text>
              ) : null}
            </View>
          )}
          {getResidenceUsersLoading && (
            <LoaderContainer>
              <Loader />
            </LoaderContainer>
          )}
          {residenceUsers && residenceUsers.length !== 0 && (
            <Item>
              {residenceUsers.length === 1 ? (
                <TitleContainer>
                  <Title>USER who is staying in {country.countryName}</Title>
                </TitleContainer>
              ) : (
                <TitleContainer>
                  <Title>USERS who are staying in {country.countryName}</Title>
                  {residenceUsers.length > 15 && (
                    <Touchable
                      onPress={() =>
                        navigation.push("UsersResidence", {
                          countryCode: country.countryCode,
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
                  style={{ height: residenceUsers.length < 3 ? 90 : 135 }}
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
                  {chunk(residenceUsers).map((users, index: any) => {
                    return (
                      <UserColumn key={index}>
                        {users.map((user: any, index: any) => {
                          return (
                            <Touchable
                              key={index}
                              onPress={() =>
                                navigation.push("UserProfile", {
                                  uuid: user.uuid,
                                  isSelf: user.isSelf,
                                })
                              }
                            >
                              <ItemRow
                                user={user}
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
          {getNationalityUsersLoading && (
            <LoaderContainer>
              <Loader />
            </LoaderContainer>
          )}
          {nationalityUsers && nationalityUsers.length !== 0 && (
            <Item>
              {nationalityUsers.length === 1 ? (
                <TitleContainer>
                  <Title>USER who is from {country.countryName}</Title>
                </TitleContainer>
              ) : (
                <TitleContainer>
                  <Title>USERS who are from {country.countryName}</Title>
                  {nationalityUsers.length > 15 && (
                    <Touchable
                      onPress={() =>
                        navigation.push("UsersNationality", {
                          countryCode: country.countryCode,
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
                  style={{ height: nationalityUsers.length < 3 ? 90 : 135 }}
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
                  {chunk(nationalityUsers).map((users, index: any) => {
                    return (
                      <UserColumn key={index}>
                        {users.map((user: any, index: any) => {
                          return (
                            <Touchable
                              key={index}
                              onPress={() =>
                                navigation.push("UserProfile", {
                                  uuid: user.uuid,
                                  isSelf: user.isSelf,
                                })
                              }
                            >
                              <ItemRow
                                user={user}
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
          {countries && countries.length !== 0 && (
            <Item>
              <CountryTitle>{country.continent.continentName}</CountryTitle>
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
                    marginBottom: 3,
                  }}
                >
                  {chunk(countries).map((countryItem, index) => {
                    return (
                      <UserColumn key={index}>
                        {countryItem.map((country: any, index: any) => {
                          return (
                            <Touchable
                              key={index}
                              onPress={() =>
                                navigation.push("CountryProfileTabs", {
                                  countryCode: country.countryCode,
                                  continentCode: country.continentCode,
                                })
                              }
                            >
                              <ItemRow country={country} type={"country"} />
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
          {cities && cities.length !== 0 && (
            <Item>
              <Title>
                {country.cityCount}
                {country.cityCount === 1 ? " CITY" : " CITIES"}
              </Title>
              {cities.map((city, index) => (
                <Touchable
                  key={index}
                  onPress={() =>
                    navigation.push("CityProfileTabs", {
                      cityId: city.cityId,
                      countryCode: city.country.countryCode,
                      continentCode: countryData.find(
                        (i) => i.code === city.country.countryCode
                      ).continent,
                    })
                  }
                >
                  <ItemRow city={city} type={"city"} />
                </Touchable>
              ))}
            </Item>
          )}
        </Container>
      </ScrollView>
    );
  }
};

export default withNavigation(CountryProfilePresenter);
