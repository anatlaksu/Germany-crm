/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useState, useContext, useMemo } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Sidenav from "./components/global/Sidenav";
import Topbar from "./components/global/Topbar";
import Dashboard from "./pages/dashboard/index";
import DashboardDB from "./pages/dashboard/indexDB";
import SignUp from "./pages/sign-up";
import Team from "./pages/team";
import TeamAll from "./pages/team/indexAll";
import SignIn from "./pages/sign-in";
import { ColorModeContext, useMode } from "./theme";
import { isAuthenticated, updateRefreshCount } from "./auth";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const { user } = isAuthenticated();

  // const RedirectToSignIn = () => {
  //   return isAuthenticated ? (
  //     <Navigate to="/report" />
  //   ) : (
  //     <Navigate to="/sign-in" />
  //   );
  // };

  useMemo(() => {
    if (localStorage.getItem("RefreshCount") == "1") {
      const count = parseInt(localStorage.getItem("RefreshCount"), 10) + 1;
      updateRefreshCount(count);
      // eslint-disable-next-line no-self-assign
      window.location.href = window.location.href;
    }
  }, [localStorage.getItem("RefreshCount")]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {user !== undefined && <Sidenav />}
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            {user !== undefined ? (
              <Routes>
                <Route path="/report" element={<Dashboard />} />
                <Route path="/report">
                  <Route path=":id" element={<DashboardDB />} />
                </Route>
                <Route path="/reporttable" element={<Team />} />
                <Route path="/allreporttable" element={<TeamAll />} />
                <Route path="/" element={<Navigate to="/report" />} />
                <Route path="*" element={<Navigate to="/report" />} />
              </Routes>
            ) : (
              <Routes>
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/" element={<Navigate to="/sign-in" />} />
                <Route path="*" element={<Navigate to="/sign-in" />} />
              </Routes>
            )}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
