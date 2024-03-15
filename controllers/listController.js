const axios = require("axios");
const List = require("../models/listSchema");
const Space = require("../models/spaceSchema");
const Folder = require("../models/folderSchema");
const apiUrl = process.env.API_CLICKUP;

async function getLists(req, res) {
  try {
    const list = await List.find().populate("space");
    if (!list) {
      return res.status(404).json({ error: "list not found" });
    }
    res.json(list);
  } catch (error) {
    console.error("Error fetching list :", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function getListByid(req, res) {
  try {
    const id = req.params.id;
    const list = await List.findById(id).populate("space");
    if (!list) {
      return res.status(404).json({ error: "list not found" });
    }
    res.json(list);
  } catch (error) {
    console.error("Error fetching list by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
async function getlistsBySpace(req, res) {
  try {
    const spaceId = req.params.id;
    const lists = await List.find().populate("space");
    let filteredLists = [];

    for (const list of lists) {
      if (list.space && list.space._id == spaceId) {
        filteredLists.push(list);
      }
    }

    if (filteredLists.length === 0) {
      return res
        .status(404)
        .json({ error: "No lists found for the provided space ID" });
    }

    res.json(filteredLists);
  } catch (error) {
    console.error("Error in getListsBySpace:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getListsByAssignees(req, res) {
  try {
    const assigneeId = req.params.id;
    let filteredLists = [];

    const lists = await List.find();
    for (const list of lists) {
      if (list.assignees && list.assignees == assigneeId) {
        filteredLists.push(list);
      }
    }

    res.json(filteredLists);
  } catch (error) {
    console.error("Error fetching lists by assignee:", error);
    res.status(500).json({ error: error });
  }
}
module.exports = {
  getLists,
  getlistsBySpace,
  getListsByAssignees,
  getListByid,
};
