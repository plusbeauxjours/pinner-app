import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Modal from "react-native-modal";
import { Platform, TextInput } from "react-native";
import constants from "../../../constants";
import { theme } from "../../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "react-apollo-hooks";
import { SEARCH } from "./SearchQueries";
import Loader from "../Loader";
import { withNavigation } from "react-navigation";
import UserRow from "../UserRow";
import { SearchTerms, SearchTermsVariables } from "../../types/api";

const Text = styled.Text``;
const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;
const Touchable = styled.TouchableOpacity`
  margin-left: 15px;
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
  return (
    <>
      <Modal
        isVisible={modalOpen}
        onBackdropPress={() => setModalOpen(false)}
        onBackButtonPress={() => Platform.OS !== "ios" && setModalOpen(false)}
      >
        <TextInput
          style={{
            width: constants.width - 40,
            height: 35,
            backgroundColor: theme.whiteColor,
            padding: 10,
            borderRadius: 5,
            textAlign: "center",
            bottom: 10
          }}
          autoFocus={true}
          value={navigation.value}
          placeholder={"Search"}
          returnKeyType="search"
          onChangeText={onChange}
          onModalHide={() => setSearch("")}
        />
        {loading ? (
          <Loader />
        ) : (
          <>
            {data &&
              data.searchUsers.users.length !== 0 &&
              data.searchUsers.users.map(user => (
                <UserRow
                  key={user.profile.id}
                  user={user.profile}
                  type={"user"}
                />
              ))}
            {data &&
              data.searchCountries.countries.length !== 0 &&
              data.searchCountries.countries.map(country => (
                <UserRow key={country.id} country={country} type={"country"} />
              ))}
            {data &&
              data.searchContinents.continents.length !== 0 &&
              data.searchContinents.continents.map(continent => (
                <UserRow
                  key={continent.id}
                  continent={continent}
                  type={"continent"}
                />
              ))}
          </>
        )}
      </Modal>
      <View>
        <Touchable onPress={() => setModalOpen(true)}>
          <Ionicons
            name={Platform.OS === "ios" ? "ios-search" : "md-search"}
            size={36}
          />
        </Touchable>
      </View>
    </>
  );
};

export default withNavigation(Search);
