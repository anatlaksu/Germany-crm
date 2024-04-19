const fs = require("fs");

const fileName = "jsonDB/report.json";

// Function to read data from JSON file
function readData() {
  try {
    const data = fs.readFileSync(fileName);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function readData2() {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

// Function to write data to JSON file
function writeData(data) {
  fs.writeFileSync(fileName, JSON.stringify(data, null, 4));
}

exports.find = (req, res) => {
  const reports = readData();
  res.json(reports);
};

exports.findById = (req, res) => {
  readData2()
    .then((reports) => {
      console.log(reports);
      console.log("findby id");
      const index = req.params.id;
      const array = [];
      for (let i = 0; i < reports.length; i++) {
        const element = reports[i];
        console.log(element);
        if (element.userId == index) {
          array.push(element);
        }
      }
      console.log(array);

      res.json(array);
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    });
};
exports.read = async (req, res) => {
  const reports = readData();
  const report = reports.find((report) => report._id === req.params.id);
  if (!report) {
    return res.status(404).json({ error: "Report not found" });
  }
  res.json(report);
};

exports.create = (req, res) => {
  console.log("hello");
  console.log(req);
  const { userId, userName, userRole, date, time_enter, time_exit } = req.body;
  console.log(req.body);
  const reports = readData();
  const newReport = {
    _id: Date.now().toString(), // Generate a unique ID
    userId,
    userName,
    userRole,
    date,
    time_enter,
    time_exit,
  };

  reports.push(newReport);
  writeData(reports);
  res.json(newReport);
};

exports.update = (req, res) => {
  const { userId, userName, userRole, date, time_enter, time_exit } = req.body;
  const reports = readData();
  const index = reports.findIndex((report) => report._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Report not found" });
  }
  reports[index].userId = userId;
  reports[index].userName = userName;
  reports[index].userRole = userRole;
  reports[index].date = date;
  reports[index].time_enter = time_enter;
  reports[index].time_exit = time_exit;
  writeData(reports);
  res.json(reports[index]);
};

exports.remove = (req, res) => {
  const reports = readData();
  const index = reports.findIndex((report) => report._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Report not found" });
  }
  const deletedReport = reports.splice(index, 1)[0];
  writeData(reports);
  res.json(deletedReport);
};
