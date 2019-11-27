import React, { useState } from "react";
import styled from "styled-components";
import CountryPicker, { DARK_THEME } from "react-native-country-picker-modal";
import {
  RefreshControl,
  Platform,
  TouchableOpacity,
  SectionList
} from "react-native";
import Swiper from "react-native-swiper";
import Toast from "react-native-root-toast";
import { SimpleLineIcons } from "@expo/vector-icons";
import Loader from "../../../components/Loader";
import UserRow from "../../../components/UserRow";
import { useQuery, useMutation } from "react-apollo-hooks";
import {
  RECOMMEND_USERS,
  RECOMMEND_LOCATIONS,
  REQUEST_COFFEE
} from "./RequestCoffeeQueries";
import { useLocation } from "../../../context/LocationContext";
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
  DeleteCoffeeVariables,
  GetTripCities,
  GetTripCitiesVariables
} from "../../../types/api";
import Modal from "react-native-modal";
import { useTheme } from "../../../context/ThemeContext";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useMe } from "../../../context/MeContext";
import constants from "../../../../constants";
import Accordion from "react-native-collapsible/Accordion";
import CollapsibleAccordion from "../../../components/CollapsibleAccordion";
import { GET_TRIP_CITIES } from "./RequestCoffeeQueries";

const AccordionTitleContainer = styled.View`
  flex-direction: row;
  height: 20px;
  align-items: center;
  /* opacity: 0.1; */
  width: ${constants.width - 40};
  margin: 0 5px 0 5px;
  /* border-top-width: 0.5px;
  border-top-color: ${props => props.theme.shadowColor}; */
`;
const AccordionIcon = styled.View`
  width: 20;
  height: 20;
  position: absolute;
  top: 5;
  right: 0;
`;
const AccordionTitle = styled.Text`
  font-size: 9px;
  color: ${props => props.theme.color};
`;
const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bgColor};
  padding: 0 15px 0 15px;
`;
const CoffeeContainer = styled.View`
  /* border-bottom-width: 0.5px;
  border-bottom-color: ${props => props.theme.shadowColor}; */
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
const CoffeeText = styled.Text`
  font-size: 16;
  font-weight: 500;
  color: ${props => props.theme.color};
`;
const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
  background-color: ${props => props.theme.bgColor};
`;
const CoffeeSubmitContainer = styled.View`
  width: ${constants.width - 40};
  justify-content: center;
  align-items: center;
  height: 40px;
  border: 0.5px solid #999;
  border-radius: 5px;
`;
const CoffeeSubmitBtn = styled.TouchableOpacity`
  justify-content: center;
  padding: 0 5px 5px 5px;
`;
const EmptyView = styled.View`
  height: 10px;
