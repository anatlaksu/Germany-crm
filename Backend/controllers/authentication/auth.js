
const fs = require('fs');

const fileName = 'jsonDB/users.json';

// Function to read data from JSON file
function readData() {
    try {
        const data = fs.readFileSync(fileName);
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// Function to write data to JSON file
function writeData(data) {
    fs.writeFileSync(fileName, JSON.stringify(data, null, 4));
}


// Function to add a new user
function addUser(newUser) {
  let data = [];
  try {
      const jsonData = fs.readFileSync(fileName);
      data = JSON.parse(jsonData);
  } catch (error) {
  }

  data.push(newUser);

  fs.writeFileSync(fileName, JSON.stringify(data, null, 4));
}

// Function to find user by personal number
function getUserByUserName(userName) {
    const users = readData();
    return users.find(user => user.userName === userName);
}

exports.signup = (req, res) => {
    console.log(`The SignUp server function`);
    console.log("req.body", req.body);
    
    const newUser = req.body;
    addUser(newUser);

    res.json({
        user: newUser,
    });
};

exports.signin = (req, res) => {
    const { userName, password } = req.body;
    const user = getUserByUserName(userName);
  
    console.log(`The SignIn server function - UserName: ${userName}`);
    console.log(`The SignIn server function - user:`);
    console.log(user);

    if (!user || user === undefined) {
        return res.json({
            user: "DoNotExist",
        });
    }

    return res.json({ user });
};

exports.signout = (req, res) => {
    res.json({ message: "התנתקת בהצלחה" });
};

exports.isAuth = (req, res, next) => {
    next();
};

exports.isAdmin = (req, res, next) => {
    next();
};