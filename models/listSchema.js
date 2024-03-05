const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    assigneess: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { strict: false }
);

module.exports = mongoose.model("List", listSchema);
