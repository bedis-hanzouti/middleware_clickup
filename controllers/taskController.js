const axios = require("axios");
const Task = require("../models/taskSchema");
const User = require("../models/userSchema");
const List = require("../models/listSchema");
const Folder = require("../models/folderSchema");
const Space = require("../models/spaceSchema");
const apiUrl = process.env.API_CLICKUP;

const { fetchAndSaveTrackedTime } = require("./trackedTimeController");

async function getAllTasksFromClickup(apiUrl, token, team_Id) {
  try {
    const tasksResponse = await axios.get(
      `https://api.clickup.com/api/v2/team/${team_Id}/task`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const tasks = tasksResponse.data.tasks;

    let savedTasks = [];

    // Iterate through tasks
    for (const taskData of tasks) {
      let folder = await Folder.findOne({ id: taskData.folder.id });
      let list = await List.findOne({ id: taskData.list.id });
      let space = await Space.findOne({ id: taskData.space.id });

      let newTask = await Task.findOneAndUpdate(
        { id: taskData.id },
        {
          ...taskData,
          list: list ? list._id : null,
          folder: folder ? folder._id : null,
          space: space._id,
        },
        { upsert: true, new: true }
      );

      if (taskData.assignees && taskData.assignees.length > 0) {
        const memberId = taskData.assignees[0].id;
        let user = await User.findOne({ id: memberId });
        if (user) {
          newTask.assignees = [user._id];
          await newTask.save();
        }
      }

      savedTasks.push(newTask);
    }

    const response = {
      message: "Tasks saved successfully",
      status: 200,
      count: savedTasks.length,
      tasks: savedTasks,
    };

    return response;
  } catch (error) {
    console.error("Error fetching task lists:", error);
    throw error;
  }
}
async function fetchAndSaveTasks(workspaceId, token) {
  const tasksResponse = await axios.get(`${apiUrl}team/${workspaceId}/task`, {
    headers: { Authorization: token },
  });
  const tasks = tasksResponse.data.tasks;

  await Promise.all(
    tasks.map(async (taskData) => {
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

      await fetchAndSaveTrackedTime(taskData, token);
    })
  );
}

async function getAllTasks(req, res) {
  try {
    const {
      assignee,
      status,
      tags,
      priority,
      date_created,
      date_done,
      list,
      space,
      order_by,
      page,
    } = req.query;

    const filter = {};

    if (assignee)
      filter["assignees.username"] = { $regex: new RegExp(assignee, "i") };
    if (status) filter["status.status"] = { $regex: new RegExp(status, "i") };
    if (tags) filter["tags"] = { $regex: new RegExp(tags, "i") };
    if (priority)
      filter["priority.priority"] = { $regex: new RegExp(priority, "i") };
    if (date_created) filter["date_created"] = date_created;
    if (date_done) filter["date_done"] = date_done;
    if (list) filter["list.name"] = { $regex: new RegExp(list, "i") };
    if (space) filter["space.id"] = space;

    // console.log("filter", filter);

    const tasks = await Task.find(filter)
      .populate("assignees")
      .sort(order_by)
      .skip((parseInt(page) - 1) * 10)
      .limit(10);

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getTaskById(req, res) {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getTasksByAssignees(req, res) {
  try {
    const { assigneeId } = req.params;
    // console.log(assigneeId);

    const tasks = await Task.find();

    const filteredTasks = tasks.filter((task) => {
      return task.assignees.some((assignee) => assignee._id == assigneeId);
    });

    res.json(filteredTasks);
  } catch (error) {
    console.error("Error fetching tasks by assignee:", error);
    res.status(500).json({ error: error });
  }
}

async function getTasksByStatus(req, res) {
  try {
    const { status } = req.params;

    const tasks = await Task.find({
      status: { $regex: new RegExp(status, "i") },
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getTasksByPriority(req, res) {
  try {
    const { priority } = req.params;

    const tasks = await Task.find({
      "priority.priority": { $regex: new RegExp(priority, "i") },
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getTasksByTags(req, res) {
  try {
    const { tags } = req.params;

    const tasks = await Task.find({
      tags: { $regex: new RegExp(tags, "i") },
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks by status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
module.exports = {
  // saveTasksFromClickup,
  getAllTasks,
  fetchAndSaveTasks,
  getAllTasksFromClickup,
  getTaskById,
  getTasksByAssignees,
  getTasksByStatus,
  getTasksByPriority,
  getTasksByTags,
};
