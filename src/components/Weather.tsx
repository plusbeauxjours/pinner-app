import React, { useEffect } from "react";
import { useWeatherAqi, useWeather } from "../hooks/weatherHelper";
import Loader from "./Loader";
import { useState } from "react";
import styled from "styled-components";
import SvgUri from "react-native-svg-uri";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const colorMidium = "#FFA500";
const colorHigh = "#FF4500";
const colorVeryHigh = "#FF0000";

const Container = styled.View`
  height: 40px;
  align-items: center;
  flex-direction: row;
`;

const WeatherInfoContainer = styled.View`
  flex-direction: column;
  margin-left: 5px;
`;
const WeatherInfoRow = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100px;
  height: 13px;
  flex-wrap: wrap;
`;

const TempNumber = styled.Text<ITheme>`
  width: 70px;
  margin-right: 5px;
  font-size: ${props => {
    if (props.size === "sm") {
      return "8px";
    } else if (props.size === "md") {
      return "12px";
    } else {
      return "12px";
    }
  }};
  font-weight: 400;
  color: ${props => {
    if (-10 <= props.chill && props.aqi <= -5) {
      return "#1E90FF";
    } else if (-20 <= props.chill && props.aqi < -10) {
      return "#0000FF";
    } else if (props.aqi < -20) {
      return "#00008B";
    } else if (30 <= props.temp && props.temp < 35) {
      return colorMidium;
    } else if (35 <= props.temp && props.temp < 40) {
      return colorHigh;
    } else if (40 <= props.temp) {
      return colorVeryHigh;
    } else {
      return props.theme.color;
    }
  }};
`;

const AqiNumber = styled(TempNumber)`
  color: ${props => {
    if (100 <= props.aqi && props.aqi < 150) {
      return colorMidium;
    } else if (150 <= props.aqi && props.aqi < 200) {
      return colorHigh;
    } else if (200 <= props.aqi) {
      return colorVeryHigh;
    } else {
      return props.theme.color;
    }
  }};
`;

const HumidityNumber = styled(TempNumber)`
  color: ${props => {
    if (40 <= props.humidity && props.humidity < 70) {
      return props.theme.color;
    } else {
      return "#008d62";
    }
  }};
`;

const IconContainer = styled.View`
  width: 45px;
  align-items: center;
`;

interface ITheme {
  temp?: number;
  chill?: number;
  aqi?: number;
  humidity?: number;
}

export default ({ latitude, longitude }) => {
  const [aqi, setAqi] = useState<number>(0);
  const [icon, setIcon] = useState<string>("");
  const [humidity, setHumidity] = useState<number>(0);
  const [temp, setTemp] = useState<number>(0);
  const [chill, setChill] = useState<number>(0);
  const getWeather = async (latitude: number, longitude: number) => {
    const aqi = await useWeatherAqi(latitude, longitude);
    const { icon, humidity, temp, chill } = await useWeather(
      latitude,
      longitude
    );
    setAqi(aqi);
    setIcon(icon);
    setHumidity(humidity);
    setTemp(temp);
    setChill(chill);
  };
  useEffect(() => {
    getWeather(latitude, longitude);
  }, [latitude, longitude]);
  const iconUrl = {
    "01d": "weather-sunny",
    "01n": "weather-sunny",
    "02d": "weather-partlycloudy",
    "02n": "weather-partlycloudy",
    "03d": "weather-cloudy",
    "03n": "weather-cloudy",
    "04d": "weather-partlycloudy",
    "04n": "weather-partlycloudy",
    "09d": "weather-pouring",
    "09n": "weather-pouring",
    "10d": "weather-rainy",
    "10n": "weather-rainy",
    "11d": "weather-lightning-rainy",
    "11n": "weather-lightning-rainy",
    "13d": "weather-snowy",
    "13n": "weather-snowy",
    "50d": "weather-fog",
    "50n": "weather-fog"
  };

  return (
    <Container>
      <IconContainer>
        {icon ? (
          <MaterialCommunityIcons
            size={38}
            name={iconUrl[icon]}
            color={"#999"}
          />
        ) : (
          <Loader />
        )}
      </IconContainer>
      <WeatherInfoContainer>
        <WeatherInfoRow>
          <TempNumber temp={Math.round(temp)} chill={Math.round(chill)}>
            Temp {Math.round(temp)} °C
          </TempNumber>
          <TempNumber temp={Math.round(temp)} chill={Math.round(chill)}>
            Feels {Math.round(chill)} °C
          </TempNumber>
        </WeatherInfoRow>
        <WeatherInfoRow>
          <AqiNumber aqi={aqi}>AQI {aqi}</AqiNumber>
          <HumidityNumber humidity={humidity}>
            Humidity {humidity}
          </HumidityNumber>
        </WeatherInfoRow>
      </WeatherInfoContainer>
    </Container>
  );
};
