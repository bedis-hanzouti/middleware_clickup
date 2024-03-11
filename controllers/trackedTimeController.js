const axios = require("axios");
const TrackedTime = require("../models/trakedTimeSchema");
const User = require("../models/userSchema");
const Task = require("../models/taskSchema");
const apiUrl = process.env.API_CLICKUP;

async function getAllTrackedTimeFromClickup(apiUrl, token, task_id) {
  try {
    const trackedTimeResponse = await axios.get(
      `https://api.clickup.com/api/v2/task/${task_id}/time`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    const trackedTimees = trackedTimeResponse.data.data;

    await TrackedTime.deleteMany();
    for (const trackedData of trackedTimees) {
      if (trackedData.user) {
        const memberId = trackedData.user.id;
        let user = await User.findOne({ id: memberId });

        const newTask = new TrackedTime({ ...trackedData, user: user._id });

        await newTask.save();
      }
    }

    const response = {
      message: "TrackedTimes saved successfully",
      status: 200,
      count: trackedTimees.length,
    };

    return trackedTimees;
  } catch (error) {
    const response = {
      message: error.message,
      status: error.status,
    };

    return response;
  }
}

async function fetchAndSaveTrackedTime(taskData, token) {
  const trackedTimeResponse = await axios.get(
    `${apiUrl}task/${taskData.id}/time`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    }
  );
  const trackedTimees = trackedTimeResponse.data.data;

  await Promise.all(
    trackedTimees.map(async (trackedData) => {
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
    })
  );
}

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
  getAllTrackedTimeFromClickup,
  fetchAndSaveTrackedTime,
  getTrackedTimesByUsers,
  getTrackedTimeById,
  getAllTrackedTime,
};
