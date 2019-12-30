import React from "react";
import { useQuery } from "react-apollo-hooks";
import styled from "styled-components";
import { useState } from "react";
import { useLocation } from "../../context/LocationContext";
import { CoffeeDetail, CoffeeDetailVariables } from "../../types/api";
import { COFFEE_DETAIL } from "./CoffeeDetailQueries";
import { useTheme } from "../../context/ThemeContext";
import constants, { BACKEND_URL } from "../../../constants";
import Loader from "../../components/Loader";
import CoffeeBtn from "../../components/CoffeeBtn";
import { withNavigation } from "react-navigation";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";

const Container = styled.View`
  width: ${constants.width};
  height: 450px;
  border-top-width: 0.5;
  border-top-color: #999;
  border-bottom-width: 0.5;
  border-bottom-color: #999;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.headerColor};
  padding: 5px;
`;
const LoaderContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Touchable = styled.TouchableOpacity`
  position: absolute;
  top: 80;
  justify-content: center;
  align-items: center;
`;
const ImageTouchable = styled.TouchableOpacity``;
const ImageView = styled.View`
  background-color: ${props => props.theme.headerColor};
  margin-bottom: 15;
  position: absolute;
  top: -75;
  border-radius: 75;
`;
const Text = styled.Text`
  color: ${props => props.theme.color};
`;
const UserName = styled.Text`
  font-weight: 500;
  font-size: 28px;
  color: ${props => props.theme.color};
`;
const ItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: ${constants.width};
  flex-wrap: nowrap;
