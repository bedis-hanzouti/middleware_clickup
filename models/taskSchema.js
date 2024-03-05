const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    assigneess: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { strict: false }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
