const express = require("express");
const route = express.Router();
const listController = require("../controllers/listController");

const api_url = process.env.API_CLICKUP;
const token = process.env.TOKEN_CLICKUP;

route.get("/:spaceId/folderLists", async (req, res) => {
  try {
    const spaceId = req.params.spaceId;
    const folderLists = await listController.getFolderLists(
      api_url,
      token,
      spaceId
    );
    res.json(folderLists);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

route.get("/api/space/:spaceId/folderLessLists", async (req, res) => {
  try {
    const spaceId = req.params.spaceId;
    const folderLists = await listController.ge(api_url, token, spaceId);
    res.json(folderLists);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = route;
