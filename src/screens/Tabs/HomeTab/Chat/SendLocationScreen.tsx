import React, { useState, useEffect } from "react";
import styled from "../../../../styles/typed-components";
import { useLocation } from "../../../../context/LocationContext";
import { Ionicons } from "@expo/vector-icons";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { useTheme } from "../../../../context/ThemeContext";
import { darkMode, lightMode } from "../../../../styles/mapStyles";
import { Platform } from "react-native";

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
const Touchable = styled.TouchableOpacity`
  height: 45px;
  justify-content: center;
  align-items: center;
  background-color: #3897f0;
`;
const Text = styled.Text`
  font-size: 16;
  font-weight: 600;
  color: white;
`;

export default ({ navigation }) => {
  let mapRef: MapView | null;
  const LATITUDE_DELTA = 0.01;
  const LONGITUDE_DELTA = 0.01;
  const isDarkMode = useTheme();
  const location = useLocation();
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

  const onSend = () => {
    const { latitude, longitude } = region;
    navigation.state.params.onSend({
      location: { latitude, longitude }
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
        showsMyLocationButton={true}
        onMapReady={onMapReady}
        loadingEnabled={true}
        rotateEnabled={false}
        onRegionChangeComplete={onRegionChangeComplete}
        customMapStyle={
          isDarkMode && isDarkMode === true ? darkMode : lightMode
        }
      >
        <MarkerContainer pointerEvents="none" onPress={onSend}>
          <Ionicons
            name={Platform.OS === "ios" ? "ios-pin" : "md-pin"}
            size={40}
            color={"#3897f0"}
            pointerEvents="none"
            containerStyle={{ marginBottom: 30 }}
          />
        </MarkerContainer>
      </MapView>
      <Touchable onPress={onSend}>
        <Text>Tap To Send This Location</Text>
      </Touchable>
    </View>
  );
};
