const axios = require("axios");
const Folder = require("../models/folderSchema");
const User = require("../models/userSchema");
const Space = require("../models/spaceSchema");
const List = require("../models/listSchema");

async function getFoldersBySpace(apiUrl, token, spaceId) {
  try {
    const folderListsResponse = await axios.get(
      `https://api.clickup.com/api/v2/space/${spaceId}/folder`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const folders = folderListsResponse.data.folders;

    for (const folderData of folders) {
      const spaceId = folderData.space.id;
      let space = await Space.findOne({ id: spaceId });

      // console.log(space);
      const listIds = [];

      for (const listData of folderData.lists) {
        let list = await List.findOne({ id: listData.id });

        if (!list) {
          list = new List({
            ...listData,
            space: space._id,
            folder: folderData.id,
          });
          await list.save();
        }

        listIds.push(list._id);
      }

      let existingFolder = await Folder.findOne({ id: folderData.id });

      if (existingFolder) {
        existingFolder.set({
          ...folderData,
          space: space._id,
          lists: listIds,
        });
        await existingFolder.save();
      } else {
        existingFolder = Folder.create({
          ...folderData,
          space: space._id,
          lists: listIds,
        });
        // await existingFolder.save();
      }
    }

    const response = {
      message: "Folders saved successfully",
      status: 200,
      count: folders.length,
    };

    return response; // Retourne la réponse globale après avoir parcouru toutes les dossiers
  } catch (error) {
    console.error("Error fetching folder lists:", error);
    throw error;
  }
}

async function getFolders(req, res) {
  try {
    const folder = await Folder.find();
    if (!folder) {
      return res.status(400).json({ error: "Folder not found" });
    }
    res.json(folder);
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
module.exports = { getFoldersBySpace, getFolders };
