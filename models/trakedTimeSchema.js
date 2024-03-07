const mongoose = require("mongoose");

const trakedTime = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
    task: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { strict: false }
);

const TrakedTime = mongoose.model("TrakedTime", trakedTime);

module.exports = TrakedTime;
