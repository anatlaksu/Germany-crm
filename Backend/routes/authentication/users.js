const express = require("express");
const router = express.Router();
const {
  find,
  getuserbyid,
  getuserbypersonalnumber,
  update,
  remove,
} = require("../../controllers/authentication/user");

router.post("/getuserbyid", getuserbyid);
router.get("/getuserbypersonalnumber/:personalnumber", getuserbypersonalnumber);
router.get("/find", find);
router.put("/update/:id", update);
router.post("/remove/:userId", remove);

module.exports = router;