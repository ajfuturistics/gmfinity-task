const express = require("express");
const { searchMovie } = require("../controllers/searchController");

const router = express.Router();

router.route("/").get(searchMovie);

module.exports = router;
