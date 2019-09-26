import React, { useState } from "react";
import { useMutation } from "react-apollo-hooks";
import styled from "styled-components";
import { useMe } from "../../../../context/MeContext";
import { useLocation } from "../../../../context/LocationContext";
import {
  EditProfile,
  EditProfileVariables,
  DeleteProfile,
  StartEditPhoneVerification,
  StartEditPhoneVerificationVariables,
  CompleteEditPhoneVerification,
  CompleteEditPhoneVerificationVariables,
  CompleteEditEmailVerification,
  CompleteEditEmailVerificationVariables,
  ToggleSettings,
  ToggleSettingsVariables
} from "../../../../types/api";
import {
  EDIT_PROFILE,
  DELETE_PROFILE,
  START_EDIT_PHONE_VERIFICATION,
  COMPLETE_EDIT_PHONE_VERIFICATION,
  START_EDIT_EMAIL_VERIFICATION,
  TOGGLE_SETTINGS
} from "./EditProfileQueries";
import Loader from "../../../../components/Loader";
import {
  StartEditEmailVerification,
  StartEditEmailVerificationVariables
} from "../../../../types/api";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const ToggleContainer = styled.View``;
const ToggleText = styled.Text``;

const Text = styled.Text``;
const Bold = styled.Text`
  font-weight: 500;
  font-size: 20;
`;
const Item = styled.View``;

const Touchable = styled.TouchableOpacity``;

