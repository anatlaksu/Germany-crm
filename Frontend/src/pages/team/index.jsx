import {
  Box,
  Button,
  Icon,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { isAuthenticated, authenticate } from "../../auth";
const { user } = isAuthenticated();

const Team = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const colors = tokens(theme.palette.mode);
  const columns = [
    {
      field: "id",
      headerName: "id",
      flex: 1,
    },

    {
      field: "date",
      headerName: "date",
      flex: 1,
    },
    { field: "time_enter", headerName: "time_enter" },
    {
      field: "time_exit",
      headerName: "time_exit",
      flex: 1,
    },
    {
      field: "update",
      headerName: "update",
      flex: 1,
      renderCell: (params) => params.value,
    },
  ];

  const dbRows = data.map((dt, index) => ({
    id: dt._id,
    date: dt.date.split("T")[0],
    time_enter: dt.time_enter,
    time_exit: dt.time_exit,
    update: (
      <Box>
        <Link to={`/report/${dt._id}`} key={dt._id}>
          <Button variant="gradient" size="medium">
            <ModeEditIcon />
          </Button>
        </Link>
      </Box>
    ),
  }));

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/report/findbyid/${user?.index}`)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Box m="20px">
      <Header subtitle="Managing your report" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid rows={dbRows} columns={columns} />
      </Box>
    </Box>
  );
};

export default Team;
