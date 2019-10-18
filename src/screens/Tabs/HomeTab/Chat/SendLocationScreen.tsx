import React, { useState } from "react";
import { View, Button } from "react-native";
import { MapView } from "expo";
import styled from "../../../../styles/typed-components";
import { useLocation } from "../../../../context/LocationContext";
import { Ionicons } from "@expo/vector-icons";

const MarkerContainer = styled.View`
  position: "absolute";
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-items: "center";
  justify-content: "center";
  background-color: "transparent";
`;

export default ({ navigation }) => {
  const map = null;
  const location = useLocation();
  const [paddingTop, setPaddingTop] = useState<number>(0);
  const [ready, setReady] = useState<boolean>(false);
  const [region, setRegion] = useState({
    latitude: location.currentLat,
    longitude: location.currentLng,
    latitudeDelta: 20,
    longitudeDelta: 20
  });

  const onMapReady = () => {
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
    map.animateToRegion(region);
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingTop: paddingTop
        }}
      >
        <MapView
          ref={map => {
            map = map;
          }}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton
          onMapReady={onMapReady}
          onRegionChangeComplete={onRegionChangeComplete}
          style={{ flex: 1 }}
        />
        <MarkerContainer pointerEvents="none">
          <Ionicons
            name="location-on"
            size={32}
            color={"white"}
            pointerEvents="none"
            containerStyle={{ marginBottom: 30 }}
          />
        </MarkerContainer>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: "#fff"
        }}
      >
        <Button title="Cancel" onPress={onCancel}>
          Cancel
        </Button>
        <Button title="Send" onPress={onSend}>
          Send
        </Button>
      </View>
    </View>
  );
};
