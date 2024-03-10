const axios = require("axios");
const Space = require("../models/spaceSchema");
const User = require("../models/userSchema");

async function getSpaceLists(apiUrl, token, workspaceId) {
  try {
    // await Space.deleteMany();
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
      existingSpace = new Space(space);
      await existingSpace.save();
    }

    const response = {
      message: "Spaces saved successfully",
      status: 200,
      count: spaces.length,
      data: spaces,
    };

    return spaces;
  } catch (error) {
    console.error("Error fetching space lists:", error);
    throw error;
  }
}

async function getSpaces(req, res) {
  try {
    const spaces = await Space.find().populate("members");
    if (!spaces || spaces.length === 0) {
      return res.status(404).json({ error: "Spaces not found" });
    }
    res.json(spaces);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = { getSpaces, getSpaceLists };
