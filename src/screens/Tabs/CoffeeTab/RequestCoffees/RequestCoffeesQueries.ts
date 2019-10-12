import gql from "graphql-tag";
import { COFFEE_FRAGMENT } from "../../../../fragmentQueries";

export const REQUEST_COFFEE = gql`
  mutation RequestCoffee(
    $countryCode: String
    $gender: String
    $currentCityId: String!
    $target: String
  ) {
    requestCoffee(
      countryCode: $countryCode
      gender: $gender
      currentCityId: $currentCityId
      target: $target
    ) {
      ok
      coffee {
        ...CoffeeParts
      }
    }
  }
  ${COFFEE_FRAGMENT}
`;
