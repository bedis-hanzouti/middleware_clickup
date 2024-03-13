const axios = require("axios");
const Space = require("../models/spaceSchema");
const { fetchAndSaveFolders } = require("./FolderController");
const apiUrl = process.env.API_CLICKUP;

async function getSpaces(req, res) {
  try {
    const spaces = await Space.find().populate("members");
    if (!spaces || spaces.length === 0) {
      return res.status(404).json({ error: "Spaces not found" });
    }
    res.json(spaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = { getSpaces };
