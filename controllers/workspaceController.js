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
const spaceController = require("../controllers/spaceController");
const folderController = require("../controllers/folderController");
const trackedTimeController = require("../controllers/trackedTimeController");
const DataSchema = new mongoose.Schema({}, { strict: false });
const Test = mongoose.model("Data", DataSchema);

async function fetchAndSaveData(apiUrl, token, response) {
  try {
    await clearData(); // Clear existing data

    const projectsResponse = await axios.get(apiUrl, {
      headers: { Authorization: token },
    });
    const workspaces = projectsResponse.data.teams;

    await Promise.all(
      workspaces.map(async (workspace) => {
        await processWorkspace(workspace, apiUrl, token);
      })
    );

    await Test.insertMany(workspaces);
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

async function processWorkspace(workspace, apiUrl, token) {
  await Promise.all(
    workspace.members.map(async (newUser) => {
      const memberId = newUser.user.id;
      let createUser = newUser.user;
      await User.findOneAndUpdate({ id: memberId }, createUser, {
        upsert: true,
        new: true,
      });
    })
  );

  const spacelist = await spaceController.getSpaceLists(
    apiUrl,
    token,
    workspace.id
  );
  await Promise.all(
    spacelist.map(async (spaceid) => {
      try {
        await processSpace(spaceid, token);
      } catch (error) {
        console.error("Error fetching folder lists:", error.message);
        throw error;
      }
    })
  );

  let workspaceData = new Workspace(workspace);
  await workspaceData.save();

  const taskList = await taskController.getAllTasksFromClickup(
    apiUrl,
    token,
    workspace.id
  );
  await Promise.all(
    taskList.map(async (space) => {
      await trackedTimeController.getAllTrackedTimeFromClickup(
        apiUrl,
        token,
        space.id
      );
    })
  );
}

async function processSpace(spaceid, token) {
  const folderListsResponse = await axios.get(
    `https://api.clickup.com/api/v2/space/${spaceid.id}/folder`,
    {
      headers: { Authorization: token },
    }
  );
  const folders = folderListsResponse.data.folders;
  for (const folder of folders) {
    await processFolder(folder);
    const folderListsResponseInFolder = await axios.get(
      `https://api.clickup.com/api/v2/folder/${folder.id}/list`,
      {
        headers: {
          Authorization: token,
        },
      }
    );

    const listsIn = folderListsResponseInFolder.data.lists;

    for (const listData of listsIn) {
      await processList(listData);
    }
  }
  const listsResponse = await axios.get(
    `https://api.clickup.com/api/v2/space/${spaceid.id}/list`,
    {
      headers: { Authorization: token },
    }
  );

  const lists = listsResponse.data.lists;

  await Promise.all(
    lists.map(async (listData) => {
      await processList(listData);
    })
  );
}

async function processFolder(folderData) {
  const spaceId = folderData.space.id;

  let space = await Space.findOne({ id: spaceId });

  try {
    const listIds = [];
    for (const listData of folderData.lists) {
      let list = await List.findOneAndUpdate({ id: listData.id }, listData, {
        upsert: true,
        new: true,
      });

      listIds.push(list._id);
    }

    let existingFolder = await Folder.findOne({ id: folderData.id });
    if (existingFolder) {
      existingFolder.set({
        ...folderData,
        space: space._id,
        lists: listIds,
      });
      await existingFolder.save();
    } else {
      const newFolder = new Folder({
        ...folderData,
        space: space._id,
        lists: listIds,
      });
      await newFolder.save();
    }
  } catch (error) {
    console.error("Error processing folder:", error.message);
    throw error;
  }
}

async function processList(listData) {
  let space = await Space.findOne({ id: listData.space.id });

  if (!space) {
    space = new Space(listData.space);
    await space.save();
  }

  let folder = await Folder.findOne({ id: listData.folder.id });

  if (!folder) {
    folder = new Folder(listData.folder);
    await folder.save();
  }

  await List.create({ ...listData, space: space._id, folder: folder._id });
}

module.exports = { fetchAndSaveData };
