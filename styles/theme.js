import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: red[800],
    },
    secondary: {
      // main: "#e1c19a",
      main: "#fff",
    },

    typography: {
      // htmlFontSize: 20,
      fontFamily: "Nunito",
      fontWeightLight: 400,
      fontWeightRegular: 500,
      fontWeightMedium: 600,
    },
  },
});

export default theme;
