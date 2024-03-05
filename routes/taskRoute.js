const express = require("express");
const route = express.Router();
const taskController = require("../controllers/taskController");

const api_url = process.env.API_CLICKUP;
const token = process.env.TOKEN_CLICKUP;

route.get("/:listId/tasks", async (req, res) => {
  try {
    const listId = req.params.listId;
    const taskList = await taskController.saveTasksFromClickup(
      api_url,
      token,
      listId
    );
    res.json(taskList);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

route.get("/", taskController.getAllTasks);
route.get("/:id", taskController.getTaskById);
route.get("/assignees/:assigneeId", taskController.getTasksByAssignees);
route.get("/status/:status", taskController.getTasksByStatus);
route.get("/priority/:priority", taskController.getTasksByStatus);

module.exports = route;
