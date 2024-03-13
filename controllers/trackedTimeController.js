const axios = require("axios");
const TrackedTime = require("../models/trakedTimeSchema");
const User = require("../models/userSchema");
const Task = require("../models/taskSchema");
const apiUrl = process.env.API_CLICKUP;

async function getAllTrackedTime(req, res) {
  try {
    const TrackedTimes = await TrackedTime.find()
      .populate("task")
      .populate("user");

    res.json(TrackedTimes);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getTrackedTimeById(req, res) {
  try {
    const trackedTimeId = req.params.trackedTimeId;
    const trackedTime = await Task.findById(trackedTimeId);
    if (!trackedTime) {
      return res.status(404).json({ error: "trackedTime not found" });
    }
    res.json(trackedTime);
  } catch (error) {
    console.error("Error fetching trackedTime by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getTrackedTimesByUsers(req, res) {
  try {
    const { userId } = req.params;
    console.log(userId);

    const TrackedTimes = await TrackedTime.find();

    const filteredTasks = TrackedTimes.filter((tracked) => {
      return tracked.user.some((user) => user._id == userId);
    });

    res.json(filteredTasks);
  } catch (error) {
    console.error("Error fetching TrackedTimes by assignee:", error);
    res.status(500).json({ error: error });
  }
}

module.exports = {
  getTrackedTimesByUsers,
  getTrackedTimeById,
  getAllTrackedTime,
};