interface IProps {
  navigation: any;
  usernameProp: string;
  bioProp: string;
  genderProp: string;
  firstNameProp: string;
  lastNameProp: string;
  nationalityCodeProp: string;
  residenceCodeProp: string;
  isSelfProp: boolean;
  isDarkModeProp: boolean;
  isHideTripsProp: boolean;
  isHideCoffeesProp: boolean;
  isHideCitiesProp: boolean;
  isHideCountriesProp: boolean;
  isHideContinentsProp: boolean;
  isAutoLocationReportProp: boolean;
  phoneNumberProp: string;
  countryPhoneNumberProp: string;
}
const EditProfile: React.FC<IProps> = ({
  navigation,
  usernameProp,
  bioProp,
  genderProp,
  firstNameProp,
  lastNameProp,
  nationalityCodeProp,
  residenceCodeProp,
  isSelfProp,
  isDarkModeProp,
  isHideTripsProp,
  isHideCoffeesProp,
  isHideCitiesProp,
  isHideCountriesProp,
  isHideContinentsProp,
  isAutoLocationReportProp,
  phoneNumberProp,
  countryPhoneNumberProp
}) => {
  const me = useMe();
  const location = useLocation();
  const [username, setUsername] = useState(usernameProp);
  const [bio, setUio] = useState(bioProp);
  const [gender, setUender] = useState(genderProp);
  const [firstName, setUirstName] = useState(firstNameProp);
  const [lastName, setUastName] = useState(lastNameProp);
  const [nationalityCode, setUationalityCode] = useState(nationalityCodeProp);
  const [residenceCode, setUesidenceCode] = useState(residenceCodeProp);
  const [isSelf, setIsSelf] = useState(isSelfProp);
  const [isDarkMode, setIsDarkMode] = useState(isDarkModeProp);
  const [isHideTrips, setIsHideTrips] = useState(isHideTripsProp);
  const [isHideCoffees, setIsHideCoffees] = useState(isHideCoffeesProp);
  const [isHideCities, setIsHideCities] = useState(isHideCitiesProp);
  const [isHideCountries, setIsHideCountries] = useState(isHideCountriesProp);
  const [isHideContinents, setIsHideContinents] = useState(
    isHideContinentsProp
  );
  const [isAutoLocationReport, setIsAutoLocationReport] = useState(
    isAutoLocationReportProp
  );

  const [phoneNumber, setPhoneNumber] = useState(phoneNumberProp);
  const [countryPhoneNumber, setCountryPhoneNumber] = useState(
    countryPhoneNumberProp
  );

  const [editProfileFn] = useMutation<EditProfile, EditProfileVariables>(
    EDIT_PROFILE,
    {
      variables: {
        username,
        bio,
        gender,
        firstName,
        lastName,
        nationalityCode,
        residenceCode
      }
    }
  );
  const [deleteProfileFn] = useMutation<DeleteProfile>(DELETE_PROFILE);
  const [startEditPhoneVerificationFn] = useMutation<
    StartEditPhoneVerification,
    StartEditPhoneVerificationVariables
  >(START_EDIT_PHONE_VERIFICATION, {
    variables: {
      phoneNumber,
      countryPhoneNumber
    }
  });
  const [completeEditPhoneVerificationFn] = useMutation<
    CompleteEditPhoneVerification,
    CompleteEditPhoneVerificationVariables
  >(COMPLETE_EDIT_PHONE_VERIFICATION, {
    variables: {
      key: "",
      phoneNumber,
      countryPhoneNumber,
      countryPhoneCode: ""
    }
  });

  const [slackReportUsersFn] = useMutation<
    StartEditEmailVerification,
    StartEditEmailVerificationVariables
  >(START_EDIT_EMAIL_VERIFICATION, {
    variables: {
      emailAddress: ""
    }
  });

  const [toggleSettingsFn] = useMutation<
    ToggleSettings,
    ToggleSettingsVariables
  >(TOGGLE_SETTINGS);

  const onPressToggleIcon = async (payload: string) => {
    if (payload === "DARK_MODE") {
      setIsDarkMode(isDarkMode => !isDarkMode);
    } else if (payload === "HIDE_TRIPS") {
      setIsHideTrips(isHideTrips => !isHideTrips);
    } else if (payload === "HIDE_COFFEES") {
      setIsHideCoffees(isHideCoffees => !isHideCoffees);
    } else if (payload === "HIDE_CITIES") {
      setIsHideCities(isHideCities => !isHideCities);
    } else if (payload === "HIDE_COUNTRIES") {
      setIsHideCountries(isHideCountries => !isHideCountries);
    } else if (payload === "HIDE_CONTINENTS") {
      setIsHideContinents(isHideContinents => !isHideContinents);
    } else if (payload === "AUTO_LOCATION_REPORT") {
      setIsAutoLocationReport(isAutoLocationReport => !isAutoLocationReport);
    }
    await toggleSettingsFn({
      variables: { payload }
    });
  };

  return (
    // <>
    //   {loading ? (
    //     <Loader />
    //   ) : (
    //     <View>
    //       <Bold>EditProfile</Bold>
    //       <ToggleContainer>
    //         <ToggleContainer>
    //           <ToggleText>DARK MODE</ToggleText>
    //           <ToggleIcon onClick={toggleTheme}>
    //             {isSelf && theme ? <ToggleOn /> : <ToggleOff />}
    //           </ToggleIcon>
    //         </ToggleContainer>
    //         {isSelf && isDarkMode ? (
    //           <ExplainText>Set to make light background.</ExplainText>
    //         ) : (
    //           <ExplainText>Set to make dark background.</ExplainText>
    //         )}
    //         <ToggleContainer>
    //           <ToggleText>HIDE TRIPS</ToggleText>
    //           <ToggleIcon onPress={() => onPressToggleIcon("HIDE_TRIPS")}>
    //             {isSelf && isHideTrips ? <ToggleOn /> : <ToggleOff />}
    //           </ToggleIcon>
    //         </ToggleContainer>
    //         <ExplainText>
    //           If you set your trips hide, only you can see your trips, otherwise
    //           only number of trips and your trip distance are shown.
    //         </ExplainText>
    //         <ToggleContainer>
    //           <ToggleText>HIDE COFFEES</ToggleText>
    //           <ToggleIcon onPress={() => onPressToggleIcon("HIDE_COFFEES")}>
    //             {isSelf && isHideCoffees ? <ToggleOn /> : <ToggleOff />}
    //           </ToggleIcon>
    //         </ToggleContainer>
    //         <ExplainText>
    //           If you set your coffees hide, only you can see you coffees
    //           request, otherwise only number of coffees request is shown.
    //         </ExplainText>
    //         <ToggleContainer>
    //           <ToggleText>HIDE CITIES</ToggleText>
    //           <ToggleIcon onPress={() => onPressToggleIcon("HIDE_CITIES")}>
    //             {isSelf && isHideCities ? <ToggleOn /> : <ToggleOff />}
    //           </ToggleIcon>
    //         </ToggleContainer>
    //         <ExplainText>
    //           If you set your cities hide, only you can see cities where you've
    //           been before, otherwise only number of cities is shown.
    //         </ExplainText>
    //         <ToggleContainer>
    //           <ToggleText>HIDE COUNTRIES</ToggleText>
    //           <ToggleIcon onPress={() => onPressToggleIcon("HIDE_COUNTRIES")}>
    //             {isSelf && isHideCountries ? <ToggleOn /> : <ToggleOff />}
    //           </ToggleIcon>
    //         </ToggleContainer>
    //         <ExplainText>
    //           If you set your coutries hide, only you can see countries where
    //           you've been before, otherwise only number of countries is shown.
    //         </ExplainText>
    //         <ToggleContainer>
    //           <ToggleText>HIDE CONTINENTS</ToggleText>
    //           <ToggleIcon onPress={() => onPressToggleIcon("HIDE_CONTINENTS")}>
    //             {isSelf && isHideContinents ? <ToggleOn /> : <ToggleOff />}
    //           </ToggleIcon>
    //         </ToggleContainer>
    //         <ExplainText>
    //           If you set your coutries hide, only you can see countries where
    //           you've been before, otherwise only number of countries is shown.
    //         </ExplainText>
    //         <ToggleContainer>
    //           <ToggleText>AUTO LOCATION REPORT</ToggleText>
    //           <ToggleIcon
    //             onPress={() => onPressToggleIcon("AUTO_LOCATION_REPORT")}
    //           >
    //             {isSelf && isAutoLocationReport ? <ToggleOn /> : <ToggleOff />}
    //           </ToggleIcon>
    //         </ToggleContainer>
    //         <ExplainText>
    //           If you set auto location report off, the app cannot find where you
    //           are. Your lacation will be shown on your profile
    //         </ExplainText>
    //       </ToggleContainer>
    //     </View>
    //   )}
    // </>
    null
  );
};

export default EditProfile;
