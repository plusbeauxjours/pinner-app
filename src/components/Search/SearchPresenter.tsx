import React from "react";
import {
  Platform,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";

import styled from "styled-components";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";

import ItemRow from "../ItemRow";
import Loader from "../Loader";
import constants from "../../../constants";
import { useTheme } from "../../context/ThemeContext";
import SearchCityPhoto from "../SearchCityPhoto";
import { withNavigation } from "react-navigation";

const Text = styled.Text`
  color: ${(props) => props.theme.color};
  font-size: 8px;
  margin-left: 5px;
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
  margin-right: 5px;
  width: 40px;
  flex-direction: row;
  justify-content: flex-end;
`;

const HeaderUserContainer = styled.View`
  margin-left: 10px;
`;

const Bold = styled.Text`
  font-weight: 500;
  color: ${(props) => props.theme.color};
`;

const Location = styled.Text`
  font-size: 11px;
  color: ${(props) => props.theme.color};
`;

const Header = styled.View`
  flex: 2;
  flex-direction: row;
  align-items: center;
`;

const LoaderContainer = styled.View`
  flex: 1;
  margin-top: 50;
  right: 15px;
`;

const ImageContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 45px;
`;

interface IProps {
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
  onChange: (text: string) => void;
  onPress: (cityId: string) => void;
  isLoading: boolean;
  loading: boolean;
  createCityLoading: boolean;
  users: any;
  countries: any;
  continents: any;
  results: any;
  navigation: any;
}

const SearchPresenter: React.FC<IProps> = ({
  modalOpen,
  setModalOpen,
  search,
  setSearch,
  onChange,
  onPress,
  isLoading,
  loading,
  createCityLoading,
  users,
  countries,
  continents,
  results,
  navigation,
}) => {
  const isDarkMode = useTheme();

  return (
    <>
      <Modal
        style={{ margin: 0, alignItems: "flex-start" }}
        isVisible={modalOpen}
        backdropColor={
          isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
        }
        onBackdropPress={() => setModalOpen(false)}
        onBackButtonPress={() =>
          Platform.OS === "android" && setModalOpen(false)
        }
        onModalHide={() => setSearch("")}
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
        <KeyboardAvoidingView
          enabled
          behavior={Platform.OS === "ios" ? "padding" : false}
        >
          <TextInput
            style={{
              alignSelf: "center",
              width: constants.width - 40,
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
                marginLeft: 30 / 2,
              }}
              keyboardShouldPersistTaps="always"
              showsVerticalScrollIndicator={false}
            >
              {loading || createCityLoading || isLoading ? (
                <LoaderContainer>
                  <Loader />
                </LoaderContainer>
              ) : (
                <>
                  {users && users.length !== 0 && (
                    <>
                      {users.length === 1 ? (
                        <Text>USER</Text>
                      ) : (
                        <Text>USERS</Text>
                      )}
                      {users.map((user) => (
                        <Touchable
                          key={user.id}
                          onPress={async () => {
                            await setSearch("");
                            await setModalOpen(false),
                              navigation.push("UserProfile", {
                                uuid: user.uuid,
                                isSelf: user.isSelf,
                              });
                          }}
                        >
                          <ItemRow user={user} type={"user"} />
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
                        {results.predictions.map((prediction) => (
                          <Touchable
                            key={prediction.id}
                            onPress={() => onPress(prediction.place_id)}
                          >
                            <Container>
                              <Header>
                                <ImageContainer>
                                  <SearchCityPhoto
                                    cityId={prediction.place_id}
                                  />
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
                      {countries.map((country) => (
                        <Touchable
                          key={country.id}
                          onPress={async () => {
                            await setSearch("");
                            await setModalOpen(false),
                              navigation.push("CountryProfileTabs", {
                                countryCode: country.countryCode,
                                continentCode: country.continent.continentCode,
                              });
                          }}
                        >
                          <ItemRow country={country} type={"country"} />
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
                      {continents.map((continent) => (
                        <Touchable
                          key={continent.id}
                          onPress={async () => {
                            await setSearch("");
                            await setModalOpen(false),
                              navigation.push("ContinentProfile", {
                                continentCode: continent.continentCode,
                              });
                          }}
                        >
                          <ItemRow continent={continent} type={"continent"} />
                        </Touchable>
                      ))}
                    </>
                  )}
                </>
              )}
            </ScrollView>
          </Touchable>
        </KeyboardAvoidingView>
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

export default withNavigation(SearchPresenter);
