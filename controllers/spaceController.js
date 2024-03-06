const axios = require("axios");
const mongoose = require("mongoose");
const Space = require("../models/spaceSchema");

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

    for (const space of spaces) {
      const existingSpace = await Space.findOneAndUpdate(
        { id: space.id },
        space,
        { upsert: true, new: true }
      );
    }

    return spaces;
  } catch (error) {
    console.error("Error fetching space lists:", error);
    throw error;
  }
}

module.exports = { getSpaceLists };