`;
const Item = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${constants.width / 4 - 2.5};
  height: 70px;
`;
const GreyText = styled.Text`
  color: #999;
  margin-bottom: 10px;
`;
const CoffeeBtnContainer = styled.View`
  width: ${constants.width};
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 10;
`;
const Image = styled.Image`
  height: 150px;
  width: 150px;
  border-radius: 75px;
`;
const Void = styled.View`
  height: 40px;
`;
interface IProps {
  navigation: any;
  coffeeId: string;
  setModalOpen?: any;
  isStaying?: boolean;
  isSelf?: boolean;
}
const CoffeeDetails: React.FC<IProps> = ({
  navigation,
  coffeeId,
  setModalOpen,
  isStaying,
  isSelf
}) => {
  const isDarkMode = useTheme();
  const location = useLocation();
  const [countryCode, setCountryCode] = useState<string>(
    location.currentCountryCode
  );
  const [gender, setGender] = useState<string>();
  const [currentCityId, setCurrentCityId] = useState<string>(
    location.currentCityId
  );
  const {
    data: { coffeeDetail: { coffee = null } = {} } = {},
    loading: coffeeDetailLoading
  } = useQuery<CoffeeDetail, CoffeeDetailVariables>(COFFEE_DETAIL, {
    variables: { coffeeId },
    fetchPolicy: "no-cache"
  });
  const onPress = uuid => {
    setModalOpen(false);
    navigation.push("UserProfile", {
      uuid
    });
  };
  const imageNumber = Math.round(Math.random() * 9);
  const randomAvatar = {
    0: require(`../../Images/avatars/earth6.png`),
    1: require(`../../Images/avatars/earth1.png`),
    2: require(`../../Images/avatars/earth2.png`),
    3: require(`../../Images/avatars/earth3.png`),
    4: require(`../../Images/avatars/earth4.png`),
    5: require(`../../Images/avatars/earth5.png`),
    6: require(`../../Images/avatars/earth6.png`),
    7: require(`../../Images/avatars/earth7.png`),
    8: require(`../../Images/avatars/earth8.png`),
    9: require(`../../Images/avatars/earth9.png`)
  };
  const formatDistance = (distance: number) => {
    if (distance < 1e3) return distance;
    if (distance >= 1e3 && distance < 1e5)
      return +(distance / 1e3).toFixed(2) + "K";
    if (distance >= 1e5 && distance < 1e8)
      return +(distance / 1e6).toFixed(2) + "M";
    if (distance >= 1e8 && distance < 1e11)
      return +(distance / 1e9).toFixed(2) + "B";
    if (distance >= 1e11) return +(distance / 1e12).toFixed(1) + "T";
    else return null;
  };
  if (coffeeDetailLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    return (
      <Container>
        {coffee && (
          <>
            <ImageView>
              <ImageTouchable onPress={() => onPress(coffee.host.profile.uuid)}>
                {coffee.host.profile.avatarUrl ? (
                  <ProgressiveImage
                    tint={isDarkMode ? "dark" : "light"}
                    style={{
                      height: 150,
                      width: 150,
                      borderRadius: 150 / 2
                    }}
                    preview={{
                      uri: `${BACKEND_URL}/media/${coffee.host.profile.appAvatarUrl}`
                    }}
                    uri={`${BACKEND_URL}/media/${coffee.host.profile.avatarUrl}`}
                  />
                ) : (
                  <Image
                    resizeMode={"contain"}
                    source={randomAvatar[imageNumber]}
                  />
                )}
              </ImageTouchable>
            </ImageView>
            <Touchable onPress={() => onPress(coffee.host.username)}>
              <UserName>
                {coffee.host.username.length > 24
                  ? coffee.host.username.substring(0, 24) + "..."
                  : coffee.host.username}
              </UserName>
              <Text>
                {coffee.host.profile.currentCity.cityName},&nbsp;
                {coffee.host.profile.currentCity.country.countryName}
              </Text>
            </Touchable>
            <Void />
            <ItemContainer>
              {coffee.host.profile.distance !== 0 && (
                <Item>
                  <UserName>
                    {formatDistance(coffee.host.profile.distance)}
                  </UserName>
                  <Text>KM</Text>
                </Item>
              )}
              {coffee.host.profile.tripCount !== 0 && (
                <Item>
                  <UserName>{coffee.host.profile.tripCount}</UserName>
                  {coffee.host.profile.tripCount === 1 ? (
                    <Text>TRIP</Text>
                  ) : (
                    <Text>TRIPS</Text>
                  )}
                </Item>
              )}
            </ItemContainer>
            <ItemContainer>
              {/* {coffee.host.profile.coffeeCount !== 0 && (
                  <Item>
                    <UserName>{coffee.host.profile.coffeeCount} </UserName>
                    {coffee.host.profile.coffeeCount === 1 ? (
                      <Text>COFFEE</Text>
                    ) : (
                      <Text>COFFEES</Text>
                    )}
                  </Item>
                )} */}
              {coffee.host.profile.gender && (
                <Item>
                  {(() => {
                    switch (coffee.host.profile.gender) {
                      case "MALE":
                        return <UserName>M</UserName>;
                      case "FEMALE":
                        return <UserName>F</UserName>;
                      case "OTHER":
                        return <UserName>O</UserName>;
                      default:
                        return null;
                    }
                  })()}
                  <Text>GENDER</Text>
                </Item>
              )}
              {coffee.host.profile.nationality && (
                <Item>
                  <UserName>
                    {coffee.host.profile.nationality.countryEmoji}
                  </UserName>
                  <Text>NATIONALITY </Text>
                </Item>
              )}
              {coffee.host.profile.residence && (
                <Item>
                  <UserName>
                    {coffee.host.profile.residence.countryEmoji}
                  </UserName>
                  <Text>RESIDENCE </Text>
                </Item>
              )}
            </ItemContainer>
            {coffee.status !== "expired" && isStaying && (
              <CoffeeBtnContainer>
                <GreyText>until {coffee.naturalTime}</GreyText>
                <CoffeeBtn
                  userName={coffee.host.username}
                  cityId={coffee.city.cityId}
                  coffeeId={coffee.uuid}
                  isMatching={coffee.isMatching}
                  isSelf={isSelf ? isSelf : coffee.host.profile.isSelf}
                  setModalOpen={setModalOpen}
                />
              </CoffeeBtnContainer>
            )}
          </>
        )}
      </Container>
    );
  }
};

export default withNavigation(CoffeeDetails);
