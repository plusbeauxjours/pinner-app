import React, { useState } from "react";
import styled from "styled-components";
import Modal from "react-native-modal";
import { useQuery } from "react-apollo-hooks";
import { Image, Platform } from "react-native";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import Loader from "./Loader";
import { GetCoffees, GetCoffeesVariables } from "../types/api";
import { GET_COFFEES } from "../sharedQueries";
import { BACKEND_URL } from "../../constants";
import CoffeeDetail from "../screens/CoffeeDetail";
import { useTheme } from "../context/ThemeContext";

const Touchable = styled.TouchableOpacity``;
const LoaderContainer = styled.View`
  flex: 1;
  background-color: ${props => props.theme.bgColor};
  justify-content: center;
  align-items: center;
`;
const HeaderUserContainer = styled.View`
  margin-left: 10px;
`;
const Container = styled.View`
  padding: 15px 5px 15px 5px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 45px;
`;
const Bold = styled.Text`
  font-weight: 500;
  color: ${props => props.theme.color};
`;
const ImageContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 40px;
`;
const Header = styled.View`
  flex: 2;
  flex-direction: row;
`;
const Location = styled.Text`
  font-size: 11px;
  color: ${props => props.theme.color};
`;
export default ({ cityId }) => {
  const randomAvatar = {
    1: require(`../Images/thumbnails/earth1.png`),
    2: require(`../Images/thumbnails/earth2.png`),
    3: require(`../Images/thumbnails/earth3.png`),
    4: require(`../Images/thumbnails/earth4.png`),
    5: require(`../Images/thumbnails/earth5.png`),
    6: require(`../Images/thumbnails/earth6.png`),
    7: require(`../Images/thumbnails/earth7.png`),
    8: require(`../Images/thumbnails/earth8.png`),
    9: require(`../Images/thumbnails/earth9.png`)
  };
  const isDarkMode = useTheme();
  const [coffeeId, setCoffeeId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const onPress = coffeeId => {
    setModalOpen(true);
    setCoffeeId(coffeeId);
  };
  const {
    data: { getCoffees: { coffees = null } = {} } = {},
    loading: coffeeLoading
  } = useQuery<GetCoffees, GetCoffeesVariables>(GET_COFFEES, {
    variables: { location: "city", cityId },
    fetchPolicy: "no-cache"
  });
  if (coffeeLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    return (
      <>
        <Modal
          style={{ margin: 0, alignItems: "flex-start" }}
          isVisible={modalOpen}
          backdropColor={
            isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
          }
          onBackdropPress={() => setModalOpen(false)}
          onBackButtonPress={() => Platform.OS !== "ios" && setModalOpen(false)}
          onModalHide={() => setModalOpen(false)}
          propagateSwipe={true}
          scrollHorizontal={true}
          backdropOpacity={0.9}
          animationIn="zoomInDown"
          animationOut="zoomOutUp"
          animationInTiming={200}
          animationOutTiming={200}
          backdropTransitionInTiming={200}
          backdropTransitionOutTiming={200}
        >
          <CoffeeDetail
            coffeeId={coffeeId}
            setModalOpen={setModalOpen}
            isStaying={true}
          />
        </Modal>
        {coffees &&
          coffees.length !== 0 &&
          coffees.map(coffee => (
            <Touchable key={coffee.uuid} onPress={() => onPress(coffee.uuid)}>
              <Container>
                <Header>
                  <ImageContainer>
                    {coffee.host.profile.appAvatarUrl ? (
                      <ProgressiveImage
                        tint={isDarkMode ? "dark" : "light"}
                        style={{
                          height: 36,
                          width: 36,
                          borderRadius: 18
                        }}
                        preview={{
                          uri: `${BACKEND_URL}/media/${coffee.host.profile.appAvatarUrl}`
                        }}
                        uri={`${BACKEND_URL}/media/${coffee.host.profile.appAvatarUrl}`}
                      />
                    ) : (
                      <Image
                        style={{
                          height: 36,
                          width: 36,
                          borderRadius: 18
                        }}
                        source={randomAvatar[Math.round(Math.random() * 9)]}
                      />
                    )}
                  </ImageContainer>
                  <HeaderUserContainer>
                    <Bold>{coffee.host.username}</Bold>
                    <Location>
                      {coffee.city.cityName}, {coffee.city.country.countryName}
                    </Location>
                  </HeaderUserContainer>
                </Header>
              </Container>
            </Touchable>
          ))}
      </>
    );
  }
};
