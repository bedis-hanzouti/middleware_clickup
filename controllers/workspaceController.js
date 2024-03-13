const axios = require("axios");
const {
  List,
  User,
  Role,
  Space,
  Folder,
  Workspace,
  TrackedTime,
  Task,
  CustomField,
  Tracker,
} = require("../models");
const { clearData } = require("../config/dataBase/dropDB");
const api_url = process.env.API_CLICKUP;
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
        const roleId = createUser.role;
        const roleName = getRoleName(roleId);
        let existingRole = await Role.findOne({ id: roleId });
        if (!existingRole) {
          existingRole = await Role.create({
            name: roleName,
            id: roleId,
          });
        }
        const existUser = await User.findOneAndUpdate(
          { id: memberId },
          {
            ...createUser,
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
        `${api_url}team/${workspace.id}/space`,
        { headers: { Authorization: token } }
      );
      const spaces = spaceListsResponse.data.spaces;
      for (const space of spaces) {
        let newSpace = new Space(space);
        await newSpace.save();
        // Récupérer et sauvegarder les dossiers
        const folderListsResponse = await axios.get(
          `${api_url}space/${space.id}/folder`,
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
        `${api_url}team/${workspace.id}/list`,
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
        `${api_url}team/${workspace.id}/task`,
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
        if (taskData.custom_fields && taskData.custom_fields.length > 0) {
          for (const customField of taskData.custom_fields) {
            const existTask = await Task.findOne({ id: taskData.id });
            let existingCustomField = await CustomField.findOne({
              name: customField.name,
              value: customField.value,
            });
            if (!existingCustomField) {
              existingCustomField = await CustomField.create({
                ...customField,
                tasks: [existTask._id],
              });
            } else {
              if (!existingCustomField.tasks.includes(existTask._id)) {
                existingCustomField.tasks.push(existTask._id);
                await existingCustomField.save();
              }
            }
            if (customField.name === "Tracker") {
              let existTracker = await Tracker.findOne({ id: customField.id });
              if (!existTracker) {
                existTracker = await Tracker.create({
                  ...customField,
                  customField: existingCustomField._id,
                });
              }
            }
          }
        }
        const trackedTimeResponse = await axios.get(
          `${api_url}task/${taskData.id}/time`,
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
      console.log("\x1b[32mData saved successfully\x1b[0m");
      const workspacesData = await Workspace.find();
      const usersData = await User.find();
      const spacesData = await Space.find();
      const foldersData = await Folder.find();
      const listsData = await List.find();
      const tasksData = await Task.find();
      const trackedTimesData = await TrackedTime.find();
      const trackersData = await Tracker.find();
      const customFieldsData = await CustomField.find();
      response.json({
        success: "Data saved successfully.",
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
        customFields: {
          count: customFieldsData.length,
          data: customFieldsData,
        },
        trckers: {
          count: trackersData.length,
          data: trackersData,
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
function getRoleName(roleId) {
  switch (roleId) {
    case 1:
      return "Owner";
    case 2:
      return "Admin";
    case 3:
      return "Member";
    case 4:
      return "Guest";
    default:
      return "unknown"; // Rôle inconnu
  }
}
module.exports = { GenarateDataBaseFromClickup };
