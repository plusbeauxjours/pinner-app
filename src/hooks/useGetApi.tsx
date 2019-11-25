import axios from "axios";
import keys from "../../keys";
import Toast from "react-native-root-toast";

export const useGetApi = async (latitude, longitude) => {
  const URL = `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${keys.REACT_APP_AQICN_KEY}`;
  const { data } = await axios(URL);
  const toast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  };
  if (data.status === "ok") {
    const {
      data: { aqi }
    } = data;
    return aqi;
  } else {
    toast(data.error_message);
    return null;
  }
};
