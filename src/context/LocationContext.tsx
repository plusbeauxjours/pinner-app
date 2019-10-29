import React, { createContext, useContext, useState, useEffect } from "react";
import { useMutation } from "react-apollo-hooks";
import { ReportLocation, ReportLocationVariables } from "../types/api";
import { REPORT_LOCATION } from "../sharedQueries";
import { useReverseGeoCode } from "../hooks/useReverseGeoCode";
import { useReversePlaceId } from "../hooks/useReversePlaceId";
import { AsyncStorage } from "react-native";

interface IState {
  currentLat: number;
  currentLng: number;
  currentCityLat: number;
  currentCityLng: number;
  currentCityId: string;
  currentCityName: string;
  currentCountryCode: string;
}

export const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState<IState>({
    currentLat: 0,
    currentLng: 0,
    currentCityLat: 0,
    currentCityLng: 0,
    currentCityId: "",
    currentCityName: "",
    currentCountryCode: ""
  });
  console.log("123");
  const handleGeoSuccess = (position: Position) => {
    const {
      coords: { latitude, longitude }
    } = position;
    getAddress(latitude, longitude);
  };
  const getAddress = async (latitude: number, longitude: number) => {
    const address = await useReverseGeoCode(latitude, longitude);
    if (address) {
      const cityInfo = await useReversePlaceId(address.storableLocation.cityId);
      setLocation({
        currentLat: latitude,
        currentLng: longitude,
        currentCityLat: cityInfo.storableLocation.latitude,
        currentCityLng: cityInfo.storableLocation.longitude,
        currentCityId: address.storableLocation.cityId,
        currentCityName: address.storableLocation.cityName,
        currentCountryCode: address.storableLocation.countryCode
      });
      await AsyncStorage.setItem("cityId", address.storableLocation.cityId);
      await AsyncStorage.setItem(
        "countryCode",
        address.storableLocation.countryCode
      );
    }
  };
  const handleGeoError = () => {
    console.log("No location");
  };
  const [reportLocationFn] = useMutation<
    ReportLocation,
    ReportLocationVariables
  >(REPORT_LOCATION, {
    variables: {
      currentLat: location.currentCityLat,
      currentLng: location.currentCityLng,
      currentCityId: location.currentCityId,
      currentCityName: location.currentCityName,
      currentCountryCode: location.currentCountryCode
    }
  });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
  }, []);
  return (
    <LocationContext.Provider
      value={{ location, useLocation, reportLocationFn }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const { location } = useContext(LocationContext);
  return location;
};

export const useReportLocation = () => {
  const { reportLocationFn } = useContext(LocationContext);
  return reportLocationFn;
};
