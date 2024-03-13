const axios = require("axios");
const List = require("../models/listSchema");
const Space = require("../models/spaceSchema");
const Folder = require("../models/folderSchema");
const apiUrl = process.env.API_CLICKUP;

async function getLists(req, res) {
  try {
    const task = await List.find().populate("space");
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = {
  getLists,
};
