const axios = require("axios");

const User = require("../models/userSchema");
const Task = require("../models/taskSchema");

async function getUserById(req, res) {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserEmail(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserByTask(req, res) {
  try {
    const { taskId } = req.params;

    // Recherche de la tâche par ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const assignees = task.assignees;

    const user = await User.findById(assignees);

    res.json(user);
  } catch (error) {
    console.error("Error fetching assignees by task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getUserById,
  getUserEmail,
  getUserByTask,
};
