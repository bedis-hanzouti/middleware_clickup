const express = require("express");
const router = express.Router();

const workspaceRoute = require("./workspaceRoute");
const spaceRoutes = require("./spaceRoute");
const folderRoutes = require("./folderRoute");
const listRoutes = require("./listRoute");
const taskRoutes = require("./taskRoute");
const userRoutes = require("./userRoute");
const trackedRoutes = require("./trackedTimeRoute.js");
const trackerRoutes = require("./trackerRoute");

router.use("/saveData", workspaceRoute);
router.use("/spaces", spaceRoutes);
router.use("/folders", folderRoutes);
router.use("/lists", listRoutes);
router.use("/tasks", taskRoutes);
router.use("/users", userRoutes);
router.use("/tracked", trackedRoutes);
router.use("/trackers", trackerRoutes);

module.exports = router;
