const express = require("express");
const route = express.Router();
const trackerController = require("../controllers/trackerController");

//   try {
//     const listId = req.params.listId;
//     const taskList = await taskController.saveTasksFromClickup(
//       api_url,
//       token,
//       listId
//     );
//     res.json(taskList);
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

route.get("/", trackerController.getTrackers);
route.get("/:id", trackerController.getTrackerById);

module.exports = route;
