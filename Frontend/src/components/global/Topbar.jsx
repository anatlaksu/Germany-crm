/* eslint-disable no-self-assign */
import { Box, Icon, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import { isAuthenticated, signout } from "../../auth";
import LogoutIcon from "@mui/icons-material/Logout";
import { Navigate } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const { user } = isAuthenticated();

  const Signout = () => {
    signout();
    window.location.href = window.location.href;
    return <Navigate to="/" />;
  };

  return (
    <Box display="flex" justifyContent="flex-end" p={2}>
      <Box display="flex">
        {user ? (
          <IconButton
            size="small"
            color="inherit"
            aria-controls="notification-menu"
            aria-haspopup="true"
            variant="contained"
            onClick={Signout}
          >
            <LogoutIcon />
            <p>sign out</p>
          </IconButton>
        ) : null}
      </Box>
    </Box>
  );
};

export default Topbar;
