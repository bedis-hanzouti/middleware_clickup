const axios = require("axios");
const mongoose = require("mongoose");
const DataSchema = new mongoose.Schema({}, { strict: false });
const Folder = mongoose.model("Folder", DataSchema);
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
    const folders = folderListsResponse.data;
    // console.log("folders", folders);
    await Folder.deleteMany();
    await Folder.insertMany(folders);
    return folders;
  } catch (error) {
    console.error("Error fetching space lists:", error);
    throw error;
  }
}
module.exports = { getFoldersBySpace };
