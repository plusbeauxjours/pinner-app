import React, { useState } from "react";
import styled from "styled-components";
import Loader from "../../../components/Loader";
import UserRow from "../../../components/UserRow";
import { useQuery, useMutation } from "react-apollo-hooks";
import {
  RECOMMEND_USERS,
  RECOMMEND_LOCATIONS,
  REQUEST_COFFEE
} from "./RequestCoffeeQueries";
import { useLocation } from "../../../context/LocationContext";
import { RefreshControl, Platform } from "react-native";
import Swiper from "react-native-swiper";
import { GET_COFFEES, ME, DELETE_COFFEE } from "../../../sharedQueries";
import {
  Me,
  GetCoffees,
  GetCoffeesVariables,
  RecommendUsers,
  RecommendUsersVariables,
  RecommendLocations,
  RecommendLocationsVariables,
  RequestCoffee,
  RequestCoffeeVariables,
  DeleteCoffee,
  DeleteCoffeeVariables
} from "../../../types/api";
import Modal from "react-native-modal";
import { useTheme } from "../../../context/ThemeContext";
import CoffeeDetail from "../../CoffeeDetail/index";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useMe } from "../../../context/MeContext";
// import SearchCityPhoto from "../../../components/SearchCityPhoto";
// import { countries } from "../../../../countryData";
import Toast from "react-native-root-toast";
import CountryPicker, { DARK_THEME } from "react-native-country-picker-modal";

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bgColor};
  padding: 0 10px 0 10px;
`;

const UserContainer = styled.View`
  padding: 0 5px 0 5px;
`;
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
const CoffeeSubmitBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  height: 40px;
  margin: 0 5px 5px 5px;
  border: 0.5px solid #999;
  border-radius: 5px;
`;
const CoffeeText = styled.Text`
  font-size: 16;
  font-weight: 500;
  color: ${props => props.theme.color};
`;
const Footer = styled.View`
  background-color: ${props => props.theme.bgColor};
`;

const CityBold = styled.Text`
  font-weight: 500;
  color: ${props => props.theme.color};
`;
const Location = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.color};
`;
const SearchCityContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const SearchHeaderUserContainer = styled.View`
  margin-left: 10px;
  flex-direction: column;
