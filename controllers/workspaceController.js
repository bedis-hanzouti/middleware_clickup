const axios = require("axios");
const mongoose = require("mongoose");
const List = require("../models/listSchema");
const User = require("../models/userSchema");
const Role = require("../models/roleSchema");
const Space = require("../models/spaceSchema");
const Folder = require("../models/folderSchema");
const Workspace = require("../models/worksSchema");
const TrackedTime = require("../models/trakedTimeSchema");

const Task = require("../models/taskSchema");
const taskController = require("../controllers/taskController");
const listController = require("../controllers/listController");
const spaceController = require("../controllers/spaceController");
// const folderController = require("../controllers/folderController");
const trackedTimeController = require("../controllers/trackedTimeController");

async function GenarateDataBaseFromClickup(apiUrl, token, response) {
  try {
    await clearData();

    const workspaceResponse = await axios.get(apiUrl, {
      headers: { Authorization: token },
    });
    const workspaces = workspaceResponse.data.teams;

    // Sauvegarder les données des espaces de travail
    for (const workspace of workspaces) {
      let newWorkspace = new Workspace(workspace);
      await newWorkspace.save();

      // Sauvegarder les utilisateurs du workspace
      for (const newUser of workspace.members) {
        const memberId = newUser.user.id;
        let createUser = newUser.user;
        const rolname = createUser.role;

        let roleName = "";
        switch (rolname) {
          case 1:
            roleName = "admin";
            break;
          case 2:
            roleName = "user";
            break;
          case 3:
            roleName = "guest";
            break;
          case 4:
            roleName = "owner";
            break;
          default:
            roleName = "unknown"; // Rôle inconnu
        }

        let existingRole = await Role.findOne({ id: rolname });

        if (!existingRole) {
          existingRole = await Role.create({
            name: roleName,
            id: rolname,
          });
        }

        let inviterUser;

        if (newUser.invited_by) {
          const invitedId = newUser.invited_by.id;

          inviterUser = await User.findOne({ id: invitedId });

          if (!inviterUser) {
            inviterUser = await User.create(newUser.invited_by);
          }
        }

        // Enregistrement ou mise à jour de l'utilisateur
        const existUser = await User.findOneAndUpdate(
          { id: memberId },
          {
            ...createUser,
            invited_by: inviterUser ? inviterUser._id : null,
            role: existingRole._id,
          },
          {
            upsert: true,
            new: true,
          }
        );
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
        const trackedTimeResponse = await axios.get(
          `https://api.clickup.com/api/v2/task/${taskData.id}/time`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        const trackedTimees = trackedTimeResponse.data.data;

        for (const trackedData of trackedTimees) {
          if (trackedData.user) {
            const memberId = trackedData.user.id;
            let user = await User.findOne({ id: memberId });
            let task = await Task.findOne({ id: taskData.id });

            const newTask = new TrackedTime({
              ...trackedData,
              user: user._id,
              task: task._id,
            });

            await newTask.save();
          }
        }
      }
    }

    if (response) {
      console.log("Data processed successfully");
      const workspacesData = await Workspace.find();
      const usersData = await User.find();
      const spacesData = await Space.find();
      const foldersData = await Folder.find();
      const listsData = await List.find();
      const tasksData = await Task.find();
      const trackedTimesData = await TrackedTime.find();

      // response.json(trackedTimesData);
      response.json({
        success: "Data processed successfully.",
        workspaces: {
          count: workspacesData.length,
          data: workspacesData,
        },
        users: {
          count: usersData.length,
          data: usersData,
        },
        spaces: {
          count: spacesData.length,
          data: spacesData,
        },
        folders: {
          count: foldersData.length,
          data: foldersData,
        },
        lists: {
          count: listsData.length,
          data: listsData,
        },
        tasks: {
          count: tasksData.length,
          data: tasksData,
        },
        trackedTimes: {
          count: trackedTimesData.length,
          data: trackedTimesData,
        },
      });
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

async function clearData() {
  await Promise.all([
    Workspace.deleteMany(),
    User.deleteMany(),
    List.deleteMany(),
    TrackedTime.deleteMany(),
    Task.deleteMany(),
    Space.deleteMany(),
    Folder.deleteMany(),

    Role.deleteMany(),
  ]);
}

module.exports = { GenarateDataBaseFromClickup };
