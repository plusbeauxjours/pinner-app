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
  // const { data, loading } = useQuery<SearchTerms, SearchTermsVariables>(
  //   SEARCH,
  //   {
  //     variables: { search: "aaa" },
  //     fetchPolicy: "network-only"
  //   }
  // );
  const onChange = (text: string) => {
    if (search.length !== 0) {
      setModalOpen(true);
    }
    console.log(text);
    setSearch(text);
  };
  // console.log("data", data);
  // const {
  //   // searchUsers: { users = null } = {},
  //   searchCountries: { countries = null } = {},
  //   searchContinents: { continents = null } = {}
  // } = data;
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
            textAlign: "center"
          }}
          value={navigation.value}
          placeholder={"Search"}
          returnKeyType="search"
          onChangeText={onChange}
        />
        {/* {loading ? (
          <Loader />
        ) :
         (
          <>
            {users &&
                countries.length !== 0 &&
                users.map(user => (
                  <UserRow
                    key={user.profile.id}
                    user={user.profile}
                    type={"user"}
                  />
                ))}
            {countries &&
              countries.length !== 0 &&
              countries.map(country => (
                <UserRow key={country.id} country={country} type={"country"} />
              ))}
            {continents &&
              continents.length !== 0 &&
              continents.map(continent => (
                <UserRow
                  key={continent.id}
                  continent={continent}
                  type={"continent"}
                />
              ))}
          </>
        )} */}
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
