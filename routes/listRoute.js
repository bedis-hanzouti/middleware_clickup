const express = require("express");
const route = express.Router();
const listController = require("../controllers/listController");

const api_url = process.env.API_CLICKUP;
const token = process.env.TOKEN_CLICKUP;

route.get("/:space_id/lists", async (req, res) => {
  try {
    const space_id = req.params.space_id;
    const folderLists = await listController.getListsOutFolders(
      api_url,
      token,
      space_id
    );
    res.json(folderLists);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

route.get("/:folderId/folderLists", async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const folderLists = await listController.ge(api_url, token, folderId);
    res.json(folderLists);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

route.get("/", listController.getLists);

module.exports = route;
