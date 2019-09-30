import React from "react";
import { Image } from "react-native";
import styled from "styled-components";
import constants, { BACKEND_URL } from "../../constants";
import CityLikeBtn from "./CityLikeBtn/CityLikeBtn";

const Container = styled.View`
  padding: 15px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  width: ${constants.width};
`;
const Touchable = styled.View`
  justify-content: center;
  align-items: center;
`;
const HeaderUserContainer = styled.View`
  margin-left: 10px;
`;
const Bold = styled.Text`
  font-weight: 500;
`;
const Location = styled.Text`
  font-size: 12px;
`;
const Header = styled.View`
  flex: 2;
  flex-direction: row;
`;
const Text = styled.Text``;
const GreyText = styled(Text)`
  margin-right: 15px;
  color: grey;
`;
const Items = styled.View`
  flex: 1;
  flex-direction: row-reverse;
  justify-content: space-between;
`;

interface IProps {
  user?: any;
  city?: any;
  trip?: any;
  country?: any;
  continent?: any;
  coffee?: any;
  match?: any;
  count?: number;
  diff?: number;
  naturalTime?: string;
  type: string;
  onPress?: any;
}

const UserRow: React.FC<IProps> = ({
  user,
  city,
  trip,
  country,
  continent,
  coffee,
  match,
  count,
  diff,
  naturalTime,
  type,
  onPress
}) => {
  switch (type) {
    case "user":
      return (
        <Container>
          <Header>
            <Touchable>
              <Image
                style={{ height: 35, width: 35, borderRadius: 20 }}
                source={
                  user.appAvatarUrl
                    ? { uri: `${BACKEND_URL}/media/${user.appAvatarUrl}` }
                    : require(`../Images/avatars/earth1.png`)
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
          </Header>
        </Container>
      );
    case "userBefore":
      return (
        <Container>
          <Header>
            <Touchable>
              <Image
                style={{ height: 35, width: 35, borderRadius: 20 }}
                source={
                  user.appAvatarUrl
                    ? { uri: `${BACKEND_URL}/media/${user.appAvatarUrl}` }
                    : require(`../Images/avatars/earth1.png`)
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
          </Header>
          <GreyText>{naturalTime}</GreyText>
        </Container>
      );
    case "trip":
      return (
        <Container>
          <Header>
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
          </Header>
        </Container>
      );
    case "city":
      return (
        <Container>
          <Header>
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
          </Header>
          <CityLikeBtn
            isLiked={city.isLiked}
            cityId={city.cityId}
            likeCount={city.likeCount}
          />
        </Container>
      );
    case "userProfileCity":
      return (
        <Container>
          <Header>
            <Touchable>
              <Image
                style={{ height: 40, width: 40, borderRadius: 5 }}
                source={
                  city.cityThumbnail && {
                    uri: `${city.cityThumbnail}`
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
          </Header>
          <Items>
            {diff && (
              <>
                {diff !== 1 ? (
                  <GreyText>{diff} days</GreyText>
                ) : (
                  <GreyText>{diff} day</GreyText>
                )}
              </>
            )}
            {count && (
              <>
                {count !== 1 ? (
                  <GreyText>{count} times</GreyText>
                ) : (
                  <GreyText>{count} time</GreyText>
                )}
              </>
            )}
          </Items>
        </Container>
      );
    case "country":
      return (
        <Container>
          <Header>
            <Touchable>
              <Image
                style={{ height: 40, width: 40, borderRadius: 5 }}
                source={
                  country.countryThumbnail && {
                    uri: country.countryThumbnail
                  }
                }
              />
            </Touchable>
            <Touchable>
              <HeaderUserContainer>
                <Bold>{country.countryName}</Bold>
                <Location>{country.continent.continentName}</Location>
              </HeaderUserContainer>
            </Touchable>
          </Header>
        </Container>
      );
    case "userProfileCountry":
      return (
        <Container>
          <Header>
            <Touchable>
              <Image
                style={{ height: 40, width: 40, borderRadius: 5 }}
                source={
                  country.countryThumbnail && {
                    uri: country.countryThumbnail
                  }
                }
              />
            </Touchable>
            <Touchable>
              <HeaderUserContainer>
                <Bold>{country.countryName}</Bold>
                <Location>{country.continent.continentName}</Location>
              </HeaderUserContainer>
            </Touchable>
          </Header>
          <Items>
            {diff && (
              <>
                {diff !== 1 ? (
                  <GreyText>{diff} days</GreyText>
                ) : (
                  <GreyText>{diff} day</GreyText>
                )}
              </>
            )}
            {count && (
              <>
                {count !== 1 ? (
                  <GreyText>{count} times</GreyText>
                ) : (
                  <GreyText>{count} time</GreyText>
                )}
              </>
            )}
          </Items>
        </Container>
      );
    case "continent":
      return (
        <Container>
          <Header>
            <Touchable>
              <Image
                style={{ height: 40, width: 40, borderRadius: 5 }}
                source={
                  continent.continentThumbnail && {
                    uri: continent.continentThumbnail
                  }
                }
              />
            </Touchable>
            <Touchable>
              <HeaderUserContainer>
                <Bold>{continent.continentName}</Bold>
              </HeaderUserContainer>
            </Touchable>
          </Header>
        </Container>
      );
    case "userProfileContinent":
      return (
        <Container>
          <Header>
            <Touchable>
              <Image
                style={{ height: 40, width: 40, borderRadius: 5 }}
                source={
                  continent.continentThumbnail && {
                    uri: continent.continentThumbnail
                  }
                }
              />
            </Touchable>
            <Touchable>
              <HeaderUserContainer>
                <Bold>{continent.continentName}</Bold>
              </HeaderUserContainer>
            </Touchable>
          </Header>
          <Items>
            {diff && (
              <>
                {diff !== 1 ? (
                  <GreyText>{diff} days</GreyText>
                ) : (
                  <GreyText>{diff} day</GreyText>
                )}
              </>
            )}
            {count && (
              <>
                {count !== 1 ? (
                  <GreyText>{count} times</GreyText>
                ) : (
                  <GreyText>{count} time</GreyText>
                )}
              </>
            )}
          </Items>
        </Container>
      );
    case "coffee":
      return (
        <Container>
          <Header>
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
          </Header>
        </Container>
      );
    case "userProfileCoffee":
      return (
        <Container>
          <Header>
            <Touchable>
              <Image
                style={{ height: 40, width: 40, borderRadius: 5 }}
                source={
                  coffee.city.cityThumbnail && {
                    uri: `${coffee.city.cityThumbnail}`
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
          </Header>
        </Container>
      );
    case "match":
      return (
        <>
          {match.isHost ? (
            <Container onPress={() => onPress(match.id)}>
              <Header>
                <Touchable>
                  {!match.isReadByHost && <Text>N</Text>}
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
              </Header>
            </Container>
          ) : (
            <Container onPress={() => onPress(match.id)}>
              <Header>
                <Touchable>
                  {!match.isReadByGuest && <Text>N</Text>}
                  <Image
                    style={{ height: 35, width: 35, borderRadius: 20 }}
                    source={
                      match.host.profile.appAvatarUrl
                        ? {
                            uri: `${BACKEND_URL}/media/${match.host.profile.appAvatarUrl}`
                          }
                        : require(`../Images/avatars/earth1.png`)
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
              </Header>
            </Container>
          )}
        </>
      );

    default:
      return null;
  }
};

export default UserRow;
