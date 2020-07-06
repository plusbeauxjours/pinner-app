import React from "react";
import { RefreshControl, Platform, Image, TextInput } from "react-native";
import styled from "styled-components";
import { SwipeListView } from "react-native-swipe-list-view";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

import Loader from "../../../../components/Loader";
import ItemRow from "../../../../components/ItemRow";
import constants, { BACKEND_URL } from "../../../../../constants";
import Modal from "react-native-modal";
import SearchCityPhoto from "../../../../components/SearchCityPhoto";
import ImageZoom from "react-native-image-pan-zoom";

const Header = styled.View`
  height: 290;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.headerColor};
  padding: 10px;
`;

const Body = styled.View`
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bgColor};
  color: ${(props) => props.theme.color};
  padding: 5px;
`;

const BioText = styled.Text`
  padding: 10px;
  color: ${(props) => props.theme.color};
`;

const Bold = styled.Text`
  font-size: 11px;
  color: ${(props) => props.theme.color};
`;

const Item = styled.View`
  flex-direction: column;
  align-items: center;
  width: ${constants.width / 4 - 2.5};
  height: 50px;
`;

const ItemContainer = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
  margin-bottom: 25px;
`;

const UserNameContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Touchable = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

const IconTouchable = styled(Touchable)`
  margin-left: 5px;
  margin-top: 5px;
`;

const ImageTouchable = styled(Touchable)`
  margin-bottom: 15px;
  margin-top: 25px;
`;

const UserName = styled.Text`
  font-weight: 500;
  font-size: 28px;
  color: ${(props) => props.theme.color};
`;

const ScrollView = styled.ScrollView`
  background-color: ${(props) => props.theme.bgColor};
`;

const SearchLoaderContainer = styled.View`
  flex: 1;
  margin-top: 50;
`;

const LoaderContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
  justify-content: center;
  align-items: center;
`;

const EditText = styled.Text`
  color: ${(props) => props.theme.color};
  font-size: 11px;
  font-weight: 100;
`;

const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 0.5px solid #999;
  border-radius: 5px;
  padding: 2px;
`;

const TouchableRow = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.bgColor};
`;

const TouchableBackRow = styled.View`
  background-color: ${(props) => props.theme.bgColor};
`;

const SmallText = styled.Text`
  color: #999;
  text-align: center;
  font-size: 8px;
`;

const RowBack = styled.View`
  align-items: center;
  flex: 1;
  flex-direction: row;
  margin-left: 5px;
  max-width: 85px;
  width: 100%;
  justify-content: space-between;
`;

const BackLeftBtn = styled.TouchableOpacity`
  justify-content: center;
`;

const AddTripBtn = styled.TouchableOpacity`
  justify-content: center;
  padding: 0 5px 5px 5px;
`;

const AddTripContainer = styled.View`
  width: ${constants.width - 40};
  height: 40px;
  justify-content: center;
  align-items: center;
  border: 0.5px solid #999;
  border-radius: 5px;
`;

const CityBold = styled.Text`
  font-weight: 500;
  color: ${(props) => props.theme.color};
`;

const TripText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.color};
`;

const SearchCityContainer = styled.View`
  padding: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 45px;
  width: ${constants.width};
`;

const SearchHeader = styled.View`
  flex: 2;
  flex-direction: row;
  align-items: center;
`;

const SearchHeaderUserContainer = styled.View`
  margin-left: 10px;
`;

const Location = styled.Text`
  font-size: 11px;
  color: ${(props) => props.theme.color};
`;

const TripSmallText = styled(SmallText)`
  margin-left: 15px;
  text-align: auto;
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
  background-color: ${(props) => props.theme.bgColor};
`;

const MessageContainer = styled.TouchableOpacity`
  width: 100px;
  height: 20px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  border: 1px solid #999;
  color: #999;
  margin-bottom: 5px;
`;

const MessageText = styled.Text`
  color: #999;
