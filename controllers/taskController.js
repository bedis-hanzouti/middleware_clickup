const axios = require("axios");
const Task = require("../models/taskSchema");
const User = require("../models/userSchema");
const List = require("../models/listSchema");

async function saveTasksFromClickup(apiUrl, token, listId) {
  try {
    const tasksResponse = await axios.get(
      `https://api.clickup.com/api/v2/list/${listId}/task`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    const tasks = tasksResponse.data.tasks;

    await Task.deleteMany();

    for (const taskData of tasks) {
      if (taskData.assignees && taskData.assignees.length > 0) {
        const memberId = taskData.assignees[0].id;

        let user = await User.findOne({ id: memberId });
        if (!user) {
          const userData = taskData.assignees[0];

          user = new User(userData);

          await user.save();
        }

        const newTask = new Task(taskData);

        const assigneeObj = {
          ...user,
          _id: user._id,
        };

        newTask.assignees = [assigneeObj];

        await newTask.save();
      }
    }

    const response = {
      message: "Tasks saved successfully",
      status: 200,
      count: tasks.length,
    };

    return response;
  } catch (error) {
    console.error("Error fetching space lists:", error);
    throw error;
  }
}

async function getAllTasksFromClickupv0(apiUrl, token, team_Id) {
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

    await Task.deleteMany();
    let newTask;
    for (const taskData of tasks) {
      if (taskData.assignees && taskData.assignees.length > 0) {
        const memberId = taskData.assignees[0].id;

        let user = await User.findOne({ id: memberId });
        if (!user) {
          const userData = taskData.assignees[0];

          user = new User(userData);

          await user.save();
        }

        newTask = new Task(taskData);

        const assigneeObj = {
          ...user,
          _id: user._id,
        };

        newTask.assignees = [assigneeObj];

        await newTask.save();
      } else {
        newTask = new Task(taskData);
        await newTask.save();
      }
    }

    const response = {
      message: "Tasks saved successfully",
      status: 200,
      count: tasks.length,
    };

    return response;
  } catch (error) {
    console.error("Error fetching space lists:", error);
    throw error;
  }
}
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
      let newTask;
      console.log("folder in task ", taskData);

      let folder = await List.findOne({ id: taskData.folder.id });
      let list = await List.findOne({ id: taskData.list.id });
      // console.log("list", list.name);
      newTask = await Task.findOneAndUpdate(
        { id: taskData.id },
        { ...taskData, list: list._id },

        { upsert: true, new: true }
      );

      if (taskData.assignees && taskData.assignees.length > 0) {
        const memberId = taskData.assignees[0].id;
        // console.log(taskData.list);

        let user = await User.findOne({ id: memberId });

        if (!user) {
          const userData = taskData.assignees[0];
          user = new User(userData);
          await user.save();
        }

        newTask = await Task.findOneAndUpdate(
          { id: taskData.id },
          { ...taskData, list: list._id, assignees: [user._id] },

          { upsert: true, new: true }
        );
      } else {
        newTask = await Task.findOneAndUpdate({ id: taskData.id }, taskData, {
          upsert: true,
          new: true,
        });
      }

      savedTasks.push(newTask);
    }

    const response = {
      message: "Tasks saved successfully",
      status: 200,
      count: savedTasks.length,
      tasks: savedTasks,
    };

    return savedTasks;
  } catch (error) {
    console.error("Error fetching task lists:", error);
    throw error;
  }
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
  getAllTasksFromClickup,
  getTaskById,
  getTasksByAssignees,
  getTasksByStatus,
  getTasksByPriority,
  getTasksByTags,
};
