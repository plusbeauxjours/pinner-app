import { Alert } from "react-native";
import axios from "axios";
import keys from "../../keys";

const useReversePlaceId = async (placeId: string) => {
  console.log(keys.REACT_APP_GOOGLE_MAPS_KEY);
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?&language=en&place_id=${placeId}&key=${keys.REACT_APP_GOOGLE_MAPS_KEY}`;
  const { data } = await axios(URL);
  if (!data.error_message) {
    const { results } = data;

    let storableLocation = {
      latitude: 0,
      longitude: 0,
      cityName: "",
      countryCode: ""
    };
    for (const component of results[0].address_components) {
      if (component.types[0] === "country") {
        storableLocation.countryCode = component.short_name;
      }
    }
    for (const components of results) {
      for (const component of components.address_components) {
        if (
          component.types[0] === "locality" ||
          component.types[0] === "sublocality" ||
          component.types[0] === "colloquial_area"
        ) {
          storableLocation.cityName = component.long_name;
        }
      }
    }
    storableLocation.latitude = results[0].geometry.location.lat;
    storableLocation.longitude = results[0].geometry.location.lng;
    return { storableLocation };
  } else {
    Alert.alert(data.error_message);
    return null;
  }
};

export default useReversePlaceId;
