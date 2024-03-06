const express = require("express");
const route = express.Router();
const trackedTimeController = require("../controllers/trackedTimeController");

const api_url = process.env.API_CLICKUP;
const token = process.env.TOKEN_CLICKUP;

route.get("/:task_id/trackedList", async (req, res) => {
  try {
    const task_id = req.params.task_id;
    const trackedLists = await trackedTimeController.saveTrackedTimeFromClickup(
      api_url,
      token,
      task_id
    );
    res.json(trackedLists);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
// route.get("/:userId", userController.getUserById);
// route.get("/", userController.getUserEmail);
// route.get("/:taskId/task", userController.getUserByTask);

module.exports = route;
