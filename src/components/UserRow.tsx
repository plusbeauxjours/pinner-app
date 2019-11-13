import React from "react";
import { Image } from "react-native";
import constants, { BACKEND_URL } from "../../constants";
import CityLikeBtn from "./CityLikeBtn/CityLikeBtn";
import moment from "moment";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";
import styled from "styled-components";

const Container = styled.View`
  padding: 15px 5px 15px 5px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  width: ${constants.width - 30};
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
  color: ${props => props.theme.color};
`;
const Location = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.color};
`;
const Header = styled.View`
  flex: 2;
  flex-direction: row;
`;
const SmallText = styled.Text`
  font-size: 9px;
  color: #999;
  text-align: center;
`;
const Mark = styled.Text`
  color: ${props => props.theme.color};
  position: absolute;
  font-size: 9px;
  padding: 1px 0 0 1px;
`;
const Text = styled.Text`
  color: ${props => props.theme.color};
`;
const GreyText = styled(Text)`
  margin-left: 15px;
  color: ${props => props.theme.greyColor};
`;
const Items = styled.View`
  flex: 1;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
`;
const TripItems = styled.View`
  flex-wrap: wrap;
  flex-direction: row-reverse;
  width: 180px;
  justify-content: space-between;
  align-content: center;
`;
const ColumnItems = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const DistanceGreyText = styled(GreyText)`
  margin-right: 20;