`;

interface IProps {
  navigation;
  profileLoading: boolean;
  tripLoading: boolean;
  getSameTripsLoading: boolean;
  meLoading: boolean;
  avatarModalOpen: boolean;
  isDarkMode: boolean;
  setAvatarModalOpen: (avatarModalOpen: boolean) => void;
  user: any;
  addTripModalOpen: boolean;
  setSearch: (search: string) => void;
  setAddTripModalOpen: (addTripModalOpen: boolean) => void;
  onChange: (text: string) => void;
  createCityLoading: boolean;
  isLoading: boolean;
  search: string;
  results: any;
  onSearchPress;
  refreshing: boolean;
  onRefresh: () => void;
  randomAvatar: any;
  onMatch: () => void;
  selectReportUser: () => void;
  isSelf: boolean;
  cities: any;
  formatDistance: (distance: number) => void;
  imageNumber: number;
  uuid: string;
  trip: any;
  deleteTripLoading: boolean;
  deleteTrip: (id: string) => void;
}

const UserProfilePresenter: React.FC<IProps> = ({
  navigation,
  profileLoading,
  tripLoading,
  getSameTripsLoading,
  meLoading,
  avatarModalOpen,
  isDarkMode,
  setAvatarModalOpen,
  user,
  addTripModalOpen,
  setSearch,
  setAddTripModalOpen,
  onChange,
  createCityLoading,
  isLoading,
  search,
  results,
  onSearchPress,
  refreshing,
  onRefresh,
  randomAvatar,
  onMatch,
  selectReportUser,
  isSelf,
  cities,
  formatDistance,
  imageNumber,
  uuid,
  trip,
  deleteTripLoading,
  deleteTrip,
}) => {
  if (profileLoading || tripLoading || getSameTripsLoading || meLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    return (
      <>
        <Modal
          style={{ margin: 0, alignItems: "flex-start" }}
          isVisible={avatarModalOpen}
          backdropColor={
            isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
          }
          onBackdropPress={() => setAvatarModalOpen(false)}
          onBackButtonPress={() =>
            Platform.OS === "android" && setAvatarModalOpen(false)
          }
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.9}
          animationIn={"fadeIn"}
          animationOut={"fadeOut"}
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={200}
        >
          <ImageZoom
            cropWidth={constants.width}
            cropHeight={constants.width}
            imageWidth={constants.width}
            imageHeight={constants.width}
          >
            <ProgressiveImage
              tint={isDarkMode ? "dark" : "light"}
              resizeMode={"cover"}
              style={{
                height: constants.width,
                width: constants.width,
                padding: 0,
                margin: 0,
                position: "absolute",
              }}
              onSwipeDown={() => setAvatarModalOpen(false)}
              preview={{
                uri: `${BACKEND_URL}/media/${user?.avatarUrl}`,
              }}
              uri={`${BACKEND_URL}/media/${user?.avatarUrl}`}
            />
          </ImageZoom>
        </Modal>
        <Modal
          style={{ margin: 0, alignItems: "flex-start" }}
          isVisible={addTripModalOpen}
          backdropColor={
            isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
          }
          onBackdropPress={() => {
            setSearch(""), setAddTripModalOpen(false);
          }}
          onBackButtonPress={() => {
            setSearch(""),
              Platform.OS === "android" && setAddTripModalOpen(false);
          }}
          onModalHide={() => {
            setSearch(""), setAddTripModalOpen(false);
          }}
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.9}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={200}
        >
          <>
            <TextInput
              style={{
                alignSelf: "center",
                width: constants.width - 30,
                top: 200,
                backgroundColor: "transparent",
                textAlign: "center",
                fontSize: 40,
                position: "absolute",
                borderBottomWidth: 1,
                borderBottomColor: "#999",
                color: isDarkMode && isDarkMode === true ? "white" : "black",
              }}
              autoFocus={true}
              value={search}
              placeholder={"Search"}
              placeholderTextColor={"#999"}
              returnKeyType="search"
              onChangeText={onChange}
              autoCorrect={false}
            />
            <Touchable
              onPress={() => {
                setAddTripModalOpen(false);
              }}
            >
              <ScrollView
                style={{
                  marginTop: 249,
                  marginBottom: 25,
                  backgroundColor: "transparent",
                }}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
              >
                {createCityLoading || isLoading ? (
                  <SearchLoaderContainer>
                    <Loader />
                  </SearchLoaderContainer>
                ) : (
                  <>
                    {search !== "" &&
                      results.predictions &&
                      results.predictions.length !== 0 && (
                        <>
                          {results.predictions.length === 1 ? (
                            <TripSmallText>CITY</TripSmallText>
                          ) : (
                            <TripSmallText>CITIES</TripSmallText>
                          )}
                          {results.predictions.map((prediction) => (
                            <Touchable
                              key={prediction.id}
                              onPress={() => onSearchPress(prediction.place_id)}
                            >
                              <SearchCityContainer>
                                <SearchHeader>
                                  <SearchCityPhoto
                                    cityId={prediction.place_id}
                                  />
                                  <SearchHeaderUserContainer>
                                    <CityBold>
                                      {
                                        prediction.structured_formatting
                                          .main_text
                                      }
                                    </CityBold>
                                    <Location>
                                      {prediction.structured_formatting
                                        .secondary_text
                                        ? prediction.structured_formatting
                                            .secondary_text
                                        : prediction.structured_formatting
                                            .main_text}
                                    </Location>
                                  </SearchHeaderUserContainer>
                                </SearchHeader>
                              </SearchCityContainer>
                            </Touchable>
                          ))}
                        </>
                      )}
                  </>
                )}
              </ScrollView>
            </Touchable>
          </>
        </Modal>
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
          <Header>
            <ImageTouchable
              disabled={!user.avatarUrl}
              onPress={() => setAvatarModalOpen(true)}
            >
              <Image
                resizeMode={"contain"}
                style={{
                  height: 150,
                  width: 150,
                  borderRadius: 75,
                }}
                source={randomAvatar[imageNumber]}
              />
            </ImageTouchable>
            {!user.isSelf && (
              <MessageContainer onPress={() => onMatch()}>
                <MessageText>MESSAGE</MessageText>
              </MessageContainer>
            )}
            <UserNameContainer>
              <UserName>
                {user.username.length > 24
                  ? user.username.substring(0, 24) + "..."
                  : user.username}
              </UserName>
              {user.isSelf ? (
                <IconTouchable
                  onPress={() => navigation.navigate("EditProfile", { user })}
                >
                  <Ionicons
                    name={
                      Platform.OS === "ios" ? "ios-settings" : "md-settings"
                    }
                    color={"#999"}
                    size={22}
                  />
                </IconTouchable>
              ) : (
                <IconTouchable onPress={() => selectReportUser()}>
                  <FontAwesome
                    name="exclamation-circle"
                    size={18}
                    color={"#999"}
                  />
                </IconTouchable>
              )}
            </UserNameContainer>
            {!isSelf && cities && cities.length !== 0 && (
              <UserNameContainer>
                {cities.length < 6 ? (
                  <EditText>
                    You guys have been to
                    {cities.map((city) => (
                      <EditText key={city.id}>
                        &nbsp;
                        {city.cityName}
                        {city.country.countryEmoji}
                      </EditText>
                    ))}
                    .
                  </EditText>
                ) : (
                  <EditText>
                    You guys have been to
                    {cities.slice(0, 5).map((city) => (
                      <EditText key={city.id}>
                        &nbsp;
                        {city.cityName}
                        {city.country.countryEmoji}
                      </EditText>
                    ))}
                    and {cities.length - 5} more cities.
                  </EditText>
                )}
              </UserNameContainer>
            )}
          </Header>
          <Body>
            <BioText>{user.bio}</BioText>
            <ItemContainer>
              {user.distance !== 0 && (
                <Item>
                  <UserName>{formatDistance(user.distance)}</UserName>
                  <Bold>KM</Bold>
                </Item>
              )}
              {/* {user.isHidePhotos ? (
                user.isSelf ? (
                  <Touchable
                    onPress={() => navigation.push("AvatarList", { uuid })}
                  >
                    {user.photoCount === 1 ? (
                      <Item>
                        <UserName>{user.photoCount}</UserName>
                        <Bold>PHOTO🔒</Bold>
                      </Item>
                    ) : (
                      <Item>
                        <UserName>{user.photoCount}</UserName>
                        <Bold>PHOTOS🔒</Bold>
                      </Item>
                    )}
                  </Touchable>
                ) : (
                  <>
                    {user.photoCount === 1 ? (
                      <Item>
                        <UserName>{user.photoCount}</UserName>
                        <Bold>PHOTO🔒</Bold>
                      </Item>
                    ) : (
                      <Item>
                        <UserName>{user.photoCount}</UserName>
                        <Bold>PHOTOS🔒</Bold>
                      </Item>
                    )}
                  </>
                )
              ) : (
                <>
                  <Touchable
                    onPress={() => navigation.push("AvatarList", { uuid })}
                  >
                    {user.photoCount === 1 ? (
                      <Item>
                        <UserName>{user.photoCount}</UserName>
                        <Bold>PHOTO</Bold>
                      </Item>
                    ) : (
                      <Item>
                        <UserName>{user.photoCount}</UserName>
                        <Bold>PHOTOS</Bold>
                      </Item>
                    )}
                  </Touchable>
                </>
              )} */}
              {user.isHideTrips ? (
                <>
                  {user.tripCount === 1 ? (
                    <Item>
                      <UserName>{user.tripCount}</UserName>
                      <Bold>TRIP🔒</Bold>
                    </Item>
                  ) : (
                    <Item>
                      <UserName>{user.tripCount}</UserName>
                      <Bold>TRIPS🔒</Bold>
                    </Item>
                  )}
                </>
              ) : (
                <>
                  {user.tripCount === 1 ? (
                    <Item>
                      <UserName>{user.tripCount}</UserName>
                      <Bold>TRIP</Bold>
                    </Item>
                  ) : (
                    <Item>
                      <UserName>{user.tripCount}</UserName>
                      <Bold>TRIPS</Bold>
                    </Item>
                  )}
                </>
              )}
              {user.isHideCities ? (
                <>
                  {user.cityCount === 1 ? (
                    <Item>
                      <UserName>{user.cityCount}</UserName>
                      <Bold>CITY🔒</Bold>
                    </Item>
                  ) : (
                    <Item>
                      <UserName>{user.cityCount}</UserName>
                      <Bold>CITIES🔒</Bold>
                    </Item>
                  )}
                </>
              ) : (
                <>
                  <Touchable
                    onPress={() => navigation.push("Cities", { uuid })}
                  >
                    {user.cityCount === 1 ? (
                      <Item>
                        <UserName>{user.cityCount}</UserName>
                        <Bold>CITY</Bold>
                      </Item>
                    ) : (
                      <Item>
                        <UserName>{user.cityCount}</UserName>
                        <Bold>CITIES</Bold>
                      </Item>
                    )}
                  </Touchable>
                </>
              )}
              {user.isHideCountries ? (
                <>
                  {user.countryCount === 1 ? (
                    <Item>
                      <UserName>{user.countryCount}</UserName>
                      <Bold>COUNTRY🔒</Bold>
                    </Item>
                  ) : (
                    <Item>
                      <UserName>{user.countryCount}</UserName>
                      <Bold>COUNTRIES🔒</Bold>
                    </Item>
                  )}
                </>
              ) : (
                <>
                  <Touchable
                    onPress={() => navigation.push("Countries", { uuid })}
                  >
                    {user.countryCount === 1 ? (
                      <Item>
                        <UserName>{user.countryCount}</UserName>
                        <Bold>COUNTRY</Bold>
                      </Item>
                    ) : (
                      <Item>
                        <UserName>{user.countryCount}</UserName>
                        <Bold>COUNTRIES</Bold>
                      </Item>
                    )}
                  </Touchable>
                </>
              )}
              {user.isHideContinents ? (
                <>
                  {user.continentCount === 1 ? (
                    <Item>
                      <UserName>{user.continentCount}</UserName>
                      <Bold>CONTINENT🔒</Bold>
                    </Item>
                  ) : (
                    <Item>
                      <UserName>{user.continentCount}</UserName>
                      <Bold>CONTINENTS🔒</Bold>
                    </Item>
                  )}
                </>
              ) : (
                <>
                  <Touchable
                    onPress={() => navigation.push("Continents", { uuid })}
                  >
                    {user.continentCount === 1 ? (
                      <Item>
                        <UserName>{user.continentCount}</UserName>
                        <Bold>CONTINENT</Bold>
                      </Item>
                    ) : (
                      <Item>
                        <UserName>{user.continentCount}</UserName>
                        <Bold>CONTINENTS</Bold>
                      </Item>
                    )}
                  </Touchable>
                </>
              )}
              {user.gender && (
                <Item>
                  {(() => {
                    switch (user.gender) {
                      case "MALE":
                        return <UserName>M</UserName>;
                      case "FEMALE":
                        return <UserName>F</UserName>;
                      case "OTHER":
                        return <UserName>O</UserName>;
                      default:
                        return null;
                    }
                  })()}
                  <Bold>GENDER</Bold>
                </Item>
              )}
              {user.nationality && (
                <Touchable
                  onPress={() =>
                    navigation.push("CountryProfileTabs", {
                      countryCode: user.nationality.countryCode,
                      continentCode: user.nationality.continent.continentCode,
                    })
                  }
                >
                  <Item>
                    <UserName>{user.nationality.countryEmoji}</UserName>
                    <Bold>NATIONALITY </Bold>
                  </Item>
                </Touchable>
              )}
              {user.residence && (
                <Touchable
                  onPress={() =>
                    navigation.push("CountryProfileTabs", {
                      countryCode: user.residence.countryCode,
                      continentCode: user.residence.continent.continentCode,
                    })
                  }
                >
                  <Item>
                    <UserName>{user.residence.countryEmoji}</UserName>
                    <Bold>RESIDENCE </Bold>
                  </Item>
                </Touchable>
              )}
              {user.isSelf &&
                (user.blockedUserCount === 1 ? (
                  <Touchable onPress={() => navigation.push("BlockedUsers")}>
                    <Item>
                      <UserName>{user.blockedUserCount}</UserName>
                      <Bold>BLOCKED USER</Bold>
                    </Item>
                  </Touchable>
                ) : (
                  <Touchable onPress={() => navigation.push("BlockedUsers")}>
                    <Item>
                      <UserName>{user.blockedUserCount}</UserName>
                      <Bold>BLOCKED USERS</Bold>
                    </Item>
                  </Touchable>
                ))}
            </ItemContainer>

            {(() => {
              switch (user.isSelf) {
                case false:
                  return user.isHideTrips ? (
                    <Bold>Trips are hideen by {user.username}</Bold>
                  ) : (
                    <>
                      {trip.map((i: any, index: any) => (
                        <Touchable
                          key={index}
                          onPress={() =>
                            navigation.push("CityProfileTabs", {
                              cityId: i.city.cityId,
                              countryCode: i.city.country.countryCode,
                              continentCode:
                                i.city.country.continent.continentCode,
                            })
                          }
                        >
                          <ItemRow trip={i} type={"trip"} />
                        </Touchable>
                      ))}
                    </>
                  );
                default:
                  return (
                    <SwipeListView
                      useFlatList={false}
                      closeOnRowBeginSwipe={true}
                      data={trip}
                      previewOpenValue={1000}
                      renderItem={(data: any) => (
                        <TouchableBackRow key={data.item.id}>
                          <TouchableRow
                            onPress={() =>
                              navigation.push("CityProfileTabs", {
                                cityId: data.item.city.cityId,
                                countryCode: data.item.city.country.countryCode,
                                continentCode:
                                  data.item.city.country.continent
                                    .continentCode,
                              })
                            }
                          >
                            <ItemRow trip={data.item} type={"trip"} />
                          </TouchableRow>
                        </TouchableBackRow>
                      )}
                      renderHiddenItem={(data: any) => (
                        <RowBack>
                          <BackLeftBtn
                            disabled={deleteTripLoading}
                            onPress={() => deleteTrip(data.item.id)}
                          >
                            <IconContainer>
                              <SmallText>DELETE TRIP</SmallText>
                            </IconContainer>
                          </BackLeftBtn>
                        </RowBack>
                      )}
                      leftOpenValue={46}
                      keyExtractor={(item: any) => item.id}
                    />
                  );
              }
            })()}
          </Body>
        </ScrollView>
        <Footer>
          {user.isSelf && (
            <AddTripBtn onPress={() => setAddTripModalOpen(true)}>
              <AddTripContainer>
                <TripText>ADD TRIP</TripText>
              </AddTripContainer>
            </AddTripBtn>
          )}
        </Footer>
      </>
    );
  }
};

export default UserProfilePresenter;
