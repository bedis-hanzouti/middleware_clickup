const axios = require("axios");
const mongoose = require("mongoose");
const DataSchema = new mongoose.Schema({}, { strict: false });
const Space = mongoose.model("Space", DataSchema);

async function getSpaceLists(apiUrl, token, workspaceId) {
  try {
    const spaceListsResponse = await axios.get(
      `https://api.clickup.com/api/v2/team/${workspaceId}/space`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const spaces = spaceListsResponse.data.spaces;
    await Space.deleteMany();
    await Space.insertMany(spaces);

    return spaces;
  } catch (error) {
    console.error("Error fetching space lists:", error);
    throw error;
  }
}
module.exports = { getSpaceLists };
