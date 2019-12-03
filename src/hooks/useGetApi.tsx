import axios from "axios";
import keys from "../../keys";

export const useGetApi = async (latitude, longitude) => {
  const URL = `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${keys.REACT_APP_AQICN_KEY}`;
  const { data } = await axios(URL);
  if (data.status === "ok") {
    const {
      data: { aqi }
    } = data;
    return aqi;
  } else {
    return null;
  }
};
