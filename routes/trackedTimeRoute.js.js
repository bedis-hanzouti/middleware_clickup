const express = require("express");
const route = express.Router();
const trackedTimeController = require("../controllers/trackedTimeController");

const api_url = process.env.API_CLICKUP;
const token = process.env.TOKEN_CLICKUP;

route.get("/:trackedTimeId", trackedTimeController.getTrackedTimeById);
route.get("/", trackedTimeController.getAllTrackedTime);
route.get("/:id/user", trackedTimeController.getTrackedTimesByUsers);

module.exports = route;
