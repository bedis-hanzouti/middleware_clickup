// clickUpController.js

const axios = require("axios");

async function getFolderLists(apiUrl, token, spaceId) {
  try {
    const folderListsResponse = await axios.get(
      `${apiUrl}/space/${spaceId}/folder`,
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

async function getFolderLessLists(apiUrl, token, spaceId) {
  try {
    const folderListsResponse = await axios.get(
      `https://api.clickup.com/api/v2/space/${spaceId}/list`,
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

// Export des fonctions pour les rendre accessibles depuis d'autres fichiers
module.exports = { getFolderLists, getFolderLessLists };
