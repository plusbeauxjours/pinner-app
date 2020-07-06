import React from "react";
import { ScreenOrientation } from "expo";
import { RefreshControl, FlatList, Platform } from "react-native";

import styled from "styled-components";
import Modal from "react-native-modal";
import ImageZoom from "react-native-image-pan-zoom";
import { Image as ProgressiveImage } from "react-native-expo-image-cache";

import Loader from "../../../../components/Loader";
import constants, { BACKEND_URL } from "../../../../../constants";
import { useTheme } from "../../../../context/ThemeContext";

const TextContainer = styled.View`
  margin-top: 15px;
  justify-content: center;
  align-items: center;
`;

const Text = styled.Text`
  color: ${(props) => props.theme.color};
  font-size: 8px;
  margin-left: 5px;
`;

const Touchable = styled.TouchableOpacity``;

const Container = styled.View`
  background-color: ${(props) => props.theme.bgColor};
`;

const ScrollView = styled.ScrollView`
  background-color: ${(props) => props.theme.bgColor};
`;

const LoaderContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.bgColor};
  justify-content: center;
  align-items: center;
`;

interface IProps {
  avatarLoading: boolean;
  meLoading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  avatars: any;
  modalOpen: boolean;
  openModal: (item: any) => void;
  closeModal: () => void;
  isSelf: boolean;
  avatar: any;
  onPress: () => void;
}

const AvatarListPresenter: React.FC<IProps> = ({
  avatarLoading,
  meLoading,
  refreshing,
  onRefresh,
  avatars,
  modalOpen,
  openModal,
  closeModal,
  isSelf,
  avatar,
  onPress,
}) => {
  const isDarkMode = useTheme();

  if (avatarLoading || meLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  } else {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={"#999"}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {avatars && avatars.length !== 0 ? (
          <>
            <Modal
              style={{ margin: 0, alignItems: "flex-start", zIndex: 10 }}
              isVisible={modalOpen}
              backdropColor={
                isDarkMode && isDarkMode === true ? "#161616" : "#EFEFEF"
              }
              onBackdropPress={async () => {
                await ScreenOrientation.lockAsync(
                  ScreenOrientation.OrientationLock.PORTRAIT_UP
                );
                closeModal();
              }}
              onBackButtonPress={async () => {
                Platform.OS === "android" &&
                  (await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.PORTRAIT_UP
                  ));
                closeModal();
              }}
              onModalHide={async () => {
                {
                  await ScreenOrientation.lockAsync(
                    ScreenOrientation.OrientationLock.PORTRAIT_UP
                  );
                  closeModal();
                }
              }}
              propagateSwipe={true}
              scrollHorizontal={true}
              backdropOpacity={0.9}
              animationIn="fadeIn"
              animationOut="fadeOut"
              animationInTiming={200}
              animationOutTiming={200}
              backdropTransitionInTiming={200}
              backdropTransitionOutTiming={200}
            >
              <ImageZoom
                cropWidth={constants.width}
                cropHeight={constants.width}
                imageWidth={constants.width}
                imageHeight={constants.width}
                onClick={() => {
                  isSelf && !avatar.isMain && !avatarLoading && onPress();
                }}
              >
                <ProgressiveImage
                  tint={isDarkMode ? "dark" : "light"}
                  style={{
                    height: constants.width,
                    width: constants.width,
                    padding: 0,
                    margin: 0,
                    position: "absolute",
                  }}
                  preview={{
                    uri: `${BACKEND_URL}/media/${avatar.thumbnail}`,
                  }}
                  uri={`${BACKEND_URL}/media/${avatar.image}`}
                />
              </ImageZoom>
            </Modal>
            <Container>
              <FlatList
                data={avatars}
                renderItem={({ item }: any) => (
                  <Container
                    style={{
                      margin: 0.5,
                    }}
                  >
                    <Touchable
                      disabled={!item.image && true}
                      onPress={() => {
                        item.image && openModal(item);
                      }}
                    >
                      {item.isMain && isSelf ? (
                        <ProgressiveImage
                          tint={isDarkMode ? "dark" : "light"}
                          style={{
                            height: constants.width / 3 - 1,
                            width: constants.width / 3 - 1,
                            borderRadius: constants.width / 3 / 2,
                          }}
                          preview={{
                            uri: `${BACKEND_URL}/media/${item.thumbnail}`,
                          }}
                          uri={`${BACKEND_URL}/media/${item.thumbnail}`}
                        />
                      ) : (
                        <ProgressiveImage
                          tint={isDarkMode ? "dark" : "light"}
                          style={{
                            height: constants.width / 3 - 1,
                            width: constants.width / 3 - 1,
                          }}
                          preview={{
                            uri: `${BACKEND_URL}/media/${item.thumbnail}`,
                          }}
                          uri={`${BACKEND_URL}/media/${item.thumbnail}`}
                        />
                      )}
                    </Touchable>
                  </Container>
                )}
                numColumns={3}
                keyExtractor={(item: any) => item.id}
              />
            </Container>
          </>
        ) : (
          <TextContainer>
            <Text>No photo yet...</Text>
          </TextContainer>
        )}
      </ScrollView>
    );
  }
};

export default AvatarListPresenter;
