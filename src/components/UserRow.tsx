import React from "react";
import { Image } from "react-native";
import styled from "styled-components";
import { BACKEND_URL } from "../../constants";

const Container = styled.View``;
const Header = styled.View`
  padding: 15px;
  flex-direction: row;
  align-items: center;
`;
const Touchable = styled.TouchableOpacity``;
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
  host: any;
  city: any;
}

const UserRow: React.FC<IProps> = ({ host, city }) => {
  const imageNumber = Math.round(Math.random() * 9);
  return (
    <Container>
      <Header>
        <Touchable>
          <Image
            style={{ height: 40, width: 40, borderRadius: 20 }}
            source={
              host.profile.appAvatarUrl && {
                uri: `${BACKEND_URL}/media/${host.profile.appAvatarUrl}`
              }
            }
          />
        </Touchable>
        <Touchable>
          <HeaderUserContainer>
            <Bold>{host.profile.username}</Bold>
            <Location>{city.cityName}</Location>
          </HeaderUserContainer>
        </Touchable>
      </Header>
    </Container>
  );
};

export default UserRow;
