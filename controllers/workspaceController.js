const axios = require("axios");
const mongoose = require("mongoose");
const List = require("../models/listSchema");
const User = require("../models/userSchema");
const Space = require("../models/spaceSchema");
const Folder = require("../models/folderSchema");
const Workspace = require("../models/worksSchema");
const TrackedTime = require("../models/trakedTimeSchema");

const Task = require("../models/taskSchema");
const taskController = require("../controllers/taskController");
const listController = require("../controllers/listController");
const spaceController = require("../controllers/spaceController");
const folderController = require("../controllers/folderController");
const trackedTimeController = require("../controllers/trackedTimeController");
const DataSchema = new mongoose.Schema({}, { strict: false });
const Test = mongoose.model("Data", DataSchema);

async function fetchAndSaveData(apiUrl, token, response) {
  try {
    await clearData();
    // Récupérer les données des projets
    const projectsResponse = await axios.get(apiUrl, {
      headers: { Authorization: token },
    });
    const workspaces = projectsResponse.data.teams;

    // Sauvegarder les données des espaces de travail
    for (const workspace of workspaces) {
      let newWorkspace = new Workspace(workspace);
      await newWorkspace.save();

      // Sauvegarder les utilisateurs du workspace
      for (const newUser of workspace.members) {
        const memberId = newUser.user.id;
        let createUser = newUser.user;

        await User.findOneAndUpdate({ id: memberId }, createUser, {
          upsert: true,
          new: true,
        });
      }

      // Récupérer et sauvegarder les espaces et les dossiers
      const spaceListsResponse = await axios.get(
        `https://api.clickup.com/api/v2/team/${workspace.id}/space`,
        { headers: { Authorization: token } }
      );
      const spaces = spaceListsResponse.data.spaces;

      for (const space of spaces) {
        let newSpace = new Space(space);
        await newSpace.save();

        // Récupérer et sauvegarder les dossiers
        const folderListsResponse = await axios.get(
          `https://api.clickup.com/api/v2/space/${space.id}/folder`,
          { headers: { Authorization: token } }
        );
        const folders = folderListsResponse.data.folders;

        for (const folderData of folders) {
          const spaceId = folderData.space.id;

          let existSpace = await Space.findOne({ id: spaceId });
          let existFolder = await Folder.findOne({ id: spaceId });

          const listIds = [];
          for (const listData of folderData.lists) {
            let list = await List.findOneAndUpdate(
              { id: listData.id },
              {
                ...listData,
                space: existSpace._id,
                folder: existFolder ? existFolder._id : folderData.id,
              },
              { upsert: true, new: true }
            );
            listIds.push(list._id);
          }

          let existingFolder = await Folder.findOneAndUpdate(
            { id: folderData.id },
            {
              ...folderData,
              space: existSpace._id,
              lists: listIds,
            },
            { upsert: true, new: true }
          );
        }
      }

      // Récupérer et sauvegarder les listes sans dossier
      const folderListsOutResponse = await axios.get(
        `https://api.clickup.com/api/v2/team/${workspace.id}/list`,
        { headers: { Authorization: token } }
      );
      const lists = folderListsOutResponse.data.lists;

      for (const listData of lists) {
        let folder = await Folder.findOne({ id: listData.folder.id });
        let spaceFromLocal = await Space.findOne({ id: listData.space.id });

        const newList = await List.findOneAndUpdate(
          { id: listData.id },
          {
            ...listData,
            space: spaceFromLocal ? spaceFromLocal._id : null,
            folder: folder ? folder._id : null,
          },
          { upsert: true, new: true }
        );
      }

      // Récupérer et sauvegarder les tâches
      const tasksResponse = await axios.get(
        `https://api.clickup.com/api/v2/team/${workspace.id}/task`,
        { headers: { Authorization: token } }
      );
      const tasks = tasksResponse.data.tasks;

      for (const taskData of tasks) {
        let folder = await Folder.findOne({ id: taskData.folder.id });
        let list = await List.findOne({ id: taskData.list.id });
        let spaceFromLocalTwo = await Space.findOne({ id: taskData.space.id });

        let newTask = await Task.findOneAndUpdate(
          { id: taskData.id },
          {
            ...taskData,
            list: list ? list._id : null,
            folder: folder ? folder._id : null,
            space: spaceFromLocalTwo ? spaceFromLocalTwo._id : null,
          },
          { upsert: true, new: true }
        );

        if (taskData.assignees && taskData.assignees.length > 0) {
          const memberId = taskData.assignees[0].id;
          let user = await User.findOne({ id: memberId });

          if (user) {
            let newTask = await Task.findOneAndUpdate(
              { id: taskData.id },
              {
                ...taskData,
                assignees: [user._id],
              },
              { upsert: true, new: true }
            );
          }
        }
      }
    }

    if (response) {
      response.json({ success: "Data processed successfully." });
    }
  } catch (error) {
    console.error("Error processing data:", error);

    if (response) {
      response.status(500).json({
        error:
          "An error occurred while processing data. Please check the logs for more details.",
      });
    }
  }
}

async function fetchAndSaveData0(apiUrl, token, response) {
  try {
    await clearData();

    const projectsResponse = await axios.get(apiUrl, {
      headers: { Authorization: token },
    });
    const workspaces = projectsResponse.data.teams;

    let workspaceData = new Workspace(workspace);
    await workspaceData.save();

    await Workspace.insertMany(workspaces);
    console.log("Project data successfully saved in the database.");

    if (response) {
      response.json({ success: workspaces });
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
async function clearData() {
  await Promise.all([
    Workspace.deleteMany(),
    User.deleteMany(),
    List.deleteMany(),
    TrackedTime.deleteMany(),
    Task.deleteMany(),
    Space.deleteMany(),
    Folder.deleteMany(),
    Test.deleteMany(),
  ]);
}

module.exports = { fetchAndSaveData };
