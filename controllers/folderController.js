const Folder = require("../models/folderSchema");

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
async function getFolderById(req, res) {
  try {
    const id = req.params.id;
    const folder = await Folder.findById(id).populate("space");
    if (!folder) {
      return res.status(400).json({ error: "Folder not found" });
    }
    res.json(folder);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
async function getFoldersBySpace(req, res) {
  try {
    const spaceId = req.params.spaceId;
    const folders = await Folder.find().populate("space");

    const filteredFolders = folders.filter((folder) => {
      return folder.space._id == spaceId;
    });

    if (!filteredFolders || filteredFolders.length === 0) {
      return res
        .status(404)
        .json({ error: "No folders found for the provided space ID" });
    }

    res.json(filteredFolders);
  } catch (error) {
    console.error("Error in getFoldersBySpace:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getFolders, getFoldersBySpace, getFolderById };
