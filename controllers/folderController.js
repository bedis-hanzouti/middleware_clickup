const axios = require("axios");
const Folder = require("../models/folderSchema");
const User = require("../models/userSchema");
const Space = require("../models/spaceSchema");
const List = require("../models/listSchema");
const apiUrl = process.env.API_CLICKUP;

async function getFolders(req, res) {
  try {
    const folder = await Folder.find().populate("space");
    if (!folder) {
      return res.status(400).json({ error: "Folder not found" });
    }
    res.json(folder);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
module.exports = { getFolders };
