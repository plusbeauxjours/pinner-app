import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-native-modal";
import { Platform, TextInput, ScrollView } from "react-native";
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

const Text = styled.Text``;
const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Container = styled.View`
  padding: 15px;
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
  margin-left: 15px;
`;

const HeaderUserContainer = styled.View`
  margin-left: 10px;
`;

const Bold = styled.Text`
  font-weight: 500;
`;

const Location = styled.Text`
  font-size: 12px;
`;

const Header = styled.View`
  flex: 2;
  flex-direction: row;
`;

const Search = ({ navigation }) => {
  const [search, setSearch] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [createCityFn, { loading: createCityLoading }] = useMutation<
    CreateCity,
    CreateCityVariables
  >(CREATE_CITY);
  // const [getCityPhotoFn, { loading: getCityPhotoLoading }] = useMutation<
  //   GetCityPhoto,
  //   GetCityPhotoVariables
  // >(GET_CITY_PHOTO, { variables: { cityId } });
  const { data, loading } = useQuery<SearchTerms, SearchTermsVariables>(
    SEARCH,
    {
      variables: { search },
      skip: search === "",
      fetchPolicy: "network-only"
    }
  );
  const onPress = async cityId => {
    let result;
    try {
      result = await createCityFn({
        variables: { cityId }
      });
      await navigation.push("CityProfileTabs", {
        cityId: result.data.createCity.cityId,
        countryCode: result.data.createCity.countryCode,
        continentCode: result.data.createCity.continentCode
      });
      setSearch("");
      setModalOpen(false);
    } catch (e) {
      console.log(e);
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
        style={{ margin: 0 }}
        isVisible={modalOpen}
        backdropColor={"white"}
        onBackdropPress={() => setModalOpen(false)}
        onBackButtonPress={() => Platform.OS !== "ios" && setModalOpen(false)}
        onModalHide={() => setSearch("")}
        propagateSwipe={true}
        scrollHorizontal={true}
      >
        <TextInput
          style={{
            width: constants.width,
            top: 200,
            backgroundColor: "transparent",
            textAlign: "center",
            fontSize: 30
          }}
          autoFocus={true}
          value={navigation.value}
          placeholder={"Search"}
          returnKeyType="search"
          onChangeText={onChange}
          autoCorrect={false}
        />
        <ScrollView style={{ marginTop: 250, marginBottom: 25 }}>
          {loading || createCityLoading ? (
            <Loader />
          ) : (
            <>
              {data &&
                data.searchUsers.users.length !== 0 &&
                data.searchUsers.users.map(user => (
                  <Touchable
                    key={user.profile.id}
                    onPress={() => {
                      navigation.push("UserProfileTabs", {
                        username: user.profile.username,
                        isSelf: user.profile.isSelf
                      }),
                        setModalOpen(false);
                    }}
                  >
                    <UserRow user={user.profile} type={"user"} />
                  </Touchable>
                ))}
              {search !== "" &&
                results.predictions &&
                results.predictions.length !== 0 &&
                results.predictions.map(prediction => (
                  <Touchable
                    key={prediction.id}
                    onPress={() => onPress(prediction.place_id)}
                  >
                    <Container>
                      <Header>
                        <SearchCityPhoto cityId={prediction.place_id} />
                        <HeaderUserContainer>
                          <Bold>
                            {prediction.structured_formatting.main_text}
                          </Bold>
                          <Location>
                            {prediction.structured_formatting.secondary_text
                              ? prediction.structured_formatting.secondary_text
                              : prediction.structured_formatting.main_text}
                          </Location>
                        </HeaderUserContainer>
                      </Header>
                    </Container>
                  </Touchable>
                ))}
              {data &&
                data.searchCountries.countries.length !== 0 &&
                data.searchCountries.countries.map(country => (
                  <Touchable
                    key={country.id}
                    onPress={() => {
                      navigation.push("CountryProfileTabs", {
                        countryCode: country.countryCode,
                        continentCode: country.continent.continentCode
                      }),
                        setModalOpen(false);
                    }}
                  >
                    <UserRow country={country} type={"country"} />
                  </Touchable>
                ))}
              {data &&
                data.searchContinents.continents.length !== 0 &&
                data.searchContinents.continents.map(continent => (
                  <Touchable
                    key={continent.id}
                    onPress={() => {
                      navigation.push("ContinentProfile", {
                        continentCode: continent.continentCode
                      }),
                        setModalOpen(false);
                    }}
                  >
                    <UserRow continent={continent} type={"continent"} />
                  </Touchable>
                ))}
            </>
          )}
        </ScrollView>
      </Modal>
      <View>
        <TouchableIcon onPress={() => setModalOpen(true)}>
          <Ionicons
            name={Platform.OS === "ios" ? "ios-search" : "md-search"}
            size={36}
          />
        </TouchableIcon>
      </View>
    </>
  );
};

export default withNavigation(Search);
