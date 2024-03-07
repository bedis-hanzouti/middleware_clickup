const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { strict: false }
);

const Space = mongoose.model("Space", spaceSchema);

module.exports = Space;
