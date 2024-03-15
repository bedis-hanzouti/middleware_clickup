const express = require("express");
const route = express.Router();
const listController = require("../controllers/listController");

const api_url = process.env.API_CLICKUP;
const token = process.env.TOKEN_CLICKUP;

route.get("/", listController.getLists);
route.get("/:id/space", listController.getlistsBySpace);
route.get("/:id", listController.getListByid);
route.get("/:id/user", listController.getListsByAssignees);

module.exports = route;
