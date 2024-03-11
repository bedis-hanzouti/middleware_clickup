const mongoose = require("mongoose");

const trakedTime = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    task: [
      {
        type: Object,
        ref: "Task",
      },
    ],
    user: {
      type: Object,
      ref: "User",
    },
  },
  { strict: false }
);

const TrakedTime = mongoose.model("TrakedTime", trakedTime);

module.exports = TrakedTime;
