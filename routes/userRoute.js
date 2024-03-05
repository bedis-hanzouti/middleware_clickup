const express = require("express");
const route = express.Router();
const userController = require("../controllers/userController");

const api_url = process.env.API_CLICKUP;
const token = process.env.TOKEN_CLICKUP;

route.get("/:listId/userList", async (req, res) => {
  try {
    const listId = req.params.listId;
    const userLists = await userController.getUserLists(api_url, token, listId);
    res.json(userLists);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = route;
