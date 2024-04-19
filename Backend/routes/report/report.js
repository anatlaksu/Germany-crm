const express = require("express");
const router = express.Router();
const {
  create,
  find,
  read,
  update,
  remove,
  findById
} = require("../../controllers/report/report.js");

// find spec
router.put("/remove/:id", remove);
router.get("/find/:id", read);
router.post("/create", create);
router.get("/findbyid/:id", findById);

router.post("/update/:id", update);

router.get("/find", find);

module.exports = router;
