const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Define routes for user management
const userRoutes = require("./routes/authentication/users");
app.use("/api/users", userRoutes);

const authRoutes = require("./routes/authentication/auth");
app.use("/api/auth", authRoutes);

const reportRoutes = require("./routes/report/report");
app.use("/api/report", reportRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});