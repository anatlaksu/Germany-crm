
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

// Function to get user by ID
exports.getuserbyid = (req, res) => {
    const users = readData();
    const user = users.find(user => user.id === req.body.userid);
    if (!user) {
        return res.status(400).json({ error: "משתמש לא נמצא" });
    }
    res.send(user);
};

// Function to get user by personal number
exports.getuserbypersonalnumber = (req, res) => {
    const users = readData();
    const user = users.find(user => user.personalnumber === req.params.personalnumber);
    if (!user) {
        return res.status(400).json({ error: "משתמש לא נמצא" });
    }
    res.send(user);
};

// Function to find all users
exports.find = (req, res) => {
    const users = readData();
    res.json(users);
};

// Function to update user by ID
exports.update = (req, res) => {
    const users = readData();
    const { id } = req.params;
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
        return res.status(400).json({ error: "משתמש לא נמצא" });
    }
    users[index] = { ...users[index], ...req.body };
    writeData(users);
    res.status(200).send({ message: "המשתמש עודכן בהצלחה" });
};

// Function to remove user by ID
exports.remove = (req, res) => {
    const users = readData();
    const { userId } = req.params;
    const filteredUsers = users.filter(user => user.id !== userId);
    if (filteredUsers.length === users.length) {
        return res.status(400).json({ error: "משתמש לא נמצא" });
    }
    writeData(filteredUsers);
    res.status(200).send({ message: "המשתמש נמחק בהצלחה" });
};