// import React, { useState } from "react";
// import styled from "styled-components";
// import { RefreshControl } from "react-native";
// import { GetCoffees, GetCoffeesVariables } from "../../../../types/api";
// import { useQuery } from "react-apollo-hooks";

// import Loader from "../../../../components/Loader";
// import UserRow from "../../../../components/UserRow";
// import { countries } from "../../../../../countryData";
// import { GET_COFFEES } from "../../../../sharedQueries";

// const View = styled.View`
//   justify-content: center;
//   align-items: center;
//   flex: 1;
//   background-color: ${props => props.theme.bgColor};
// `;
// const Bold = styled.Text`
//   font-weight: 500;
//   font-size: 20;
//   color: ${props => props.theme.color};
// `;
// const Touchable = styled.TouchableOpacity``;
// const Text = styled.Text`
//   color: ${props => props.theme.color};
// `;
// const ScrollView = styled.ScrollView`
//   background-color: ${props => props.theme.bgColor};
// `;

// export default ({ navigation }) => {
//   const [username, setUsername] = useState(navigation.getParam("username"));
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const {
//     data: { getCoffees: { coffees = null } = {} } = {},
//     loading,
//     refetch
//   } = useQuery<GetCoffees, GetCoffeesVariables>(GET_COFFEES, {
//     variables: {
//       userId,
//       location: "history"
//     }
//   });
//   const onRefresh = async () => {
//     try {
//       setRefreshing(true);
//       await refetch();
//     } catch (e) {
//       console.log(e);
//     } finally {
//       setRefreshing(false);
//     }
//   };
//   if (loading) {
//     return <Loader />;
//   } else {
//     return (
//       <ScrollView
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         <View>
//           <Bold>COFFEES</Bold>
//           {coffees &&
//             coffees.map((coffee, index) => (
//               <Touchable
//                 key={index}
//                 onPress={() =>
//                   navigation.push("CityProfileTabs", {
//                     cityId: coffee.city.cityId,
//                     countryCode: coffee.city.country.countryCode,
//                     continentCode: countries.find(
//                       i => i.code === coffee.city.country.countryCode
//                     ).continent
//                   })
//                 }
//               >
//                 <UserRow
//                   key={index}
//                   coffee={coffee}
//                   type={"userProfileCoffee"}
//                 />
//               </Touchable>
//             ))}
//         </View>
//       </ScrollView>
//     );
//   }
// };
