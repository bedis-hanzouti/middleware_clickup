const express = require("express");
const route = express.Router();
const folderController = require("../controllers/folderController");

const api_url = process.env.API_CLICKUP;
const token = process.env.TOKEN_CLICKUP;

route.get("/:spaceId/spaceLists", async (req, res) => {
  try {
    const spaceId = req.params.spaceId;
    const spaceLists = await folderController.getFoldersBySpace(
      "api_url",
      token,
      spaceId
    );
    res.json(spaceLists);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

route.get("/", folderController.getFolders);

module.exports = route;
