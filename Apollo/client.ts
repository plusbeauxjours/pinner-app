import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { createUploadLink } from "apollo-upload-client";
import { ApolloLink, Observable } from "apollo-link";
import { withClientState } from "apollo-link-state";
import { onError } from "apollo-link-error";
import browserHistory from "./browserHistory";
import { ApolloClient } from "apollo-boost";
import dotenv from "dotenv";
dotenv.config();
require("dotenv").config();

const cache = new InMemoryCache();
console.log(process.env.NODE_ENV);
const API_SERVER = "https://pinner-backend.herokuapp.com/graphql";
const uploadLink = createUploadLink({
  uri:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000/graphql"
      : API_SERVER,
  fetch
});

const request = async operation => {
  operation.setContext({
    headers: {
      Authorization: `JWT ${localStorage.getItem("jwt") || ""}`
    }
  });
};

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable(observer => {
      let handle;
      Promise.resolve(operation)
        .then(oper => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer)
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) {
          handle.unsubscribe();
        }
      };
    })
);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (networkError) {
    browserHistory.push("/404");
    console.log(`[Network error]: ${networkError}`);
  }
  // if (graphQLErrors) {
  //   graphQLErrors.map(({ message, locations, path }) => {
  //     graphQLErrors.forEach(error => toast.error(error.message));
  //     console.log(
  //       `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
  //     );
  //   });
  // }
});

const httpLink = new HttpLink({ uri: API_SERVER });

const client = new ApolloClient({
  link: ApolloLink.from([
    withClientState({
      defaults: {
        auth: {
          __typename: "Auth",
          isLoggedIn: Boolean(localStorage.getItem("jwt")) || false
        }
      },
      resolvers: {
        Mutation: {
          logUserIn: (_, { token }, { cache: mutationCache }) => {
            localStorage.setItem("jwt", token);
            mutationCache.writeData({
              data: {
                auth: {
                  __typename: "Auth",
                  isLoggedIn: true
                }
              }
            });
            return null;
          },
          logUserOut: (_, __, { cache: mutationCache }) => {
            localStorage.removeItem("jwt");
            window.location.reload();
            return null;
          }
        }
      },
      cache
    }),
    requestLink,
    errorLink,
    uploadLink,
    httpLink
  ]),
  cache
});

export default client;
