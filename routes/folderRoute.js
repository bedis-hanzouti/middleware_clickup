const express = require("express");
const {
  getFolders,
  getFoldersBySpace,
  getFolderById,
} = require("../controllers/folderController");
const route = express.Router();

route.get("/:spaceId/space", getFoldersBySpace);
route.get("/", getFolders);
route.get("/:id", getFolderById);

module.exports = route;
