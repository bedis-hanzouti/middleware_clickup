const axios = require("axios");
const Space = require("../models/spaceSchema");
const { fetchAndSaveFolders } = require("./folderController");
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

async function getSpaceById(req, res) {
  try {
    const id = req.params.id;
    const spaces = await Space.findById(id).populate("members");
    if (!spaces || spaces.length === 0) {
      return res.status(404).json({ error: "Spaces not found" });
    }
    res.json(spaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = { getSpaces, getSpaceById };
