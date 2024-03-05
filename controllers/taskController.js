const axios = require("axios");
const Task = require("../models/taskSchema");
const User = require("../models/userSchema");

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

          user = new User({
            id: userData.id,
            username: userData.username,
            color: userData.color,
            email: userData.email,
            profilePicture: userData.profilePicture,
            role: userData.role,
          });

          await user.save();
        }

        const newTask = new Task(taskData);

        const assigneeObj = {
          clickup_id: user.id,
          username: user.username,
          color: user.color,
          email: user.email,
          profilePicture: user.profilePicture,
          role: user.role,
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

async function getAllTasks(req, res) {
  try {
    // Récupérer les paramètres de requête
    const {
      creator,
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
    if (creator)
      filter["creator.username"] = { $regex: new RegExp(creator, "i") };
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

    console.log("filter", filter);

    const tasks = await Task.find(filter)
      .sort(order_by)
      .skip((parseInt(page) - 1) * 10) // Assurez-vous de convertir page en nombre
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
    console.log(assigneeId);

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
  saveTasksFromClickup,
  getAllTasks,
  getTaskById,
  getTasksByAssignees,
  getTasksByStatus,
  getTasksByPriority,
  getTasksByTags,
};
