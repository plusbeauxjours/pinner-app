import * as styledComponents from "styled-components";
import { ThemedStyledComponentsModule } from "styled-components";

interface IThemeInterface {
  headerColor: string;
  bgColor: string;
  lightModeBgColor: string;
  greyColor: string;
  blackColor: string;
  blueColor: string;
  boxBorder: string;
  randColor: string;
  whiteColor: string;
  darkBlueColor: string;
  modalOverlayColor: string;
  borderColor: string;
  modalBgColor: string;
  trackShadowColor: string;
  thumbShadowColor: string;
  hoverColor: string;
  color: string;
  iconColor: string;
  earth: string;
  shadowColor: string;
  mapTheme: any;
}

const {
  default: styled,
  css,
  ThemeProvider
} = styledComponents as ThemedStyledComponentsModule<IThemeInterface>;

export { css, ThemeProvider };
export default styled;
