const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    assignees: [
      {
        type: Object,
        ref: "User",
      },
    ],
    list: {
      type: Object,
      ref: "List",
    },
  },
  { strict: false }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
