import React, { useState } from "react";
import { useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { Image, ActivityIndicator, Alert } from "react-native";
import useInput from "../../hooks/useInput";
import constants from "../../../constants";
import { theme } from "../../styles/theme";
import { UPLOAD_AVATAR } from "../Tabs/UserProfileTab/AvatarList/AvatarListQueries";
import { UploadAvatar, UploadAvatarVariables } from "../../types/api";
import Loader from "../../components/Loader";
import { ReactNativeFile } from "apollo-upload-client";

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
  border-bottom: 10px;
  width: ${constants.width - 180};
`;

const Button = styled.TouchableOpacity`
  background-color: ${props => props.theme.blueColor};
  /* padding: 10px; */
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
  const [UploadAvatarFn, { loading: uploadLoading }] = useMutation<
    UploadAvatar,
    UploadAvatarVariables
  >(UPLOAD_AVATAR, {});
  const handleSubmit = async () => {
    if (captionInput.value === "" || locationInput.value === "") {
      Alert.alert("All fileds are required");
    } else {
      // let file = { uri: photo.path, type: 'image/jpeg', name: photo.fileName }
      // const data = new FormData(); data.append('file',file)
      console.log(photo);
      const name = photo.filename;
      const [, type] = name.split(".");
      console.log(type.toLowerCase());
      const file = new ReactNativeFile({
        uri: photo.uri,
        type: type.toLowerCase(),
        name
      });
      console.log(file);
      UploadAvatarFn({ variables: { file } });
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
