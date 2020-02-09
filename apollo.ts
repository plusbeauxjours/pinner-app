import { Operation } from "apollo-boost";
import { AsyncStorage } from "react-native";

const apolloClientOptions = {
  uri: "https://pinner-backend.herokuapp.com/graphql",
  // uri: "http://localhost:8000/graphql",
  request: async (operation: Operation) => {
    const token = await AsyncStorage.getItem("jwt");
    operation.setContext({
      headers: {
        authorization: token ? `JWT ${token}` : ""
      }
    });
  }
};

export default apolloClientOptions;
