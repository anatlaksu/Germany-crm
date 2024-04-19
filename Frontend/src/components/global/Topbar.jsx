/* eslint-disable no-self-assign */
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Box, Icon, IconButton, useTheme } from "@mui/material";
import InputBase from "@mui/material/InputBase";
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
      {/* ICONS */}
      <Box display="flex">
        {user ? (
          <IconButton
            size="small"
            // disableRipple
            color="inherit"
            aria-controls="notification-menu"
            aria-haspopup="true"
            variant="contained"
            onClick={Signout}
          >
            <LogoutIcon />
          </IconButton>
        ) : null}
      </Box>
    </Box>
  );
};

export default Topbar;
