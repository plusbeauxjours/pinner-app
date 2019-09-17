import React from "react";
import styled from "styled-components";
import constans from "../../constants";

const Container = styled.View`
  margin-bottom: 10px;
`;

const TextInput = styled.TextInput`
  width: ${constans.width / 2};
  padding: 10px;
  background-color: ${props => props.theme.greyColor};
  border: 1px solid ${props => props.theme.darkGreyColor};
  border-radius: 4px;
`;

interface IProps {
  placeholder: string;
  value: string;
  keyboardType?: string;
  autoCapitalize?: string;
  onChange?: () => void;
}

const AuthInput: React.FC<IProps> = ({
  placeholder,
  value,
  keyboardType = "default",
  autoCapitalize = "none",
  onChange
}) => (
  <Container>
    <TextInput
      onChangeText={onChange}
      keyboardType={keyboardType}
      placeholder={placeholder}
      autoCapitalize={autoCapitalize}
      value={value}
    />
  </Container>
);

export default AuthInput;
