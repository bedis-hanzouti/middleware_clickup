const axios = require("axios");
const mongoose = require("mongoose");
// const List = require("../../models/listSchema");:
const DataSchema = new mongoose.Schema({}, { strict: false });
const Test = mongoose.model("Data", DataSchema);
const List = mongoose.model("Lists", DataSchema);
const Workspace = mongoose.model("Workspace", DataSchema);
async function fetchAndSaveData(apiUrl, token, response) {
  try {
    const projectsResponse = await axios.get(apiUrl, {
      headers: {
        Authorization: token,
      },
    });
    const workspaces = projectsResponse.data.teams;
    console.log();
    await Workspace.deleteMany();
    await Workspace.create(workspaces);

    const projectsWithDetails = await Promise.all(
      workspaces.map(async (workspace) => {
        const listsResponse = await axios.get(
          `${apiUrl}/${workspace.id}/list`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const lists = listsResponse.data.lists;

        await List.deleteMany();
        await List.insertMany(lists);

        const obj = { ...workspace, lists };
        return obj;
      })
    );

    // return;

    await Test.deleteMany();
    await Test.insertMany(projectsWithDetails);
    console.log("Project data successfully saved in the database.");

    if (response) {
      response.json({ success: projectsWithDetails });
    }
  } catch (error) {
    console.error("Error fetching or saving project data:", error);
    if (response) {
      response.status(500).json({
        error:
          "An error occurred while fetching or saving project data. Please check the logs for more details.",
      });
    }
  }
}

module.exports = { fetchAndSaveData };
