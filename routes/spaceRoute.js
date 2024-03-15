const express = require("express");
const route = express.Router();
const spaceController = require("../controllers/spaceController");

const api_url = process.env.API_CLICKUP;
const token = process.env.TOKEN_CLICKUP;

route.get("/", spaceController.getSpaces);
route.get("/:is", spaceController.getSpaceById);

module.exports = route;
