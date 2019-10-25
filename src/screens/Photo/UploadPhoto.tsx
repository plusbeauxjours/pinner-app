import React, { useState } from "react";
import { useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { Image, ActivityIndicator, Alert } from "react-native";
import useInput from "../../hooks/useInput";
import constants from "../../../constants";
import { theme } from "../../styles/theme";
import { UploadAvatar, UploadAvatarVariables } from "../../types/api";
import Loader from "../../components/Loader";
import { ReactNativeFile } from "apollo-upload-client";
import { UPLOAD_AVATAR } from "../../sharedQueries";
import uuid from "uuid/v4";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  background-color: ${props => props.theme.bgColor};
`;

const Container = styled.View`
  /* padding: 20px; */
  flex-direction: row;
`;

const Form = styled.View`
  justify-content: flex-start;
`;

const STextInput = styled.TextInput`
  margin-bottom: 10px;
  border: 0px solid ${theme.lightGreyColor};
  border-bottom-width: 1px;
  width: ${constants.width - 180};
`;

const Button = styled.TouchableOpacity`
  background-color: ${props => props.theme.blueColor};
  padding: 10px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

const Text = styled.Text`
  color: ${props => props.theme.color};
  font-weight: 600;
`;

export default ({ navigation }) => {
  const [loading, setIsLoadding] = useState(false);
  const photo = navigation.getParam("photo");
  const captionInput = useInput("d");
  const locationInput = useInput("d");
  const [
    UploadAvatarFn,
    { data: uploadData, loading: uploadLoading }
  ] = useMutation<UploadAvatar, UploadAvatarVariables>(UPLOAD_AVATAR);
  const handleSubmit = () => {
    if (captionInput.value === "" || locationInput.value === "") {
      Alert.alert("All fileds are required");
    } else {
      const name = uuid();
      const [, type] = photo.split(".");
      const file = new ReactNativeFile({
        uri: photo,
        type: type.toLowerCase(),
        name
      });
      UploadAvatarFn({ variables: { file } });
      navigation.pop();
    }
  };
  if (uploadLoading) {
    return (
      <View>
        <Loader />
      </View>
    );
  } else {
    return (
      <View>
        <Container>
          <Image
            source={{ uri: navigation.getParam("photo").uri }}
            style={{ height: 80, width: 80, marginRight: 30 }}
          />
          <Form>
            <STextInput
              onChangeText={captionInput.onChange}
              value={captionInput.value}
              placeholder="Caption"
              multiline={true}
              placeholderTextColor={"#999"}
            />
            <STextInput
              onChangeText={locationInput.onChange}
              value={locationInput.value}
              placeholder="Location"
              multiline={true}
              placeholderTextColor={"#999"}
            />
            <Button onPress={handleSubmit}>
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text>Upload</Text>
              )}
            </Button>
          </Form>
        </Container>
        <Text>Upload {navigation.getParam("photo").uri}</Text>
      </View>
    );
  }
};
