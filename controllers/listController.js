const axios = require("axios");
const List = require("../models/listSchema");
const Space = require("../models/spaceSchema");
const Folder = require("../models/folderSchema");
const apiUrl = process.env.API_CLICKUP;

async function getListsOutFolders(apiUrl, token, space_id) {
  try {
    // Retrieve local lists
    const localLists = await List.find();

    // Update local lists with corresponding folders
    for (const list of localLists) {
      const folder = await Folder.findOne({ id: list.folder });
      if (folder) {
        list.folder = folder._id;
        await list.save();
      }
    }

    // Fetch lists from the remote API
    const folderListsResponse = await axios.get(
      `https://api.clickup.com/api/v2/space/${space_id}/list`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const lists = folderListsResponse.data.lists;

    // Find or create lists in the local database
    let space = await Space.findOne({ id: space_id });
    for (const listData of lists) {
      let folder = await Folder.findOne({ id: listData.folder.id });

      const newListData = {
        ...listData,
        space: space._id ? space._id : null,
        folder: folder ? folder._id : null,
      };

      const newList = new List(newListData);
      await newList.save();
    }

    const response = {
      message: "Lists saved successfully",
      status: 200,
      count: lists.length,
    };

    return response;
  } catch (error) {
    console.error("Error fetching user lists:", error.message);
    throw error;
  }
}

async function fetchAndSaveLists(workspaceId, token) {
  const folderListsOutResponse = await axios.get(
    `${apiUrl}team/${workspaceId}/list`,
    { headers: { Authorization: token } }
  );
  const lists = folderListsOutResponse.data.lists;

  await Promise.all(
    lists.map(async (listData) => {
      let folder = await Folder.findOne({ id: listData.folder.id });
      let spaceFromLocal = await Space.findOne({ id: listData.space.id });

      const newList = await List.findOneAndUpdate(
        { id: listData.id },
        {
          ...listData,
          space: spaceFromLocal ? spaceFromLocal._id : null,
          folder: folder ? folder._id : null,
        },
        { upsert: true, new: true }
      );
    })
  );
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
module.exports = {
  getListsOutFolders,
  getListsInFolders,
  getLists,
  fetchAndSaveLists,
};
