import React, { useEffect } from "react";
import { useWeatherAqi, useWeather } from "../hooks/weatherHelper";
import Loader from "./Loader";
import { useState } from "react";
import styled from "styled-components";
import constants from "../../constants";

const colorMidium = "#FFA500";
const colorHigh = "#FF4500";
const colorVeryHigh = "#FF0000";

const Container = styled.View`
  align-items: center;
`;

const WeatherImage = styled.Image`
  flex: 1;
  width: 20px;
  height: 20px;
  margin-right: 3px;
`;
const WeatherInfoContainer = styled.View`
  flex-direction: column;
`;
const WeatherInfoRow = styled.View`
  display: flex;

  flex-direction: column;
  justify-content: space-between;
  width: 100px;
  height: 20px;
  flex-wrap: wrap;
`;

// const TempNumber = styled.div<ITheme>`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   grid-gap: 3px;
//   margin-right: 5px;
//   font-size: ${props => {
//     if (props.size === "sm") {
//       return "8px";
//     } else if (props.size === "md") {
//       return "12px";
//     } else {
//       return "12px";
//     }
//   }};
//   font-weight: 100;
//   color: ${props => {
//     if (-10 <= props.chill && props.aqi <= -5) {
//       return "#1E90FF";
//     } else if (-20 <= props.chill && props.aqi < -10) {
//       return "#0000FF";
//     } else if (props.aqi < -20) {
//       return "#00008B";
//     } else if (30 <= props.temp && props.temp < 35) {
//       return colorMidium;
//     } else if (35 <= props.temp && props.temp < 40) {
//       return colorHigh;
//     } else if (40 <= props.temp) {
//       return colorVeryHigh;
//     } else {
//       return props.theme.color;
//     }
//   }};
// `;

// const AqiNumber = styled(TempNumber)`
//   color: ${props => {
//     if (100 <= props.aqi && props.aqi < 150) {
//       return colorMidium;
//     } else if (150 <= props.aqi && props.aqi < 200) {
//       return colorHigh;
//     } else if (200 <= props.aqi) {
//       return colorVeryHigh;
//     } else {
//       return props.theme.color;
//     }
//   }};
// `;

// const HumidityNumber = styled(TempNumber)`
//   color: ${props => {
//     if (40 <= props.humidity && props.humidity < 70) {
//       return props.theme.color;
//     } else {
//       return "#008d62";
//     }
//   }};
// `;

const Text = styled.Text``;

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
  return (
    <Container>
      {icon ? (
        // <WeatherImage resizeMode={"contain"} source={require(`../Images/weatherIcon/${icon}.svg`)} />
        <WeatherImage
          resizeMode={"contain"}
          source={require("../Images/avatars/earth0.png")}
        />
      ) : (
        <Loader />
      )}
      <WeatherInfoContainer>
        {/* <WeatherInfoRow>
          <Text>{aqi}</Text>
          <Text>{humidity}</Text>
        </WeatherInfoRow>
        <WeatherInfoRow>
          <Text>{temp}</Text>
          <Text>{chill}</Text>
        </WeatherInfoRow> */}
      </WeatherInfoContainer>
    </Container>
  );
};

//       <Container>
//         <WeatherInfo type={type}>
//           <TempNumber
//             size={size}
//             temp={Math.round(temp)}
//             chill={Math.round(chill)}
//           >
//             <p>Temp</p>
//             <p> {Math.round(temp)} °C</p>
//           </TempNumber>
//           <TempNumber
//             size={size}
//             temp={Math.round(temp)}
//             chill={Math.round(chill)}
//           >
//             <p>Feels</p>
//             <p> {Math.round(chill)} °C</p>
//           </TempNumber>
//           <AqiNumber size={size} aqi={aqi}>
//             <p>AQI</p>
//             <p> {aqi}</p>
//           </AqiNumber>
//           <HumidityNumber size={size} humidity={humidity}>
//             <p>Humidity</p>
//             <p> {humidity} %</p>
//           </HumidityNumber>
//         </WeatherInfo>
//       </Container>
//     );
//   }
