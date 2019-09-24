import React from "react";
import { Image } from "react-native";
import styled from "styled-components";
import constants, { BACKEND_URL } from "../../constants";

const Container = styled.TouchableOpacity`
  padding: 15px;
  flex-direction: row;
  align-items: center;
  height: 45px;
  width: ${constants.width};
`;
const Touchable = styled.View``;
const HeaderUserContainer = styled.View`
  margin-left: 10px;
`;
const Bold = styled.Text`
  font-weight: 500;
`;
const Location = styled.Text`
  font-size: 12px;
`;

interface IProps {
  user?: any;
  city?: any;
  trip?: any;
  coffee?: any;
  match?: any;
  type: string;
}

const UserRow: React.FC<IProps> = ({
  user,
  city,
  trip,
  coffee,
  match,
  type
}) => {
  switch (type) {
    case "user":
      return (
        <Container>
          <Touchable>
            <Image
              style={{ height: 40, width: 40, borderRadius: 20 }}
              source={
                user.appAvatarUrl && {
                  uri: `${BACKEND_URL}/media/${user.appAvatarUrl}`
                }
              }
            />
          </Touchable>
          <Touchable>
            <HeaderUserContainer>
              <Bold>{user.username}</Bold>
              <Location>
                {user.currentCity.cityName},{" "}
                {user.currentCity.country.countryName}
              </Location>
            </HeaderUserContainer>
          </Touchable>
        </Container>
      );
    case "city":
      return (
        <Container>
          <Touchable>
            <Image
              style={{ height: 40, width: 40, borderRadius: 5 }}
              source={
                city.cityThumbnail && {
                  uri: city.cityThumbnail
                }
              }
            />
          </Touchable>
          <Touchable>
            <HeaderUserContainer>
              <Bold>{city.cityName}</Bold>
              <Location>{city.country.countryName}</Location>
            </HeaderUserContainer>
          </Touchable>
        </Container>
      );
    case "trip":
      return (
        <Container>
          <Touchable>
            <Image
              style={{ height: 40, width: 40, borderRadius: 5 }}
              source={
                trip.city.cityThumbnail && {
                  uri: trip.city.cityThumbnail
                }
              }
            />
          </Touchable>
          <Touchable>
            <HeaderUserContainer>
              <Bold>{trip.city.cityName}</Bold>
              <Location>{trip.city.country.countryName}</Location>
            </HeaderUserContainer>
          </Touchable>
        </Container>
      );
    case "coffee":
      return (
        <Container>
          <Touchable>
            <Image
              style={{ height: 40, width: 40, borderRadius: 20 }}
              source={
                coffee.host.profile.appAvatarUrl && {
                  uri: `${BACKEND_URL}/media/${coffee.host.profile.appAvatarUrl}`
                }
              }
            />
          </Touchable>
          <Touchable>
            <HeaderUserContainer>
              <Bold>{coffee.host.username}</Bold>
              <Location>
                {coffee.city.cityName}, {coffee.city.country.countryName}
              </Location>
            </HeaderUserContainer>
          </Touchable>
        </Container>
      );
    case "match":
      return (
        <>
          {match.isHost ? (
            <Container>
              <Touchable>
                <Image
                  style={{ height: 40, width: 40, borderRadius: 20 }}
                  source={
                    match.guest.profile.appAvatarUrl && {
                      uri: `${BACKEND_URL}/media/${match.guest.profile.appAvatarUrl}`
                    }
                  }
                />
              </Touchable>
              <Touchable>
                <HeaderUserContainer>
                  <Bold>{match.coffee.guest.profile.username}</Bold>
                  <Location>
                    {match.coffee.city.cityName},{" "}
                    {match.coffee.city.country.countryName}
                  </Location>
                </HeaderUserContainer>
              </Touchable>
            </Container>
          ) : (
            <Container>
              <Touchable>
                <Image
                  style={{ height: 40, width: 40, borderRadius: 20 }}
                  source={
                    match.host.profile.appAvatarUrl && {
                      uri: `${BACKEND_URL}/media/${match.host.profile.appAvatarUrl}`
                    }
                  }
                />
              </Touchable>
              <Touchable>
                <HeaderUserContainer>
                  <Bold>{match.host.profile.username}</Bold>
                  <Location>
                    {match.coffee.city.cityName},{" "}
                    {match.coffee.city.country.countryName}
                  </Location>
                </HeaderUserContainer>
              </Touchable>
            </Container>
          )}
        </>
      );
    default:
      return null;
  }
};

export default UserRow;
