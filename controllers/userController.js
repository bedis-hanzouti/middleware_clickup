const axios = require("axios");

const User = require("../models/userSchema");

async function getUserLists(apiUrl, token, list_id) {
  try {
    const userListsResponse = await axios.get(
      `https://api.clickup.com/api/v2/list/${list_id}/member`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const users = userListsResponse.data;
    await User.deleteMany();
    await User.insertMany(users);

    return users;
  } catch (error) {
    console.error("Error fetching space lists:", error);
    throw error;
  }
}
module.exports = { getUserLists };
