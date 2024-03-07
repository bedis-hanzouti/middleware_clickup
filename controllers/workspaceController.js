const axios = require("axios");
const mongoose = require("mongoose");
const List = require("../models/listSchema");
const User = require("../models/userSchema");
const Space = require("../models/spaceSchema");
const Folder = require("../models/folderSchema");
const Workspace = require("../models/worksSchema");
const DataSchema = new mongoose.Schema({}, { strict: false });
const Test = mongoose.model("Data", DataSchema);

async function fetchAndSaveData(apiUrl, token, response) {
  try {
    await Workspace.deleteMany();

    const projectsResponse = await axios.get(apiUrl, {
      headers: {
        Authorization: token,
      },
    });
    const workspaces = projectsResponse.data.teams;
    for (const data of workspaces) {
      for (const newUser of data.members) {
        const memberId = newUser.user.id;
        let createUser = newUser.user;

        const user = await User.findOneAndUpdate({ id: memberId }, createUser, {
          upsert: true,
          new: true,
        });
        // console.log("user", user);
        // await user.save();

        // let user = await User.findOne({ id: memberId });

        // if (!user) {
        //   user = new User({ ...createUser, id: memberId });

        //   await user.save();
        // }
      }
    }
    console.log(workspaces.id);
    let workspaceData = new Workspace(workspaces[0]);

    await workspaceData.save();
    9015388447;

    await List.deleteMany();

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
        //await Space.deleteMany()
        //await Folder.deleteMany()
        // console.log("lists", lists);
        for (const listData of lists) {
          let space = await Space.findOne({ id: listData.space.id });

          if (!space) {
            space = new Space(listData.space);

            await space.save();
          }
          let folder = await Folder.findOne({ id: listData.folder.id });
          // console.log("folder", folder);
          if (!folder) {
            folder = new Folder(listData.folder);

            await folder.save();
          }
          await List.insertMany({ ...listData, space, folder });
        }

        const obj = { ...workspace, lists };
        return obj;
      })
    );

    await Test.deleteMany();
    await Test.insertMany(projectsWithDetails);
    console.log("Project data successfully saved in the database.");

    if (response) {
      response.json({ success: projectsWithDetails });
    }
  } catch (error) {
    console.error("Error fetching or saving project data:", error.message);
    if (response) {
      response.status(500).json({
        error:
          "An error occurred while fetching or saving project data. Please check the logs for more details.",
      });
    }
  }
}

module.exports = { fetchAndSaveData };
