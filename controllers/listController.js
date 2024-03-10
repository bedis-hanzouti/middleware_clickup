const axios = require("axios");
const List = require("../models/listSchema");
const Space = require("../models/spaceSchema");
const Folder = require("../models/folderSchema");

async function getListsOutFolders(apiUrl, token, space_id) {
  try {
    await List.deleteMany();
    const folderListsResponse = await axios.get(
      `https://api.clickup.com/api/v2/space/${space_id}/list`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const lists = folderListsResponse.data.lists;
    // console.log("space", space_id);
    // Récupérer l'objet Space correspondant à l'espace spécifié
    let space = await Space.findOne({ id: space_id });
    // console.log("space", space);
    if (!space) {
      space = new Space({ id: space_id });
      await space.save();
    }

    // Parcourir chaque liste et l'associer à l'espace
    for (const listData of lists) {
      const folderId = listData.folder.id;
      let folder = await Folder.findOne({ id: folderId });

      if (!folder) {
        // Si l'espace n'existe pas, le créer
        folder = new Folder(listData.folder);
        await folder.save();
      }
      const newList = new List({
        ...listData,
        space: space._id,
        folder: folder._id,
      });
      // console.log("newList", newList);

      await newList.save();
    }
    // await List.insertMany(newList);

    const response = {
      message: " lists saved successfully",
      status: 200,
      count: lists.length,
    };

    return response;
  } catch (error) {
    console.error("Error fetching user lists:", error.message);
    throw error;
  }
}

async function getListsInFolders(apiUrl, token, spaceId) {
  try {
    const folderListsResponse = await axios.get(
      `https://api.clickup.com/api/v2/folder/${folder_id}/list`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return folderListsResponse.data;
  } catch (error) {
    console.error("Error fetching folder lists:", error);
    throw error;
  }
}
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
module.exports = { getListsOutFolders, getListsInFolders, getLists };
