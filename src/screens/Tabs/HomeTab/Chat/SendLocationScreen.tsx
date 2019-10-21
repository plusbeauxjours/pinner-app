import React, { useState, useEffect } from "react";
import styled from "../../../../styles/typed-components";
import { useLocation } from "../../../../context/LocationContext";
import { Ionicons } from "@expo/vector-icons";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import constants from "../../../../../constants";
import { useTheme } from "../../../../context/ThemeContext";
import { darkMode, lightMode } from "../../../../styles/mapStyles";

const MarkerContainer = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  background-color: transparent;
`;

const View = styled.View`
  flex: 1;
`;

const Button = styled.Button`
  height: 30px;
  border: 0.5px solid ${props => props.theme.borderColor};
`;

export default ({ navigation }) => {
  let mapRef: MapView | null;
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = 0.01;
  const isDarkMode = useTheme();
  const location = useLocation();
  const [paddingTop, setPaddingTop] = useState<number>(0);
  const [ready, setReady] = useState<boolean>(false);
  const [region, setRegion] = useState({
    latitude: location.currentLat,
    longitude: location.currentLng,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  });

  const onMapReady = () => {
    console.log("nania");
    if (!ready) {
      setReady(true);
    }
  };

  const onCancel = () => {
    navigation.goBack();
  };

  const onSend = () => {
    const { longitude, latitude } = region;
    navigation.state.params.onSend({
      location: { longitude, latitude }
    });
    navigation.goBack();
  };

  const onRegionChangeComplete = region => {
    setRegion(region);
    mapRef.animateToRegion(region);
  };

  const handleGeoSuccess = (position: Position) => {
    const {
      coords: { latitude, longitude }
    } = position;
    setRegion({
      latitude,
      longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA
    });
  };
  const handleGeoError = () => {
    console.log("No location");
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
  });

  return (
    <View>
      <MapView
        ref={map => {
          mapRef = map;
        }}
        provider={PROVIDER_GOOGLE}
        style={{
          flex: 1,
          borderRadius: 3
        }}
        initialRegion={region}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        onMapReady={onMapReady}
        loadingEnabled={true}
        rotateEnabled={false}
        onRegionChangeComplete={onRegionChangeComplete}
        customMapStyle={
          isDarkMode && isDarkMode === true ? darkMode : lightMode
        }
      >
        <Marker
          description={"Tab to Send this Location."}
          onPress={onSend}
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude
          }}
        />
      </MapView>
    </View>
  );
};
