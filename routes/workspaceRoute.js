const express = require("express");
const route = express.Router();
const workspaceController = require("../controllers/workspaceController");

const api_url = process.env.API_CLICKUP;
const token = process.env.TOKEN_CLICKUP;

route.get("", async (req, res) => {
  try {
    await workspaceController.GenarateDataBaseFromClickup(api_url, token, res);
  } catch (error) {
    console.error("Error in /projects route:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = route;
