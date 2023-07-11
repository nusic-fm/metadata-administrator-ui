import { createTheme, responsiveFontSizes } from "@mui/material";
import WebFont from "webfontloader";

WebFont.load({
    google: {
      families: ["Space Mono", "Roboto"],
    },
  });

const themeSettings = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#563FC8",
        light: "#000000",
      },
      secondary: {
        main: "#ffffff",
      },
      info: {
        main: "#A794FF",
      },
      background: { paper: "#000" },
    },
    typography: {
      allVariants: {
        color: "#fff",
      },
      fontFamily: `Space Mono , sans-serif`,
    },
  });
  const theme = responsiveFontSizes(themeSettings);

  export default theme;