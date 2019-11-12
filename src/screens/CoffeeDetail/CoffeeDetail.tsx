import React from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { useState } from "react";
import { useLocation } from "../../context/LocationContext";
import {
  CoffeeDetail,
  CoffeeDetailVariables,
  DeleteCoffee,
  DeleteCoffeeVariables
} from "../../types/api";
import { COFFEE_DETAIL, DELETE_COFFEE } from "./CoffeeDetailQueries";
import { useTheme } from "../../context/ThemeContext";
import constants, { BACKEND_URL } from "../../../constants";
import Loader from "../../components/Loader";
import CoffeeBtn from "../../components/CoffeeBtn";
import { withNavigation } from "react-navigation";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";

const View = styled.View`
  align-items: center;
  justify-content: center;
`;
const Container = styled.View`
  width: ${constants.width};
  height: ${constants.width};
  border-top-width: 0.5px;
  border-top-color: #999;
  border-bottom-width: 0.5px;
  border-bottom-color: #999;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.headerColor};
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
const ImageTouchable = styled.TouchableOpacity`
  margin-bottom: 15;
  position: absolute;
  top: -75;
  border-width: 0.5;
  border-radius: 75;
  border: 0.5px solid #999;
`;
const Text = styled.Text`
  color: ${props => props.theme.color};
`;
const UserName = styled.Text`
  font-weight: 500;
  font-size: 30;
  color: ${props => props.theme.color};
`;
const ItemContainer = styled.View`
  flex-direction: row;
  margin-top: 80px;
  justify-content: center;
  align-items: center;
  width: ${constants.width};
  flex-wrap: wrap;
`;
const Item = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${constants.width / 4};
  height: ${constants.width / 5};
`;
const DisptanceItem = styled(Item)`
  width: ${constants.width / 2};
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

interface IProps {
  navigation: any;
  coffeeId: string;
  setModalOpen?: any;
  isStaying?: boolean;
}
const CoffeeDetails: React.FC<IProps> = ({
  navigation,
  coffeeId,
  setModalOpen,
  isStaying
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
  const { data: coffeeDetailData, loading: coffeeDetailLoading } = useQuery<
    CoffeeDetail,
    CoffeeDetailVariables
  >(COFFEE_DETAIL, {
    variables: { coffeeId },
    fetchPolicy: "network-only"
  });
  const [delateCoffeeFn] = useMutation<DeleteCoffee, DeleteCoffeeVariables>(
    DELETE_COFFEE,
    { variables: { coffeeId } }
  );
  const onPress = username => {
    setModalOpen(false);
    navigation.push("UserProfileTabs", {
      username
    });
  };
  if (coffeeDetailLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    const { coffeeDetail: { coffee = null } = {} } = ({} = coffeeDetailData);
    return (
      <Container>
        {coffee && (
          <>
            <ImageTouchable
              onPress={() => onPress(coffee.host.profile.username)}
            >
              {coffee.host.profile.avatarUrl ? (
                <ProgressiveImage
                  style={{
                    height: 150,
                    width: 150,
                    borderRadius: 150 / 2
                  }}
                  tint={isDarkMode ? "dark" : "light"}
                  preview={{
                    uri: `${BACKEND_URL}/media/${coffee.host.profile.appAvatarUrl}`
                  }}
                  uri={`${BACKEND_URL}/media/${coffee.host.profile.avatarUrl}`}
                />
              ) : (
                <ProgressiveImage
                  style={{
                    height: 150,
                    width: 150,
                    borderRadius: 150 / 2
                  }}
                  preview={require(`../../Images/thumbnails/earth1.png`)}
                  uri={require(`../../Images/avatars/earth1.png`)}
                />
              )}
            </ImageTouchable>
            <Touchable onPress={() => onPress(coffee.host.profile.username)}>
              <UserName>
                {coffee.host.profile.username.length > 24
                  ? coffee.host.profile.username.substring(0, 24) + "..."
                  : coffee.host.profile.username}
              </UserName>
              <Text>
                {coffee.host.profile.currentCity.cityName},&nbsp;
                {coffee.host.profile.currentCity.country.countryName}
              </Text>
            </Touchable>
            <ItemContainer>
              {coffee.host.profile.distance !== 0 && (
                <DisptanceItem>
                  <UserName>{coffee.host.profile.distance}</UserName>
                  <Text>KM</Text>
                </DisptanceItem>
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
                  cityId={coffee.city.cityId}
                  coffeeId={coffee.uuid}
                  isMatching={coffee.isMatching}
                  isSelf={coffee.host.profile.isSelf}
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
