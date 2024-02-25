const axios = require("axios");

const Project = require("../models/projectSchema");

async function fetchAndSaveData(apiUrl, token, response) {
  try {
    const projectsResponse = await axios.get(apiUrl, {
      headers: {
        Authorization: token,
      },
    });
    const projects = projectsResponse.data.teams;

    const projectsWithDetails = await Promise.all(
      projects.map(async (project) => {
        const listsResponse = await axios.get(`${apiUrl}/${project.id}/list`, {
          headers: {
            Authorization: token,
          },
        });
        const lists = listsResponse.data.lists;

        const obj = { ...project, lists };
        return obj;
      })
    );

    await Project.deleteMany();
    await Project.insertMany(projectsWithDetails);
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
