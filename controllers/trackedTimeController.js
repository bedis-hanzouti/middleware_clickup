const axios = require("axios");
const TrackedTime = require("../models/trakedTimeSchema");
const User = require("../models/userSchema");

async function saveTrackedTimeFromClickup(apiUrl, token, task_id) {
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
    const trackedTimees = trackedTimeResponse.data;

    await TrackedTime.deleteMany();

    // for (const taskData of trackedTimees) {
    //   if (taskData.assignees && taskData.assignees.length > 0) {
    //     const memberId = taskData.assignees[0].id;

    //     let user = await User.findOne({ id: memberId });
    //     if (!user) {
    //       const userData = taskData.assignees[0];

    //       user = new User({
    //         id: userData.id,
    //         username: userData.username,
    //         color: userData.color,
    //         email: userData.email,
    //         profilePicture: userData.profilePicture,
    //         role: userData.role,
    //       });

    //       await user.save();
    //     }

    //     const newTask = new TrackedTime(taskData);

    //     const assigneeObj = {
    //       clickup_id: user.id,
    //       username: user.username,
    //       color: user.color,
    //       email: user.email,
    //       profilePicture: user.profilePicture,
    //       role: user.role,
    //       _id: user._id,
    //     };

    //     newTask.assignees = [assigneeObj];

    //     await newTask.save();
    //   }
    // }

    const response = {
      message: "TrackedTimes saved successfully",
      status: 200,
      count: trackedTimees.length,
    };

    return response;
  } catch (error) {
    const response = {
      message: error.message,
      status: error.status,
    };

    return response;
  }
}

// async function getAllTasks(req, res) {
//   try {
//     const {
//       assignee,
//       status,
//       tags,
//       priority,
//       date_created,
//       date_done,
//       list,
//       space,
//       order_by,
//       page,
//     } = req.query;

//     const filter = {};

//     if (assignee)
//       filter["assignees.username"] = { $regex: new RegExp(assignee, "i") };
//     if (status) filter["status.status"] = { $regex: new RegExp(status, "i") };
//     if (tags) filter["tags"] = { $regex: new RegExp(tags, "i") };
//     if (priority)
//       filter["priority.priority"] = { $regex: new RegExp(priority, "i") };
//     if (date_created) filter["date_created"] = date_created;
//     if (date_done) filter["date_done"] = date_done;
//     if (list) filter["list.name"] = { $regex: new RegExp(list, "i") };
//     if (space) filter["space.id"] = space;

//     console.log("filter", filter);

//     const tasks = await Task.find(filter)
//       .sort(order_by)
//       .skip((parseInt(page) - 1) * 10)
//       .limit(10);

//     res.json(tasks);
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

// async function getTaskById(req, res) {
//   try {
//     const taskId = req.params.taskId;
//     const task = await Task.findById(taskId);
//     if (!task) {
//       return res.status(404).json({ error: "Task not found" });
//     }
//     res.json(task);
//   } catch (error) {
//     console.error("Error fetching task by ID:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

// async function getTasksByAssignees(req, res) {
//   try {
//     const { assigneeId } = req.params;
//     console.log(assigneeId);

//     const tasks = await Task.find();

//     const filteredTasks = tasks.filter((task) => {
//       return task.assignees.some((assignee) => assignee._id == assigneeId);
//     });

//     res.json(filteredTasks);
//   } catch (error) {
//     console.error("Error fetching tasks by assignee:", error);
//     res.status(500).json({ error: error });
//   }
// }

// async function getTasksByStatus(req, res) {
//   try {
//     const { status } = req.params;

//     const tasks = await Task.find({
//       status: { $regex: new RegExp(status, "i") },
//     });

//     res.json(tasks);
//   } catch (error) {
//     console.error("Error fetching tasks by status:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

// async function getTasksByPriority(req, res) {
//   try {
//     const { priority } = req.params;

//     const tasks = await Task.find({
//       "priority.priority": { $regex: new RegExp(priority, "i") },
//     });

//     res.json(tasks);
//   } catch (error) {
//     console.error("Error fetching tasks by status:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

// async function getTasksByTags(req, res) {
//   try {
//     const { tags } = req.params;

//     const tasks = await Task.find({
//       tags: { $regex: new RegExp(tags, "i") },
//     });

//     res.json(tasks);
//   } catch (error) {
//     console.error("Error fetching tasks by status:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }
module.exports = {
  saveTrackedTimeFromClickup,
  //   getAllTasks,
  //   getTaskById,
  //   getTasksByAssignees,
  //   getTasksByStatus,
  //   getTasksByPriority,
  //   getTasksByTags,
};
