import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "react-native-modal";
import { Platform, TextInput, ScrollView, Image } from "react-native";
import constants from "../../../constants";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "react-apollo-hooks";
import { SEARCH } from "./SearchQueries";
import Loader from "../Loader";
import { withNavigation } from "react-navigation";
import UserRow from "../UserRow";
import { SearchTerms, SearchTermsVariables } from "../../types/api";
import keys from "../../../keys";
import useGoogleAutocomplete from "../../hooks/useGoogleAutocomplete";

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
  const { data, loading } = useQuery<SearchTerms, SearchTermsVariables>(
    SEARCH,
    {
      variables: { search },
      skip: search === "",
      fetchPolicy: "network-only"
    }
  );
  const onChange = (text: string) => {
    if (search !== "") {
      setModalOpen(true);
    }
    console.log(text);
    setSearch(text);
  };
  const { results, isLoading } = useGoogleAutocomplete({
    apiKey: `${keys.REACT_APP_GOOGLE_PLACE_KEY}`,
    query: search !== "" && search,
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
            // position: "absolute"
          }}
          autoFocus={true}
          value={navigation.value}
          placeholder={"Search"}
          returnKeyType="search"
          onChangeText={onChange}
        />
        {/* <TouchableIcon onPress={() => setModalOpen(false)}>
          <Ionicons
            name={Platform.OS === "ios" ? "ios-add" : "md-add"}
            size={36}
          />
        </TouchableIcon> */}

        <ScrollView
          style={{ marginTop: 250, marginBottom: 24 }}
          contentOffset={{ x: 0, y: 200 }}
        >
          {loading ? (
            <Loader />
          ) : (
            <>
              {data &&
                data.searchUsers.users.length !== 0 &&
                data.searchUsers.users.map(user => (
                  <Touchable key={user.profile.id}>
                    <UserRow user={user.profile} type={"user"} />
                  </Touchable>
                ))}
              {results.predictions &&
                results.predictions.length !== 0 &&
                results.predictions.map(prediction => (
                  <Touchable key={prediction.id}>
                    <Container>
                      <Header>
                        <Touchable>
                          {/* <Image
        style={{ height: 40, width: 40, borderRadius: 5 }}
        source={
          city.cityThumbnail && {
            uri: city.cityThumbnail
          }
        }
      /> */}
                        </Touchable>
                        <Touchable>
                          <HeaderUserContainer>
                            <Bold>
                              {prediction.structured_formatting.main_text}
                            </Bold>
                            <Location>
                              {prediction.structured_formatting.secondary_text
                                ? prediction.structured_formatting
                                    .secondary_text
                                : prediction.structured_formatting.main_text}
                            </Location>
                          </HeaderUserContainer>
                        </Touchable>
                      </Header>
                    </Container>
                  </Touchable>
                ))}
              {data &&
                data.searchCountries.countries.length !== 0 &&
                data.searchCountries.countries.map(country => (
                  <Touchable key={country.id}>
                    <UserRow country={country} type={"country"} />
                  </Touchable>
                ))}
              {data &&
                data.searchContinents.continents.length !== 0 &&
                data.searchContinents.continents.map(continent => (
                  <Touchable key={continent.id}>
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
