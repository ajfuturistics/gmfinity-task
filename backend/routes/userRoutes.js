const express = require("express");
const { getUser, createUser } = require("../controllers/userController");

const router = express.Router();

router.route("/").post(getUser);
router.route("/register").post(createUser);

module.exports = router;
