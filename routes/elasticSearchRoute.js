const express = require("express");
const { createIndex } = require("../config/elasticsearch/config");

const router = express.Router();

router.route("/").put(createIndex);

module.exports = router;
