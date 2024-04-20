/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useParams } from "react-router-dom";
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
  Grid,
} from "@mui/material";
import { tokens } from "../../theme";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { isAuthenticated, authenticate } from "../../auth";
const { user } = isAuthenticated();

const DashboardDB = () => {
  const params = useParams();

  const [time, setTime] = useState(null);
  const [date, setDate] = useState(null);

  const [reportData, setReportData] = useState({});

  const [data, setData] = useState({
    errortype: "",
    error: false,
    successmsg: false,
    loading: false,
    NavigateToReferrer: false,
  });

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await axios.get(
          "https://worldtimeapi.org/api/timezone/Europe/Berlin"
        );
        // console.log(response.data.datetime);
        // console.log(response.data.datetime.split('T')[1].slice(0, 5));
        setTime(response.data.datetime.split("T")[1].slice(0, 8));
        setDate(response.data.datetime.split("T")[0]);
      } catch (error) {
        console.error("Error fetching time:", error);
      }
    };

    fetchTime();
    const intervalId = setInterval(fetchTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/report/find/${params.id}`)
      .then((response) => {
        console.log(response.data);
        setReportData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleChange(evt) {
    const { value } = evt.target;
    setReportData({ ...reportData, [evt.target.name]: value });
  }

  const CheckFormData = (event) => {
    event.preventDefault();
    let flag = true;
    const ErrorReason = [];

    if (reportData.time_enter === "") {
      flag = false;
      ErrorReason.push("Please enter an entry time");
    }
    if (reportData.time_exit === "") {
      flag = false;
      ErrorReason.push("Please enter an exit time");
    }

    if (reportData.time_enter > reportData.time_exit) {
      flag = false;
      ErrorReason.push("Exit time before entry time");
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
    setData({ ...data, loading: true, successmsg: false, error: false });
    const requestData = {
      userId: reportData.userId,
      time_enter: reportData.time_enter,
      time_exit: reportData.time_exit,
      userName: reportData.userName,
      userRole: reportData.userRole,
      date: reportData.date,
    };
    console.log(requestData);
    await axios
      .post(`http://localhost:5000/api/report/update/${params.id}`, requestData)
      .then((res) => {
        // console.log(res.data.user);
        setData({
          ...data,
          loading: false,
          error: false,
          successmsg: true,
          NavigateToReferrer: false,
        });
      })
      .catch((error) => {
        console.log(error);
        setData({
          ...data,
          errortype: error.response,
          loading: false,
          error: true,
          NavigateToReferrer: false,
        });
      });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (CheckFormData(event)) {
      SendFormData(event);
    }
  };

  const handleCloseSuccsecModal = () => {
    setData({
      ...data,
      loading: false,
      error: false,
      successmsg: false,
      NavigateToReferrer: true,
    });
  };
  const handleCloseLoadingModal = () => {
    setData({ ...data, loading: false });
  };
  const handleCloseErrorModal = () => {
    setData({
      ...data,
      loading: false,
      error: false,
      successmsg: false,
      NavigateToReferrer: false,
    });
  };
  const NavigateUser = () => {
    if (data.NavigateToReferrer) {
      return <Navigate to="/reporttable" />;
    }
  };

  const showSuccess = () => (
    <Dialog
      open={data.successmsg}
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
          the form has been update successfully{" "}
        </Typography>
        <Button onClick={handleCloseSuccsecModal} className="signUpButton">
          close
        </Button>
      </Box>
    </Dialog>
  );

  const showError = () => (
    <Dialog
      open={data.error}
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
          error
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
      open={data.loading}
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
            the sent will take a few moments...
          </Typography>
        </DialogContent>
      </Box>
    </Dialog>
  );

  const reportForm = () => (
    <>
    <Grid container spacing={0}>
      <Grid item xs={6}>
    <Card className="report-card">
      <Box
        className="report-header"
        bgcolor="info.main"
        borderRadius="8px 8px 0 0"
        p={3}
        textAlign="center"
      >
        <Typography variant="h4" fontWeight="medium" mt={1} style={{fontSize: 26}}>
          Report
        </Typography>
      </Box>

      <Box pt={4} pb={3} px={3} className="report-form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="time_enter" style={{fontSize: 20}}>entry time:</label>
            <Input
              required
              type="time"
              id="time_enter"
              name="time_enter"
              value={reportData.time_enter}
              onChange={handleChange}
              fullWidth
            />
          </div>

          <div className="form-group">
            <label htmlFor="time_exit" style={{fontSize: 20}}>exit time:</label>
            <Input
              required
              type="time"
              id="time_exit"
              name="time_exit"
              value={reportData.time_exit}
              onChange={handleChange}
              fullWidth
            />
          </div>

          <Button type="submit" className="reportbutton" fullWidth style={{fontSize: 20}}>
            update
          </Button>
        </form>
      </Box>
    </Card>
    </Grid>
    <Grid item xs={6}>
          <Card className="card-container">
            <h3>the date in germany:</h3>
            <h4>{date}</h4>
            <h3>the time in germany:</h3>
            <h4>{time}</h4>
          </Card>
        </Grid>

    </Grid>
    </>
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

      {reportForm()}
    </>
  );
};

export default DashboardDB;
