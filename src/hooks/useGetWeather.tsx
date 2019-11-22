import axios from "axios";
import keys from "../../keys";
import Toast from "react-native-root-toast";

export const useGetWeather = async (latitude, longitude) => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${keys.REACT_APP_OPEN_WEATHER_MAP_KEY}`;
  const { data } = await axios(URL);
  const toast = (message: string) => {
    Toast.show(message, {
      duration: Toast.durations.LONG,
      position: 40,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  };
  if (data) {
    const {
      weather,
      wind: { speed: wind },
      main
    } = data;
    const icon = weather[0].icon;
    const humidity = main.humidity;
    const temp = main.temp - 273.15;
    const chill =
      (await 13.12) +
      0.6215 * temp -
      11.37 * wind ** 0.16 +
      0.3965 * temp * wind ** 0.16;
    return { icon, humidity, temp, chill };
  } else {
    toast(data.error_message);
    return null;
  }
};
