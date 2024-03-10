const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    members: [
      {
        type: Object,
        ref: "User",
      },
    ],
  },
  { strict: false }
);

const Space = mongoose.model("Space", spaceSchema);

module.exports = Space;
