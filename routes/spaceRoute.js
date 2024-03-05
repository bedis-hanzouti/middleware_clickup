const express = require("express");
const route = express.Router();
const spaceController = require("../controllers/spaceController");

const api_url = process.env.API_CLICKUP;
const token = process.env.TOKEN_CLICKUP;

route.get("/:workspaceId/spaceLists", async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const spaceLists = await spaceController.getSpaceLists(
      api_url,
      token,
      workspaceId
    );
    res.json(spaceLists);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = route;
