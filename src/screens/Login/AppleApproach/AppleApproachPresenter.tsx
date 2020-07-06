import React from "react";
import { ActivityIndicator } from "react-native";

import styled from "styled-components";
import { FontAwesome } from "@expo/vector-icons";

const Touchable = styled.TouchableOpacity``;

const Container = styled.View`
  flex-direction: row;
  background-color: #000;
  width: 260px;
  height: 40px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const LoginTextContainer = styled.View`
  width: 220px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const Text = styled.Text`
  color: white;
  font-weight: 600;
`;

interface IProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  appleLogin: () => void;
}

const AppleApproachPresenter: React.FC<IProps> = ({
  loading,
  setLoading,
  appleLogin,
}) => {
  return (
    <Touchable
      disabled={loading}
      onPress={() => {
        setLoading(true), appleLogin();
      }}
    >
      <Container>
        {loading ? (
          <ActivityIndicator color={"white"} />
        ) : (
          <LoginTextContainer>
            <FontAwesome
              name={"apple"}
              color={"white"}
              size={25}
              style={{ marginRight: 10 }}
            />
            <Text>Continue with Apple</Text>
          </LoginTextContainer>
        )}
      </Container>
    </Touchable>
  );
};

export default AppleApproachPresenter;
