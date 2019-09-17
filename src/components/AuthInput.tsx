import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import constants from "../../constants";

const Container = styled.View`
  margin-bottom: 10px;
`;

const TextInput = styled.TextInput`
  width: ${constants.width / 2};
  padding: 10px;
  background-color: ${props => props.theme.greyColor};
  border: 0.5px solid ${props => props.theme.darkGreyColor};
  border-radius: 4px;
`;

interface IProps {
  placeholder: string;
  value: string;
  keyboardType?: string;
  autoCapitalize?: string;
  onChange: (text: any) => void;
  returnKeyType?: string;
  onEndEditing?: () => void;
  autoCorrect?: boolean;
}

const AuthInput: React.FC<IProps> = ({
  placeholder,
  value,
  keyboardType = "default",
  autoCapitalize = "none",
  returnKeyType = "done",
  onChange,
  onEndEditing = () => null,
  autoCorrect = true
}) => (
  <Container>
    <TextInput
      onChangeText={onChange}
      keyboardType={keyboardType}
      returnKeyType={returnKeyType}
      placeholder={placeholder}
      autoCapitalize={autoCapitalize}
      onEndEditing={onEndEditing}
      autoCorrect={autoCorrect}
      value={value}
    />
  </Container>
);

export default AuthInput;
