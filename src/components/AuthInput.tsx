import React from "react";
import styled from "styled-components";

const Container = styled.View`
  margin-bottom: 10px;
`;

const TextInput = styled.TextInput``;

interface IProps {
  placeholder: string;
  value: string;
  keyboardType?: string;
  autoCapitalize?: string;
}

const AuthInput: React.FC<IProps> = ({
  placeholder,
  value,
  keyboardType = "default",
  autoCapitalize = "none"
}) => (
  <Container>
    <TextInput
      keyboardType={keyboardType}
      placeholder={placeholder}
      autoCapitalize={autoCapitalize}
      value={value}
    />
  </Container>
);

export default AuthInput;
