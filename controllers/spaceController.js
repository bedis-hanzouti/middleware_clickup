const axios = require("axios");
const Space = require("../models/spaceSchema");
const User = require("../models/userSchema");

async function getSpaceLists(apiUrl, token, workspaceId) {
  try {
    await Space.deleteMany();
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
      const listIds = [];
      if (space.members) {
        for (const member of space.members) {
          let user = await User.findOne({ id: member.user.id });
          if (!user) {
            user = new User(member.user);
            await user.save();
          }
          listIds.push(user._id);
        }
      }

      let existingSpace = await Space.findOne({ id: space.id });

      if (existingSpace) {
        existingSpace.set({
          ...space,
          members: listIds,
        });
        await existingSpace.save();
      } else {
        space.members = listIds;
        existingSpace = new Space(space);
        await existingSpace.save();
      }
    }

    const response = {
      message: "Spaces saved successfully",
      status: 200,
      count: spaces.length,
    };

    return response;
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
