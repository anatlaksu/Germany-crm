/* eslint-disable no-self-assign */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  Dialog,
  Input,
  DialogContent,
  Card,
} from "@mui/material";
import { tokens } from "../../theme";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { authenticate, updateRefreshCount } from "../../auth";

const signIn = () => {
  const [signInData, setSignInData] = useState({
    userName: "",
    password: "",

    errortype: "",
    error: false,
    successmsg: false,
    loading: false,
    NavigateToReferrer: false,
  });

  function handleChange(evt) {
    const { value } = evt.target;
    setSignInData({ ...signInData, [evt.target.name]: value });
  }

  const handleCloseSuccsecModal = () => {
    setSignInData({
      ...signInData,
      loading: false,
      error: false,
      successmsg: false,
      NavigateToReferrer: true,
    });
  };

  const handleCloseLoadingModal = () => {
    setSignInData({ ...signInData, loading: false });
  };
  const handleCloseErrorModal = () => {
    setSignInData({
      ...signInData,
      loading: false,
      error: false,
      successmsg: false,
      NavigateToReferrer: false,
    });
  };

  function NavigateUser() {
    if (signInData.NavigateToReferrer) {
      window.location.href = window.location.href;
      return <Navigate to="/report" />;
    }
  }

  const showSuccess = () => (
    <Dialog
      open={signInData.successmsg}
      onClose={handleCloseSuccsecModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box
        variant="gradient"
        borderRadius="l"
        // mx={2}
        // mt={2}
        p={3}
        // mb={2}
        textAlign="center"
      >
        <Typography variant="h4" fontWeight="medium" mt={1} mb={2}>
          You have successfully connected to the system{" "}
        </Typography>
        <Button onClick={handleCloseSuccsecModal} className="signinbutton">
          enter to the site
        </Button>
      </Box>
    </Dialog>
  );

  const showError = () => (
    <Dialog
      open={signInData.error}
      onClose={handleCloseErrorModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box
        variant="gradient"
        bgColor="error"
        coloredShadow="error"
        borderRadius="l"
        // mx={2}
        // mt={2}
        p={3}
        // mb={2}
        textAlign="center"
      >
        <Typography variant="h4" fontWeight="medium" mt={1} mb={2}>
          Login error
        </Typography>
        <Typography variant="h6" fontWeight="medium" mt={1}>
          {signInData.errortype}
        </Typography>

        <DialogContent>
          <Button onClick={handleCloseErrorModal} className="signinbutton">
            close
          </Button>
        </DialogContent>
      </Box>
    </Dialog>
  );
  const showLoading = () => (
    <Dialog
      open={signInData.loading}
      onClose={handleCloseLoadingModal}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box
        variant="gradient"
        borderRadius="l"
        // mx={2}
        // mt={2}
        p={3}
        px={5}
        // mb={2}
        textAlign="center"
      >
        <Typography variant="h1" fontWeight="medium" color="white" mt={1}>
          loading
        </Typography>

        <DialogContent>
          <Typography variant="h5" fontWeight="medium" color="white" mt={1}>
            Login will take a few moments...
          </Typography>
        </DialogContent>
      </Box>
    </Dialog>
  );

  const CheckSignInForm = (event) => {
    event.preventDefault();
    let flag = true;
    const ErrorReason = [];

    if (signInData.userName === "") {
      flag = false;
      ErrorReason.push("Please enter a username");
    }
    if (signInData.password === "") {
      flag = false;
      ErrorReason.push("Please enter a password");
    }

    if (flag !== true) {
      ErrorReason.forEach((reason) => {
        toast.error(reason);
        return false;
      });
    } else {
      return true;
    }
  };

  const SendFormData = async (event) => {
    event.preventDefault();
    setSignInData({
      ...signInData,
      loading: true,
      successmsg: false,
      error: false,
    });
    const { userName, password } = signInData;
    await axios
      .post(`http://localhost:5000/api/auth/signin`, { userName })
      .then((res) => {
        // console.log(res.data.user);
        if (res.data.user === "DoNotExist" || res.data.user === undefined) {
          setSignInData({
            ...signInData,
            errortype: "The user does not exist, you must register",
            loading: false,
            successmsg: false,
            error: true,
          });
        } else if (res.data.user.password !== signInData.password) {
          setSignInData({
            ...signInData,
            errortype: "The password or user name is incorrect",
            loading: false,
            successmsg: false,
            error: true,
          });
        } else {
          authenticate(res.data);
          setSignInData({
            ...signInData,
            loading: false,
            successmsg: true,
            error: false,
          });
          const count = parseInt(localStorage.getItem("RefreshCount"), 10) + 1;
          updateRefreshCount(count);
        }
      })
      .catch((error) => {
        console.log(error);
        setSignInData({
          ...signInData,
          errortype: "There is a server error, please try again later",
          loading: false,
          successmsg: false,
          error: true,
        });
      });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (CheckSignInForm(event)) {
      SendFormData(event);
    }
  };

  const singInUser = () => (
    <Card className="signin-card">
      <Box
        className="signin-header"
        bgcolor="info.main"
        borderRadius="8px 8px 0 0"
        p={3}
        textAlign="center"
      >
        <Typography variant="h4" fontWeight="medium" mt={1}>
          Sign In
        </Typography>
      </Box>

      <Box pt={4} pb={3} px={3} className="signin-form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="userName">User Name:</label>
            <Input
              required
              type="text"
              id="userName"
              name="userName"
              value={signInData.userName}
              onChange={handleChange}
              fullWidth
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <Input
              required
              type="password"
              id="password"
              name="password"
              value={signInData.password}
              onChange={handleChange}
              fullWidth
            />
          </div>

          <Button type="submit" className="signinbutton" fullWidth>
            Sign In
          </Button>
        </form>
      </Box>
      <Box textAlign="center">
        <Typography variant="button" color="text">
          Not registered yet?{" "}
          <Link to="/sign-up" variant="button" fontWeight="medium" textGradient>
            Click here
          </Link>
        </Typography>
      </Box>
    </Card>
  );

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {showError()}
      {showSuccess()}
      {showLoading()}
      {NavigateUser()}

      {singInUser()}
    </>
  );
};

export default signIn;
