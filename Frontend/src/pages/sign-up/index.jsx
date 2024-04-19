/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import { Box, Button, IconButton, Typography, useTheme ,Dialog, Input,DialogContent,Card} from "@mui/material";
import { tokens } from "../../theme";
import axios from "axios";
import "./index.css";
import { updateRefreshCount } from "../../auth";

const signUp = () => {

    const[idx,setIndex]=useState();
    const [signUpData, setSignUpData] = useState({
        index:"",
        fullName: "",
        userName: "",
        admin: "1",
        password: "",
    
        errortype: "",
        error: false,
        successmsg: false,
        loading: false,
        NavigateToReferrer: false,
      });

      function handleChange(evt) {
        const { value } = evt.target;
        setSignUpData({ ...signUpData, [evt.target.name]: value });
      }
    
      const handleCloseSuccsecModal = () => {
        setSignUpData({
          ...signUpData,
          loading: false,
          error: false,
          successmsg: false,
          NavigateToReferrer: true,
        });
      };
    
      const handleCloseLoadingModal = () => {
        setSignUpData({ ...signUpData, loading: false });
      };
      const handleCloseErrorModal = () => {
        setSignUpData({
          ...signUpData,
          loading: false,
          error: false,
          successmsg: false,
          NavigateToReferrer: false,
        });
      };

      function NavigateUser() {
        if (signUpData.NavigateToReferrer) {
          return <Navigate to="/sign-in" />;
        }
      }
    
      const showSuccess = () => (
        <Dialog
          open={signUpData.successmsg}
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
              You have successfully registered in the system{" "}
            </Typography>
            <Button onClick={handleCloseSuccsecModal} className="signUpButton">
              close
            </Button>
          </Box>
        </Dialog>
      );

      const showError = () => (
        <Dialog
          open={signUpData.error}
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
              Registration error
            </Typography>
    
            <DialogContent>
              <Button onClick={handleCloseErrorModal} className="signUpButton">
                close
              </Button>
            </DialogContent>
          </Box>
        </Dialog>
      );
      const showLoading = () => (
        <Dialog
          open={signUpData.loading}
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
                Registration will take a few moments...
              </Typography>
            </DialogContent>
          </Box>
        </Dialog>
      );
    
      const CheckSignUpForm = (event) => {
        event.preventDefault();
        let flag = true;
        const ErrorReason = [];
    
        if (signUpData.password === "") {
          flag = false;
          ErrorReason.push("אנא הכנס סיסמא");
        }
        if (signUpData.fullName === "") {
          flag = false;
          ErrorReason.push("אנא הכנס שם ");
        }
        if (signUpData.userName === "") {
          flag = false;
          ErrorReason.push("אנא הכנס שם משתמש ");
        }
    
        if (flag !== true) {
          ErrorReason.forEach((reason) => {
            // toast.error(reason);
            // setData({ ...data, loading: false, successmsg: false, error: true });
          });
          return false;
        } else {
          return true;
          // setData({ ...data, loading: false, successmsg: true, error: false });
        }
      };

      const SendFormData = async (event) => {
        event.preventDefault();
        setSignUpData({ ...signUpData, loading: true, successmsg: false, error: false });
        const newUser = {
            index: idx,
          fullName: signUpData.fullName,
          userName: signUpData.userName,
          admin: signUpData.admin,
          password: signUpData.password,
        };
        await axios
          .post(`http://localhost:5000/api/auth/signup`, newUser)
          .then((res) => {
            setSignUpData({ ...signUpData, loading: false, error: false, successmsg: true });
            const count = parseInt(localStorage.getItem("RefreshCount"), 10) + 1;
            updateRefreshCount(count);
          })
          .catch((error) => {
            console.log(error);
            setSignUpData({ ...signUpData, loading: false, error: true, successmsg: false });
          });
      };
    
      const onSubmit = (event) => {
        event.preventDefault();
        if (CheckSignUpForm(event)) {
          SendFormData(event);
        }
      };

      useEffect(() => {
        axios
          .get(`http://localhost:5000/api/users/find`)
          .then((response) => {
            console.log(response.data.length);
            setIndex(response.data.length);
          })
          .catch((error) => {
            console.error(error);
          });
      }, []);
    

      const singUpUser = () => (
      <Card className="signup-card">
        <Box
          className="signup-header"
          bgcolor="info.main"
          borderRadius="8px 8px 0 0"
          p={3}
          textAlign="center"
        >
          <Typography variant="h4" fontWeight="medium" mt={1}>
            Sign Up
          </Typography>
        </Box>

        <Box pt={4} pb={3} px={3} className="signup-form">
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name:</label>
              <Input
                required
                type="text"
                id="fullName"
                name="fullName"
                value={signUpData.fullName}
                onChange={handleChange}
                fullWidth
              />
            </div>

            <div className="form-group">
              <label htmlFor="userName">User Name:</label>
              <Input
                required
                type="text"
                id="userName"
                name="userName"
                value={signUpData.userName}
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
                value={signUpData.password}
                onChange={handleChange}
                fullWidth
              />
            </div>

            <Button type="submit" className="signUpButton" fullWidth >
              Sign Up
            </Button>
          </form>
        </Box>
      </Card>
    );
    

  return (
    <>
    {showError()}
    {showSuccess()}
    {showLoading()}
    {NavigateUser()}

    {singUpUser()}
    </>
  );
};

export default signUp;
