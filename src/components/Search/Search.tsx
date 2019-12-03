import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-native-modal";
import {
  Platform,
  TextInput,
  ScrollView,
  KeyboardAvoidingView
} from "react-native";
import constants from "../../../constants";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation } from "react-apollo-hooks";
import { SEARCH, CREATE_CITY } from "./SearchQueries";
import Loader from "../Loader";
import { withNavigation } from "react-navigation";
import UserRow from "../UserRow";
import {
  SearchTerms,
  SearchTermsVariables,
  CreateCity,
  CreateCityVariables
} from "../../types/api";
import keys from "../../../keys";
import useGoogleAutocomplete from "../../hooks/useGoogleAutocomplete";
import SearchCityPhoto from "../SearchCityPhoto";
import { useTheme } from "../../context/ThemeContext";

const Text = styled.Text`
  color: ${props => props.theme.color};
  font-size: 9px;
  margin-left: 5px;
`;
const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Container = styled.View`
  padding: 15px;
  margin-left: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  width: ${constants.width};
`;

const Touchable = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

const TouchableIcon = styled.TouchableOpacity`
  margin-right: 10px;
  margin-bottom: 5px;
`;

const HeaderUserContainer = styled.View`
  margin-left: 10px;
`;

const Bold = styled.Text`
  font-weight: 500;
  color: ${props => props.theme.color};
`;

const Location = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.color};
`;

const Header = styled.View`
  flex: 2;
  flex-direction: row;
  align-items: center;
`;
const LoaderContainer = styled.View`
  flex: 1;
  margin-top: 50;
`;
const ImageContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 45px;
`;
const Search = ({ navigation }) => {
  const isDarkMode = useTheme();
  const [search, setSearch] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [createCityFn, { loading: createCityLoading }] = useMutation<
    CreateCity,
    CreateCityVariables
  >(CREATE_CITY);
  const {
    data: {
      searchUsers: { users = null } = {},
      searchCountries: { countries = null } = {},
      searchContinents: { continents = null } = {}
    } = {},
    loading
  } = useQuery<SearchTerms, SearchTermsVariables>(SEARCH, {
    variables: { search },
    skip: search === "",
    fetchPolicy: "network-only"
  });
  const onPress = async cityId => {
    let result;
    try {
      result = await createCityFn({
        variables: { cityId }
      });
      await setSearch("");
      await setModalOpen(false);
    } catch (e) {
      setSearch("");
      console.log(e);
    } finally {
      await navigation.push("CityProfileTabs", {
        cityId: result.data.createCity.cityId,
        countryCode: result.data.createCity.countryCode,
        continentCode: result.data.createCity.continentCode
      });
    }
  };
  const onChange = (text: string) => {
    if (search !== "") {
      setModalOpen(true);
    }
    setSearch(text);
  };
  const { results, isLoading } = useGoogleAutocomplete({
    apiKey: `${keys.REACT_APP_GOOGLE_PLACE_KEY}`,
    query: search,
    options: {
      types: "(cities)",
      language: "en"
    }
  });
  return (
    <>
      <Modal
        style={{ margin: 0, alignItems: "flex-start" }}
        isVisible={modalOpen}
        backdropColor={
          isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
        }
        onBackdropPress={() => setModalOpen(false)}
        onBackButtonPress={() => Platform.OS !== "ios" && setModalOpen(false)}
        onModalHide={() => setSearch("")}
        propagateSwipe={true}
        scrollHorizontal={true}
        backdropOpacity={0.9}
      >
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
            color: isDarkMode && isDarkMode === true ? "white" : "black"
          }}
          autoFocus={true}
          value={navigation.value}
          placeholder={"Search"}
          placeholderTextColor={"#999"}
          returnKeyType="search"
          onChangeText={onChange}
          autoCorrect={false}
        />
        <Touchable
          onPress={() => {
            setModalOpen(false);
          }}
        >
          <ScrollView
            style={{
              width: constants.width - 30,
              marginTop: 249,
              marginBottom: 25,
              marginLeft: 30 / 2
            }}
          >
            {loading || createCityLoading || isLoading ? (
              <LoaderContainer>
                <Loader />
              </LoaderContainer>
            ) : (
              <KeyboardAvoidingView enabled behavior="padding">
                {users && users.length !== 0 && (
                  <>
                    {users.length === 1 ? (
                      <Text>USER</Text>
                    ) : (
                      <Text>USERS</Text>
                    )}
                    {users.map(user => (
                      <Touchable
                        key={user.profile.id}
                        onPress={async () => {
                          await setSearch("");
                          await setModalOpen(false),
                            navigation.push("UserProfileTabs", {
                              username: user.profile.username,
                              isSelf: user.profile.isSelf
                            });
                        }}
                      >
                        <UserRow user={user.profile} type={"user"} />
                      </Touchable>
                    ))}
                  </>
                )}
                {search !== "" &&
                  results.predictions &&
                  results.predictions.length !== 0 && (
                    <>
                      {results.predictions.length === 1 ? (
                        <Text>CITY</Text>
                      ) : (
                        <Text>CITIES</Text>
                      )}
                      {results.predictions.map(prediction => (
                        <Touchable
                          key={prediction.id}
                          onPress={() => onPress(prediction.place_id)}
                        >
                          <Container>
                            <Header>
                              <ImageContainer>
                                <SearchCityPhoto cityId={prediction.place_id} />
                              </ImageContainer>
                              <HeaderUserContainer>
                                <Bold>
                                  {prediction.structured_formatting.main_text}
                                </Bold>
                                <Location>
                                  {prediction.structured_formatting
                                    .secondary_text
                                    ? prediction.structured_formatting
                                        .secondary_text
                                    : prediction.structured_formatting
                                        .main_text}
                                </Location>
                              </HeaderUserContainer>
                            </Header>
                          </Container>
                        </Touchable>
                      ))}
                    </>
                  )}
                {countries && countries.length !== 0 && (
                  <>
                    {countries.length === 1 ? (
                      <Text>COUNTRY</Text>
                    ) : (
                      <Text>COUNTRIES</Text>
                    )}
                    {countries.map(country => (
                      <Touchable
                        key={country.id}
                        onPress={async () => {
                          await setSearch("");
                          await setModalOpen(false),
                            navigation.push("CountryProfileTabs", {
                              countryCode: country.countryCode,
                              continentCode: country.continent.continentCode
                            });
                        }}
                      >
                        <UserRow country={country} type={"country"} />
                      </Touchable>
                    ))}
                  </>
                )}
                {continents && continents.length !== 0 && (
                  <>
                    {continents.length === 1 ? (
                      <Text>CONTINENT</Text>
                    ) : (
                      <Text>CONTINENTS</Text>
                    )}
                    {continents.map(continent => (
                      <Touchable
                        key={continent.id}
                        onPress={async () => {
                          await setSearch("");
                          await setModalOpen(false),
                            navigation.push("ContinentProfile", {
                              continentCode: continent.continentCode
                            });
                        }}
                      >
                        <UserRow continent={continent} type={"continent"} />
                      </Touchable>
                    ))}
                  </>
                )}
              </KeyboardAvoidingView>
            )}
          </ScrollView>
        </Touchable>
      </Modal>
      <TouchableIcon onPress={() => setModalOpen(true)}>
        <Ionicons
          name={Platform.OS === "ios" ? "ios-search" : "md-search"}
          size={25}
          color={isDarkMode ? "#EFEFEF" : "#161616"}
        />
      </TouchableIcon>
    </>
  );
};

export default withNavigation(Search);