`;
export default ({ navigation }) => {
  const { me, loading: meLoading } = useMe();
  const location = useLocation();
  const isDarkMode = useTheme();
  const [nationalityModalOpen, setNationalityModalOpen] = useState<boolean>(
    false
  );
  const [activeSections, setActiveSections] = useState<any>([0]);
  const [residenceModalOpen, setResidenceModalOpen] = useState<boolean>(false);
  const [nationalityCode, setNationalityCode] = useState<any>("");
  const [residenceCode, setResidenceCode] = useState<any>("");
  const userName = me.user.username;
  const [refreshing, setRefreshing] = useState<boolean>(false);
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
          try {
            requestCoffeeFn({
              variables: {
                target: "everyone",
                currentCityId: location.currentCityId
              }
            });
          } catch (e) {
            console.log(e);
          } finally {
            toast("Requested");
          }
        } else if (buttonIndex === 1) {
          if (me.user.profile.nationality) {
            try {
              await requestCoffeeFn({
                variables: {
                  target: "nationality",
                  currentCityId: location.currentCityId,
                  countryCode: me.user.profile.nationality.countryCode
                }
              });
            } catch (e) {
              console.log(e);
            } finally {
              toast("Requested");
            }
          } else {
            setNationalityModalOpen(true);
          }
        } else if (buttonIndex === 2) {
          if (me.user.profile.residence) {
            try {
              await requestCoffeeFn({
                variables: {
                  target: "residence",
                  currentCityId: location.currentCityId,
                  countryCode: me.user.profile.residence.countryCode
                }
              });
            } catch (e) {
              console.log(e);
            } finally {
              toast("Requested");
            }
          } else {
            setResidenceModalOpen(true);
          }
        } else if (buttonIndex === 3) {
          if (me.user.profile.gender) {
            try {
              await requestCoffeeFn({
                variables: {
                  target: "gender",
                  currentCityId: location.currentCityId,
                  countryCode: me.user.profile.gender
                }
              });
            } catch (e) {
              console.log(e);
            } finally {
              toast("Requested");
            }
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
          try {
            await requestCoffeeFn({
              variables: {
                target: "gender",
                currentCityId: location.currentCityId,
                gender: "MALE"
              }
            });
          } catch (e) {
            console.log(e);
          } finally {
            toast("Requested");
          }
        } else if (buttonIndex === 1) {
          try {
            await requestCoffeeFn({
              variables: {
                target: "gender",
                currentCityId: location.currentCityId,
                gender: "FEMALE"
              }
            });
          } catch (e) {
            console.log(e);
          } finally {
            toast("Requested");
          }
        } else if (buttonIndex === 2) {
          try {
            await requestCoffeeFn({
              variables: {
                target: "gender",
                currentCityId: location.currentCityId,
                gender: "OTHER"
              }
            });
          } catch (e) {
            console.log(e);
          } finally {
            toast("Requested");
          }
        } else {
          null;
        }
      }
    );
  };
  const {
    data: { getCoffees: { coffees = null } = {} } = {},
    loading: coffeeLoading,
    refetch: coffeeRefetch
  } = useQuery<GetCoffees, GetCoffeesVariables>(GET_COFFEES, {
    variables: { location: "city", cityId: location.currentCityId },
    fetchPolicy: "network-only"
  });
  const [requestCoffeeFn, { loading: requestLoading }] = useMutation<
    RequestCoffee,
    RequestCoffeeVariables
  >(REQUEST_COFFEE, {
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
  });
  const {
    data: { getTripCities: { trip = null } = {} } = {},
    loading: tripLoading,
    refetch: tripRefetch
  } = useQuery<GetTripCities, GetTripCitiesVariables>(GET_TRIP_CITIES, {
    variables: { username: me.user.username }
  });
  const {
    data: { recommendUsers: { users: recommendUsers = null } = {} } = {},
    loading: recommendUserLoading,
    refetch: recommendUserRefetch
  } = useQuery<RecommendUsers, RecommendUsersVariables>(RECOMMEND_USERS);
  const {
    data: {
      recommendLocations: { cities: recommendLocations = null } = {}
    } = {},
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
      position: Toast.positions.CENTER,
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
      await tripRefetch();
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
  const onSelectNationality = async (country: any) => {
    try {
      await requestCoffeeFn({
        variables: {
          target: "nationality",
          currentCityId: location.currentCityId,
          countryCode: country.cca2
        }
      });
      setNationalityModalOpen(false);
    } catch (e) {
      console.log(e);
    } finally {
      toast("Requested");
    }
  };
  const onSelectrRsidence = async (country: any) => {
    try {
      await requestCoffeeFn({
        variables: {
          target: "residence",
          currentCityId: location.currentCityId,
          countryCode: country.cca2
        }
      });
      setResidenceModalOpen(false);
    } catch (e) {
      console.log(e);
    } finally {
      toast("Requested");
    }
  };
  const renderHeader = (section, isActive) => {
    console.log(isActive);
    if (section.city.hasCoffee) {
      return (
        <AccordionTitleContainer>
          <AccordionTitle>
            {section.city.cityName}
            {section.city.country.countryEmoji}
          </AccordionTitle>
          <AccordionIcon>
            <SimpleLineIcons
              size={10}
              color={"#999"}
              name={isActive ? "arrow-down" : "arrow-up"}
            />
          </AccordionIcon>
        </AccordionTitleContainer>
      );
    }
  };

  const renderContent = section => (
    <CoffeeContainer>
      <CollapsibleAccordion cityId={section.city.cityId} />
    </CoffeeContainer>
  );
  const onChange = (activeSections: any) => {
    setActiveSections(activeSections.includes(undefined) ? [] : activeSections);
  };
  if (
    recommendUserLoading ||
    recommendLocationLoading ||
    coffeeLoading ||
    meLoading ||
    tripLoading
  ) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    return (
      <>
        <Modal
          style={{
            margin: 0,
            alignItems: "flex-start"
          }}
          isVisible={nationalityModalOpen}
          backdropColor={
            isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
          }
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
          backdropColor={
            isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
          }
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
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Container>
            <Accordion
              sections={trip}
              expandMultiple={true}
              activeSections={activeSections}
              renderHeader={renderHeader}
              renderContent={renderContent}
              onChange={onChange}
              touchableComponent={TouchableOpacity}
            />
            <EmptyView />
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
          {coffees &&
          coffees.length !== 0 &&
          coffees.find(i => i.host.username === userName) ? (
            <CoffeeSubmitBtn
              onPress={() =>
                cancelCoffee(
                  coffees.find(i => i.host.username === userName).uuid
                )
              }
            >
              <CoffeeSubmitContainer>
                <CoffeeText>CANCEL COFFEE</CoffeeText>
              </CoffeeSubmitContainer>
            </CoffeeSubmitBtn>
          ) : (
            <CoffeeSubmitBtn
              disabled={requestLoading}
              onPress={() => requestCoffee()}
            >
              <CoffeeSubmitContainer>
                <CoffeeText>REQUEST COFFEE</CoffeeText>
              </CoffeeSubmitContainer>
            </CoffeeSubmitBtn>
          )}
        </Footer>
      </>
    );
  }
};
