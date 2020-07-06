import React from "react";
import { RefreshControl } from "react-native";

import styled from "styled-components";
import Swiper from "react-native-swiper";
import { FontAwesome } from "@expo/vector-icons";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import { withNavigation } from "react-navigation";

import Loader from "../../../../components/Loader";
import ItemRow from "../../../../components/ItemRow";
import constants from "../../../../../constants";

const Container = styled.View`
  background-color: ${(props) => props.theme.bgColor};
  padding: 0 15px 0 15px;
`;

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
  font-size: 18px;
  margin-bottom: 5px;
  color: ${(props) => props.theme.color};
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
  width: ${constants.width - 30};
  align-self: flex-start;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const NoPhotoContainer = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bgColor};
`;

interface IProps {
  navigation: any;
  profileLoading: boolean;
  meLoading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  isDarkMode: boolean;
  selectReportLocation: () => void;
  count: number;
  chunk: (arr: any) => any[];
  continent: any;
  countries: any;
  continents: any;
  continentCode: string;
}

const ContinentProfilePresenter: React.FC<IProps> = ({
  navigation,
  profileLoading,
  meLoading,
  refreshing,
  onRefresh,
  isDarkMode,
  selectReportLocation,
  count,
  chunk,
  continent,
  countries,
  continents,
  continentCode,
}) => {
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
                    borderRadius: 3,
                  }}
                  preview={{
                    uri: continent.continentPhoto,
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
                  <FontAwesome
                    name="exclamation-circle"
                    size={18}
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
                    marginBottom: 3,
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
                                    continentCode: continent.continentCode,
                                  });
                                }
                              }}
                            >
                              <ItemRow
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
                        continentCode: country.continent.continentCode,
                      });
                    } else {
                      navigation.goBack(null);
                    }
                  }}
                >
                  <ItemRow country={country} type={"country"} />
                </Touchable>
              ))}
            </Item>
          )}
        </Container>
      </ScrollView>
    );
  }
};

export default withNavigation(ContinentProfilePresenter);
