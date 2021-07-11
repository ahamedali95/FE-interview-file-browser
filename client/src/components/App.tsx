import React, {FunctionComponent} from "react";

import {createTheme, ThemeOptions, ThemeProvider} from "@material-ui/core/styles";
import type {Theme} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";

import DescriptionIcon from "@material-ui/icons/Description";

import DataGrid from "./DataGrid"
import "../styles/App.css";

const useAppStyles: CallableFunction = makeStyles((theme: Theme) => ({
  appName: {
    textShadow: "1px 1px 1px #fff, 2px 2px 1px #fff",
    fontSize: "1.6rem",
    marginLeft: theme.spacing(1)
  },
  logo: {
    fontSize: "1.8em"
  }
}));

const App: FunctionComponent = () => {
  const classes = useAppStyles();
  // Added Redux doc inspired color schemes
  // We can still add more configurations to our theme.
  // Possibilities: dark theme color schemes, responsive typography, provide overrides for our
  // components that controls the appearance i.e., button ripple effect can be turned off throughout
  // the application. In real-world applications, our configurations will
  // dictated by the UX specs from the design team.
  const theme: ThemeOptions = createTheme({
    palette: {
      primary: {
        main: "#6d1cac"
      },
      secondary: {
        main: "#7431ca"
      }
    },
    props: {
      MuiButtonBase: {
        disableRipple: true
      }
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Paper>
        <Box
          component="main"
          className="App-main"
          p={2}
          mt={6}
          mx="auto"
          maxWidth={1200}
        >
          <AppBar>
            <Toolbar>
              {/* Ideally, official application logo belongs here*/}
              <DescriptionIcon className={classes.logo} />
              <Typography
                className={classes.appName}
                variant="h6"
              >
                File Browser
              </Typography>
            </Toolbar>
          </AppBar>
          <DataGrid />
        </Box>
      </Paper>
    </ThemeProvider>
  );
};

export default App;