`;
const ImageContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 40px;
`;
const GreyLocation = styled(Location)`
  opacity: 0.6;
`;
const View = styled.View`
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 40px;
  width: 40px;
  border: 0.5px solid #999;
  padding: 2px;
  border-radius: 5px;
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
              <ImageContainer>
                <Image
                  style={{ height: 36, width: 36, borderRadius: 18 }}
                  source={
                    user.appAvatarUrl
                      ? { uri: `${BACKEND_URL}/media/${user.appAvatarUrl}` }
                      : require(`../Images/avatars/earth1.png`)
                  }
                />
              </ImageContainer>
            </Touchable>
            <Touchable>
              <HeaderUserContainer>
                <Bold>{user.username}</Bold>
                <Location>
                  {user.currentCity && user.currentCity.cityName},{" "}
                  {user.currentCity && user.currentCity.country.countryName}
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
              <ImageContainer>
                <Image
                  style={{ height: 36, width: 36, borderRadius: 18 }}
                  source={
                    user.appAvatarUrl
                      ? { uri: `${BACKEND_URL}/media/${user.appAvatarUrl}` }
                      : require(`../Images/avatars/earth1.png`)
                  }
                />
              </ImageContainer>
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
              {trip.city.cityThumbnail ? (
                <ProgressiveImage
                  style={{ height: 40, width: 40, borderRadius: 5 }}
                  preview={
                    trip.city.cityThumbnail && {
                      uri: trip.city.cityThumbnail
                    }
                  }
                  uri={trip.city.cityThumbnail && trip.city.cityThumbnail}
                />
              ) : (
                <View>
                  <SmallText>NO PHOTO</SmallText>
                </View>
              )}
            </Touchable>
            <Touchable>
              <HeaderUserContainer>
                <Bold>
                  {trip.city.cityName.length > 18
                    ? trip.city.cityName.substring(0, 18) + "..."
                    : trip.city.cityName}
                </Bold>
                <Location>{trip.city.country.countryName}</Location>
              </HeaderUserContainer>
            </Touchable>
          </Header>
          <TripItems>
            {trip.diffDays && (
              <>
                {trip.diffDays !== 1 ? (
                  <GreyText>{trip.diffDays} days</GreyText>
                ) : (
                  <GreyText>{trip.diffDays} day</GreyText>
                )}
              </>
            )}
            <ColumnItems>
              {trip.endDate && (
                <GreyText>{moment(trip.endDate).format("MMM Do YY")}</GreyText>
              )}
              {trip.startDate && (
                <GreyText>
                  {moment(trip.startDate).format("MMM Do YY")}
                </GreyText>
              )}
            </ColumnItems>
          </TripItems>
        </Container>
      );
    case "city":
      return (
        <Container>
          <Header>
            <Touchable>
              {city.cityThumbnail ? (
                <ProgressiveImage
                  style={{ height: 40, width: 40, borderRadius: 5 }}
                  preview={
                    city.cityThumbnail && {
                      uri: city.cityThumbnail
                    }
                  }
                  uri={city.cityThumbnail && city.cityThumbnail}
                />
              ) : (
                <View>
                  <SmallText>NO PHOTO</SmallText>
                </View>
              )}
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
    case "nearCity":
      return (
        <Container>
          <Header>
            <Touchable>
              {city.cityThumbnail ? (
                <ProgressiveImage
                  style={{ height: 40, width: 40, borderRadius: 5 }}
                  preview={
                    city.cityThumbnail && {
                      uri: city.cityThumbnail
                    }
                  }
                  uri={city.cityThumbnail && city.cityThumbnail}
                />
              ) : (
                <View>
                  <SmallText>NO PHOTO</SmallText>
                </View>
              )}
            </Touchable>
            <Touchable>
              <HeaderUserContainer>
                <Bold>{city.cityName}</Bold>
                <Location>{city.country.countryName}</Location>
              </HeaderUserContainer>
            </Touchable>
          </Header>
          <Items>
            <CityLikeBtn
              isLiked={city.isLiked}
              cityId={city.cityId}
              likeCount={city.likeCount}
            />
            <DistanceGreyText>{city.distance} km</DistanceGreyText>
          </Items>
        </Container>
      );
    case "userProfileCity":
      return (
        <Container>
          <Header>
            <Touchable>
              {city.cityThumbnail ? (
                <ProgressiveImage
                  style={{ height: 40, width: 40, borderRadius: 5 }}
                  preview={
                    city.cityThumbnail && {
                      uri: city.cityThumbnail
                    }
                  }
                  uri={city.cityThumbnail && city.cityThumbnail}
                />
              ) : (
                <View>
                  <SmallText>NO PHOTO</SmallText>
                </View>
              )}
            </Touchable>
            <Touchable>
              <HeaderUserContainer>
                <Bold>{city.cityName}</Bold>
                <Location>{city.country.countryName}</Location>
              </HeaderUserContainer>
            </Touchable>
          </Header>
          <Items>
            {count && (
              <>
                {count !== 1 ? (
                  <GreyText>{count} times</GreyText>
                ) : (
                  <GreyText>{count} time</GreyText>
                )}
              </>
            )}
            {diff && (
              <>
                {diff !== 1 ? (
                  <GreyText>{diff} days</GreyText>
                ) : (
                  <GreyText>{diff} day</GreyText>
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
              {country.countryThumbnail ? (
                <ProgressiveImage
                  style={{ height: 40, width: 40, borderRadius: 5 }}
                  preview={
                    country.countryThumbnail && {
                      uri: country.countryThumbnail
                    }
                  }
                  uri={country.countryThumbnail && country.countryThumbnail}
                />
              ) : (
                <View>
                  <SmallText>NO PHOTO</SmallText>
                </View>
              )}
            </Touchable>
            <Touchable>
              <HeaderUserContainer>
                <Bold>{country.countryName}</Bold>
                <Location>{country.continent.continentName}</Location>
              </HeaderUserContainer>
            </Touchable>
          </Header>
          <GreyText>
            {country.cityCount} {country.cityCount === 1 ? "city" : "cities"}
          </GreyText>
        </Container>
      );
    case "userProfileCountry":
      return (
        <Container>
          <Header>
            <Touchable>
              {country.countryThumbnail ? (
                <ProgressiveImage
                  style={{ height: 40, width: 40, borderRadius: 5 }}
                  preview={
                    country.countryThumbnail && {
                      uri: country.countryThumbnail
                    }
                  }
                  uri={country.countryThumbnail && country.countryThumbnail}
                />
              ) : (
                <View>
                  <SmallText>NO PHOTO</SmallText>
                </View>
              )}
            </Touchable>
            <Touchable>
              <HeaderUserContainer>
                <Bold>{country.countryName}</Bold>
                <Location>{country.continent.continentName}</Location>
              </HeaderUserContainer>
            </Touchable>
          </Header>
          <Items>
            {count && (
              <>
                {count !== 1 ? (
                  <GreyText>{count} times</GreyText>
                ) : (
                  <GreyText>{count} time</GreyText>
                )}
              </>
            )}
            {diff && (
              <>
                {diff !== 1 ? (
                  <GreyText>{diff} days</GreyText>
                ) : (
                  <GreyText>{diff} day</GreyText>
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
              {continent.continentThumbnail ? (
                <ProgressiveImage
                  style={{ height: 40, width: 40, borderRadius: 5 }}
                  preview={
                    continent.continentThumbnail && {
                      uri: continent.continentThumbnail
                    }
                  }
                  uri={
                    continent.continentThumbnail && continent.continentThumbnail
                  }
                />
              ) : (
                <View>
                  <SmallText>NO PHOTO</SmallText>
                </View>
              )}
            </Touchable>
            <Touchable>
              <HeaderUserContainer>
                <Bold>{continent.continentName}</Bold>
              </HeaderUserContainer>
            </Touchable>
          </Header>
          <GreyText>
            {continent.countryCount}{" "}
            {continent.countryCount === 1 ? "country" : "countries"}
          </GreyText>
        </Container>
      );
    case "userProfileContinent":
      return (
        <Container>
          <Header>
            <Touchable>
              {continent.continentThumbnail ? (
                <ProgressiveImage
                  style={{ height: 40, width: 40, borderRadius: 5 }}
                  preview={
                    continent.continentThumbnail && {
                      uri: continent.continentThumbnail
                    }
                  }
                  uri={
                    continent.continentThumbnail && continent.continentThumbnail
                  }
                />
              ) : (
                <View>
                  <SmallText>NO PHOTO</SmallText>
                </View>
              )}
            </Touchable>
            <Touchable>
              <HeaderUserContainer>
                <Bold>{continent.continentName}</Bold>
              </HeaderUserContainer>
            </Touchable>
          </Header>
          <Items>
            {count && (
              <>
                {count !== 1 ? (
                  <GreyText>{count} times</GreyText>
                ) : (
                  <GreyText>{count} time</GreyText>
                )}
              </>
            )}
            {diff && (
              <>
                {diff !== 1 ? (
                  <GreyText>{diff} days</GreyText>
                ) : (
                  <GreyText>{diff} day</GreyText>
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
              <ImageContainer>
                <Image
                  style={{ height: 36, width: 36, borderRadius: 18 }}
                  source={
                    coffee.host.profile.appAvatarUrl
                      ? {
                          uri: `${BACKEND_URL}/media/${coffee.host.profile.appAvatarUrl}`
                        }
                      : require(`../Images/avatars/earth1.png`)
                  }
                />
              </ImageContainer>
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
              {coffee.city.cityThumbnail ? (
                <ProgressiveImage
                  style={{ height: 40, width: 40, borderRadius: 5 }}
                  preview={
                    coffee.city.cityThumbnail && {
                      uri: coffee.city.cityThumbnail
                    }
                  }
                  uri={coffee.city.cityThumbnail && coffee.city.cityThumbnail}
                />
              ) : (
                <View>
                  <SmallText>NO PHOTO</SmallText>
                </View>
              )}
            </Touchable>
            <Touchable>
              <HeaderUserContainer>
                <Bold>
                  {coffee.city.cityName}
                  <SmallText>
                    &nbsp; | {coffee.target} | {coffee.naturalTime}
                  </SmallText>
                </Bold>
                <Location>{coffee.city.country.countryName}</Location>
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
                  <ImageContainer>
                    <Image
                      style={{ height: 36, width: 36, borderRadius: 18 }}
                      source={
                        match.guest.profile.appAvatarUrl
                          ? {
                              uri: `${BACKEND_URL}/media/${match.guest.profile.appAvatarUrl}`
                            }
                          : require(`../Images/avatars/earth1.png`)
                      }
                    />
                  </ImageContainer>
                  {!match.isReadByHost && <Mark>N</Mark>}
                </Touchable>
                <Touchable>
                  <HeaderUserContainer>
                    <Bold>{match.guest.profile.username}</Bold>
                    <Location>
                      {match.guest.profile.currentCity.cityName},{" "}
                      {match.guest.profile.currentCity.country.countryName}
                    </Location>
                    {console.log(match)}
                    <GreyLocation>
                      Matched in {match.city.cityName}
                      {match.city.country.countryEmoji}
                    </GreyLocation>
                  </HeaderUserContainer>
                </Touchable>
              </Header>
            </Container>
          ) : (
            <Container onPress={() => onPress(match.id)}>
              <Header>
                <Touchable>
                  <ImageContainer>
                    <Image
                      style={{ height: 36, width: 36, borderRadius: 18 }}
                      source={
                        match.host.profile.appAvatarUrl
                          ? {
                              uri: `${BACKEND_URL}/media/${match.host.profile.appAvatarUrl}`
                            }
                          : require(`../Images/avatars/earth1.png`)
                      }
                    />
                  </ImageContainer>
                  {!match.isReadByGuest && <Mark>N</Mark>}
                </Touchable>
                <Touchable>
                  <HeaderUserContainer>
                    <Bold>{match.host.profile.username}</Bold>
                    <Location>
                      {match.host.profile.currentCity.cityName},{" "}
                      {match.host.profile.currentCity.country.countryName}
                    </Location>
                    <GreyLocation>
                      Matched in {match.city.cityName}
                      {match.city.country.countryEmoji}
                    </GreyLocation>
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
