import axios from "axios";
import { Alert } from "react-native";
import keys from "../../keys";

const useReverseGeoCode = async (latitude: number, longitude: number) => {
  const URL = `https://maps.googleapis.com/maps/api/geocode/json?&language=en&latlng=${latitude},${longitude}&key=${keys.REACT_APP_GOOGLE_MAPS_KEY}`;
  const { data } = await axios(URL);
  if (!data.error_message) {
    const { results } = data;

    let storableLocation = {
      cityName: "",
      cityId: "",
      countryCode: ""
    };
    for (const components of results) {
      for (const component of components.address_components) {
        if (
          component.types[0] === "locality" ||
          component.types[0] === "sublocality" ||
          component.types[0] === "colloquial_area"
        ) {
          storableLocation.cityName = component.long_name;
          storableLocation.cityId = components.place_id;
        } else if (
          !storableLocation.cityName &&
          component.types[0] === "administrative_area_level_1"
        ) {
          storableLocation.cityName = component.long_name;
        } else if (component.types.includes("country")) {
          storableLocation.countryCode = component.short_name;
        }
      }
    }
    return { storableLocation };
  } else {
    Alert.alert(data.error_message);
    return;
  }
};

export default useReverseGeoCode;
