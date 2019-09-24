import React from "react";
import styled from "styled-components";
import { useState } from "react";
import { useMe } from "../../../../context/MeContext";
import { useLocation } from "../../../../context/LocationContext";
import { useMutation } from "react-apollo-hooks";
import { RequestCoffee, RequestCoffeeVariables } from "../../../../types/api";
import { REQUEST_COFFEE } from "./RequestCoffeeQueries";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default () => {
  const me = useMe();
  const location = useLocation();
  const [requestCoffeeVariables, setRequestCoffeeVariables] = useState({
    countryCode: location.currentCountryCode,
    gender: "",
    currentCityId: location.currentCityId,
    target: ""
  });
  const [requestCoffeeFn] = useMutation<RequestCoffee, RequestCoffeeVariables>(
    REQUEST_COFFEE,
    { variables: { ...requestCoffeeVariables } }
  );
  return (
    <View>
      <Text>RequestCoffee</Text>
    </View>
  );
};
