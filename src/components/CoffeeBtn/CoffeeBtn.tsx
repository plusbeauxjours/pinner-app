import React from "react";
import { MATCH, UNMATCH } from "./CoffeeBtnQueries";
import {
  Match,
  MatchVariables,
  UnMatch,
  UnMatchVariables,
  DeleteCoffee,
  DeleteCoffeeVariables,
  GetMatches,
  GetMatchesVariables
} from "../../types/api";
import { useMutation } from "react-apollo";
import styled from "styled-components";
import { ActivityIndicator } from "react-native";
import Toast from "react-native-root-toast";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { DELETE_COFFEE } from "../../sharedQueries";
import { chat_leave } from "../../../Fire";
import { useMe } from "../../context/MeContext";
import { GET_MATCHES } from "../../screens/Tabs/MatchTab/Match/MatchQueries";
import constants from "../../../constants";

const Touchable = styled.TouchableOpacity`
  justify-content: center;
  padding: 0 5px 5px 5px;
`;

const Text = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.color};
`;

const Container = styled.View`
  width: ${constants.width - 40};
  justify-content: center;
  align-items: center;
  height: 40px;
  border: 0.5px solid #999;
  border-radius: 5px;
`;

interface IProps {
  cityId?: string;
  coffeeId?: string;
  matchId?: string;
  isSelf: boolean;
  isMatching?: boolean;
  setModalOpen: any;
  userName: string;
}

const CoffeeBtn: React.FC<IProps> = ({
  cityId,
  coffeeId,
  matchId,
  isSelf,
  isMatching,
  setModalOpen,
  userName
}) => {
  const { me } = useMe();
  const [matchFn, { loading: matchLoading }] = useMutation<
    Match,
    MatchVariables
  >(MATCH, {
    variables: { coffeeId },
    update(cache, { data: { match } }) {
      try {
        const matchData = cache.readQuery<GetMatches, GetMatchesVariables>({
          query: GET_MATCHES
        });
        if (matchData) {
          matchData.getMatches.matches.unshift(match.match);
          cache.writeQuery({
            query: GET_MATCHES,
            data: matchData
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  });
  const [unMatchFn, { loading: unMatchLoading }] = useMutation<
    UnMatch,
    UnMatchVariables
  >(UNMATCH, {
    // unmatch btn won't be shown
    variables: { matchId: parseInt(matchId, 10) }
  });
  const [deleteCoffeeFn, { loading: deleteCoffeeLoading }] = useMutation<
    DeleteCoffee,
    DeleteCoffeeVariables
  >(DELETE_COFFEE);

  const toast = (message: string) => {
    Toast.show(message, {
      duration: 1000,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0
    });
  };
  const match = async coffeeId => {
    await matchFn(coffeeId);
    setModalOpen(false);
    toast("Matched");
  };
  const { showActionSheetWithOptions } = useActionSheet();
  const unMatch = (matchId: string) => {
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        title: "Are you sure to unmatch?"
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          chat_leave(matchId, me.user.profile.id, me.user.username);
          unMatchFn();
          setModalOpen(false);
          toast("unmatched");
        }
      }
    );
  };
  const deleteCoffee = () => {
    showActionSheetWithOptions(
      {
        options: ["Yes", "No"],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
        title: "Are you sure to cancel?"
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          try {
            const {
              data: { deleteCoffee }
            } = await deleteCoffeeFn({
              variables: { coffeeId }
            });
            setModalOpen(false);
            if (deleteCoffee.ok) {
              toast("canceled");
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
    );
  };
  return (
    <>
      {isSelf ? (
        <Touchable disabled={deleteCoffeeLoading} onPress={deleteCoffee}>
          <Container>
            {deleteCoffeeLoading ? (
              <ActivityIndicator color={"#999"} />
            ) : (
              <Text>CANCEL PIN</Text>
            )}
          </Container>
        </Touchable>
      ) : (
        <>
          {!isSelf && isMatching ? (
            <Touchable disabled={unMatchLoading} onPress={unMatch}>
              <Container>
                {unMatchLoading ? (
                  <ActivityIndicator color={"#999"} />
                ) : (
                  <Text>UNMATCH</Text>
                )}
              </Container>
            </Touchable>
          ) : (
            <Touchable disabled={matchLoading} onPress={match}>
              <Container>
                {matchLoading ? (
                  <ActivityIndicator color={"#999"} />
                ) : (
                  <Text>JOIN</Text>
                )}
              </Container>
            </Touchable>
          )}
        </>
      )}
    </>
  );
};

export default CoffeeBtn;