`;
export default ({ navigation }) => {
  const me = useMe();
  const location = useLocation();
  const isDarkMode = useTheme();
  const [nationalityModalOpen, setNationalityModalOpen] = useState<boolean>(
    false
  );
  const [residenceModalOpen, setResidenceModalOpen] = useState<boolean>(false);
  const [nationalityCode, setNationalityCode] = useState<any>("");
  const [residenceCode, setResidenceCode] = useState<any>("");
  const [gender, setGender] = useState<string>("");
  const [userName, setUserName] = useState<string>(me.user.username);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [coffeeId, setCoffeeId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { showActionSheetWithOptions } = useActionSheet();
  const requestCoffee = () => {
    showActionSheetWithOptions(
      {
        options: [
          "Everyone",
          me.user.profile.nationality
            ? `Nationality: ${me.user.profile.nationality.countryName} ${me.user.profile.nationality.countryEmoji}`
            : "Nationality",
          me.user.profile.residence
            ? `Residence: ${me.user.profile.residence.countryName} ${me.user.profile.residence.countryEmoji}`
            : "Residence",
          me.user.profile.gender
            ? (() => {
                switch (me.user.profile.gender) {
                  case "MALE":
                    return "Gender: Male";
                  case "FEMALE":
                    return "Gender: Female";
                  case "OTHER":
                    return "Gender: Other";
                  default:
                    return null;
                }
              })()
            : "Gender",
          "Cancel"
        ],
        cancelButtonIndex: 4,
        title: `Choose a target.`,
        showSeparators: true
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          requestCoffeeFn({
            variables: {
              target: "everyone",
              currentCityId: location.currentCityId
            }
          });
          toast("Requested");
        } else if (buttonIndex === 1) {
          if (me.user.profile.nationality) {
            await requestCoffeeFn({
              variables: {
                target: "nationality",
                currentCityId: location.currentCityId,
                countryCode: me.user.profile.nationality.countryCode
              }
            });
            toast("Requested");
          } else {
            setNationalityModalOpen(true);
          }
        } else if (buttonIndex === 2) {
          if (me.user.profile.residence) {
            await requestCoffeeFn({
              variables: {
                target: "residence",
                currentCityId: location.currentCityId,
                countryCode: me.user.profile.residence.countryCode
              }
            });
            toast("Requested");
          } else {
            setResidenceModalOpen(true);
          }
        } else if (buttonIndex === 3) {
          if (me.user.profile.gender) {
            await requestCoffeeFn({
              variables: {
                target: "gender",
                currentCityId: location.currentCityId,
                countryCode: me.user.profile.gender
              }
            });
            toast("Requested");
          } else {
            onOpenGenderActionSheet();
          }
        } else {
          null;
        }
      }
    );
  };
  const onOpenGenderActionSheet = () => {
    showActionSheetWithOptions(
      {
        options: ["Male", "Female", "Other", "Cancel"],
        cancelButtonIndex: 3,
        showSeparators: true
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          await requestCoffeeFn({
            variables: {
              target: "gender",
              currentCityId: location.currentCityId,
              gender: "MALE"
            }
          });
          toast("Requested");
        } else if (buttonIndex === 1) {
          await requestCoffeeFn({
            variables: {
              target: "gender",
              currentCityId: location.currentCityId,
              gender: "FEMALE"
            }
          });
          toast("Requested");
        } else if (buttonIndex === 2) {
          await requestCoffeeFn({
            variables: {
              target: "gender",
              currentCityId: location.currentCityId,
              gender: "OTHER"
            }
          });
          toast("Requested");
        } else {
          null;
        }
      }
    );
  };
  const {
    data: coffeeData,
    loading: coffeeLoading,
    refetch: coffeeRefetch
  } = useQuery<GetCoffees, GetCoffeesVariables>(GET_COFFEES, {
    variables: { location: "city", cityId: location.currentCityId }
  });
  const [requestCoffeeFn] = useMutation<RequestCoffee, RequestCoffeeVariables>(
    REQUEST_COFFEE,
    {
      update(cache, { data: { requestCoffee } }) {
        try {
          const meData = cache.readQuery<Me>({
            query: ME
          });
          if (meData) {
            if (!meData.me.user.profile.nationality) {
              meData.me.user.profile.nationality =
                requestCoffee.coffee.host.profile.nationality;
            }
            if (!meData.me.user.profile.residence) {
              meData.me.user.profile.residence =
                requestCoffee.coffee.host.profile.residence;
            }
            if (!meData.me.user.profile.gender) {
              meData.me.user.profile.gender =
                requestCoffee.coffee.host.profile.gender;
            }
            cache.writeQuery({
              query: ME,
              data: meData
            });
          }
        } catch (e) {
          console.log(e);
        }
        try {
          const profileData = cache.readQuery<GetCoffees, GetCoffeesVariables>({
            query: GET_COFFEES,
            variables: {
              userName,
              location: "profile"
            }
          });
          if (profileData) {
            profileData.getCoffees.coffees.push(requestCoffee.coffee);
            cache.writeQuery({
              query: GET_COFFEES,
              variables: {
                userName,
                location: "profile"
              },
              data: profileData
            });
          }
        } catch (e) {
          console.log(e);
        }
        try {
          const feedData = cache.readQuery<GetCoffees, GetCoffeesVariables>({
            query: GET_COFFEES,
            variables: {
              cityId: location.currentCityId,
              location: "city"
            }
          });
          if (feedData) {
            feedData.getCoffees.coffees.unshift(requestCoffee.coffee);
            cache.writeQuery({
              query: GET_COFFEES,
              variables: {
                cityId: location.currentCityId,
                location: "city"
              },
              data: feedData
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  );
  const {
    data: recommendUserData,
    loading: recommendUserLoading,
    refetch: recommendUserRefetch
  } = useQuery<RecommendUsers, RecommendUsersVariables>(RECOMMEND_USERS);
  const {
    data: recommendLocationData,
    loading: recommendLocationLoading,
    refetch: recommendLocationRefetch
  } = useQuery<RecommendLocations, RecommendLocationsVariables>(
    RECOMMEND_LOCATIONS
  );
  const [deleteCoffeeFn] = useMutation<DeleteCoffee, DeleteCoffeeVariables>(
    DELETE_COFFEE,
    {
      update(cache, { data: { deleteCoffee } }) {
        try {
          const profileData = cache.readQuery<GetCoffees, GetCoffeesVariables>({
            query: GET_COFFEES,
            variables: {
              userName,
              location: "profile"
            }
          });
          if (profileData) {
            profileData.getCoffees.coffees = profileData.getCoffees.coffees.filter(
              i => i.uuid !== deleteCoffee.coffeeId
            );
            cache.writeQuery({
              query: GET_COFFEES,
              variables: {
                userName,
                location: "profile"
              },
              data: profileData
            });
          }
        } catch (e) {
          console.log(e);
        }
        try {
          const feedData = cache.readQuery<GetCoffees, GetCoffeesVariables>({
            query: GET_COFFEES,
            variables: {
              cityId: location.currentCityId,
              location: "city"
            }
          });
          if (feedData) {
            feedData.getCoffees.coffees = feedData.getCoffees.coffees.filter(
              i => i.uuid !== deleteCoffee.coffeeId
            );
            cache.writeQuery({
              query: GET_COFFEES,
              variables: {
                cityId: location.currentCityId,
                location: "city"
              },
              data: feedData
            });
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
  );
  const cancelCoffee = coffeeId => {
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        title: "Are you sure to cancel?"
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          try {
            deleteCoffeeFn({
              variables: {
                coffeeId
              }
            });
            setModalOpen(false);
            toast("Canceld");
          } catch (e) {
            console.log(e);
          }
        }
      }
    );
  };
  const toast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  };
  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await coffeeRefetch();
      await recommendUserRefetch();
      await recommendLocationRefetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };
  const onPress = coffeeId => {
    setModalOpen(true);
    setCoffeeId(coffeeId);
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
  const onSelectNationality = async (country: any) => {
    await requestCoffeeFn({
      variables: {
        target: "nationality",
        currentCityId: location.currentCityId,
        countryCode: country.cca2
      }
    });
    toast("Requested");
    setNationalityModalOpen(false);
  };
  const onSelectrRsidence = async (country: any) => {
    await requestCoffeeFn({
      variables: {
        target: "residence",
        currentCityId: location.currentCityId,
        countryCode: country.cca2
      }
    });
    toast("Requested");
    setResidenceModalOpen(false);
  };
  if (recommendUserLoading || recommendLocationLoading || coffeeLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    const {
      recommendUsers: { users: recommendUsers = null } = {}
    } = recommendUserData;
    const {
      recommendLocations: { cities: recommendLocations = null } = {}
    } = recommendLocationData;
    const { getCoffees: { coffees = null } = {} } = ({} = coffeeData);
    return (
      <>
        <Modal
          style={{
            margin: 0,
            alignItems: "flex-start"
          }}
          isVisible={nationalityModalOpen}
          backdropColor={isDarkMode && isDarkMode === true ? "black" : "white"}
          onBackdropPress={() => setNationalityModalOpen(false)}
          onBackButtonPress={() =>
            Platform.OS !== "ios" && setNationalityModalOpen(false)
          }
          onModalHide={() => setNationalityModalOpen(false)}
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.9}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={200}
        >
          <CountryPicker
            theme={isDarkMode && DARK_THEME}
            countryCode={nationalityCode}
            withFilter={true}
            withFlag={true}
            withAlphaFilter={true}
            withEmoji={true}
            onSelect={onSelectNationality}
            withModal={false}
            onClose={() => {
              setNationalityCode(""), setNationalityModalOpen(false);
            }}
          />
        </Modal>
        <Modal
          style={{
            margin: 0,
            alignItems: "flex-start"
          }}
          isVisible={residenceModalOpen}
          backdropColor={isDarkMode && isDarkMode === true ? "black" : "white"}
          onBackdropPress={() => setResidenceModalOpen(false)}
          onBackButtonPress={() =>
            Platform.OS !== "ios" && setResidenceModalOpen(false)
          }
          onModalHide={() => setResidenceModalOpen(false)}
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.9}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={200}
        >
          <CountryPicker
            theme={isDarkMode && DARK_THEME}
            countryCode={residenceCode}
            withFilter={true}
            withFlag={true}
            withAlphaFilter={true}
            withEmoji={true}
            onSelect={onSelectrRsidence}
            withModal={false}
            onClose={() => {
              setResidenceCode(""), setResidenceModalOpen(false);
            }}
          />
        </Modal>
        <Modal
          style={{
            margin: 0,
            alignItems: "flex-start"
          }}
          isVisible={modalOpen}
          backdropColor={isDarkMode && isDarkMode === true ? "black" : "white"}
          onBackdropPress={() => setModalOpen(false)}
          onBackButtonPress={() => Platform.OS !== "ios" && setModalOpen(false)}
          onModalHide={() => setModalOpen(false)}
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.9}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={200}
        >
          <CoffeeDetail
            coffeeId={coffeeId}
            setModalOpen={setModalOpen}
            isStaying={true}
          />
        </Modal>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Container>
            {coffees && coffees.length !== 0 && (
              <Item>
                <Title>NEED SOME COFFEE NOW</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: coffees.length < 3 ? 90 : 135 }}
                    paginationStyle={{ bottom: -15 }}
                    loop={false}
                  >
                    {chunk(coffees).map((coffeeColumn, index) => {
                      return (
                        <UserColumn key={index}>
                          {coffeeColumn.map((coffee: any, index: any) => {
                            return (
                              <Touchable
                                key={index}
                                onPress={() => onPress(coffee.uuid)}
                              >
                                <UserRow
                                  key={coffee.id}
                                  coffee={coffee}
                                  type={"coffee"}
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
            {recommendUsers && recommendUsers.length !== 0 && (
              <Item>
                <Title>RECOMMEND USERS</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: recommendUsers.length < 3 ? 90 : 135 }}
                    paginationStyle={{ bottom: -15 }}
                    loop={false}
                  >
                    {chunk(recommendUsers).map((users, index) => {
                      return (
                        <UserColumn key={index}>
                          {users.map((user: any, index: any) => {
                            return (
                              <Touchable
                                key={index}
                                onPress={() =>
                                  navigation.push("UserProfileTabs", {
                                    username: user.username,
                                    isSelf: user.isSelf
                                  })
                                }
                              >
                                <UserRow user={user} type={"user"} />
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
            {recommendLocations && recommendLocations.length !== 0 && (
              <Item>
                <Title>RECOMMEND LOCATIONS</Title>
                <UserContainer>
                  <Swiper
                    style={{ height: recommendLocations.length < 3 ? 90 : 135 }}
                    paginationStyle={{ bottom: -15 }}
                    loop={false}
                  >
                    {chunk(recommendLocations).map((locations, index) => {
                      return (
                        <UserColumn key={index}>
                          {locations.map((city: any, index: any) => {
                            return (
                              <Touchable
                                key={index}
                                onPress={() =>
                                  navigation.push("CityProfileTabs", {
                                    cityId: city.cityId,
                                    countryCode: city.country.countryCode,
                                    continentCode:
                                      city.country.continent.continentCode
                                  })
                                }
                              >
                                <UserRow city={city} type={"city"} />
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
          </Container>
        </ScrollView>
        <Footer>
          {/* <Touchable
            onPress={() =>
              navigation.push("CityProfileTabs", {
                cityId: location.currentCityId,
                countryCode: location.currentCountryCode,
                continentCode: countries.find(
                  i => i.code === location.currentCountryCode
                ).continent
              })
            }
          >
            <SearchCityContainer>
              <SearchCityPhoto cityId={location.currentCityId} />
              <SearchHeaderUserContainer>
                <CityBold>{location.currentCityName}</CityBold>
                <Location>
                  {location.currentCountryCode
                    ? countries.find(
                        i => i.code === location.currentCountryCode
                      ).name
                    : location.currentCountryCode}
                </Location>
              </SearchHeaderUserContainer>
            </SearchCityContainer>
          </Touchable> */}
          {coffees &&
          coffees.length !== 0 &&
          coffees.find(i => i.host.username === userName) ? (
            <CoffeeSubmitBtn
              // disabled={deleteCoffeeLoading}
              onPress={() =>
                cancelCoffee(
                  coffees.find(i => i.host.username === userName).uuid
                )
              }
            >
              <CoffeeText>CANCEL COFFEE</CoffeeText>
            </CoffeeSubmitBtn>
          ) : (
            <CoffeeSubmitBtn
              // disabled={requestLoading}
              onPress={() => requestCoffee()}
            >
              <CoffeeText>REQUEST COFFEE</CoffeeText>
            </CoffeeSubmitBtn>
          )}
        </Footer>
      </>
    );
  }
};
