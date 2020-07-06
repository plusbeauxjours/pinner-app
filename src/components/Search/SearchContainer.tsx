import React, { useState } from "react";

import { useQuery, useMutation } from "react-apollo-hooks";

import {
  SearchTerms,
  SearchTermsVariables,
  CreateCity,
  CreateCityVariables,
} from "../../types/api";
import { SEARCH, CREATE_CITY } from "./SearchQueries";

import keys from "../../../keys";
import useGoogleAutocomplete from "../../hooks/useGoogleAutocomplete";
import SearchPresenter from "./SearchPresenter";
import { withNavigation } from "react-navigation";

export default withNavigation(({ navigation }) => {
  const [search, setSearch] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // MUTATION

  const [createCityFn, { loading: createCityLoading }] = useMutation<
    CreateCity,
    CreateCityVariables
  >(CREATE_CITY);

  // QUERY

  const {
    data: {
      searchUsers: { users = null } = {},
      searchCountries: { countries = null } = {},
      searchContinents: { continents = null } = {},
    } = {},
    loading,
  } = useQuery<SearchTerms, SearchTermsVariables>(SEARCH, {
    variables: { search },
    skip: search === "",
    fetchPolicy: "network-only",
  });

  // FUNC

  const onPress = async (cityId: string) => {
    let result;
    try {
      result = await createCityFn({
        variables: { cityId },
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
        continentCode: result.data.createCity.continentCode,
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
      language: "en",
    },
  });

  return (
    <SearchPresenter
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      search={search}
      setSearch={setSearch}
      onChange={onChange}
      onPress={onPress}
      isLoading={isLoading}
      loading={loading}
      createCityLoading={createCityLoading}
      users={users}
      countries={countries}
      continents={continents}
      results={results}
    />
  );
});
