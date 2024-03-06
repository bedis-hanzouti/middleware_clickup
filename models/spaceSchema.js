const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { strict: false }
);

const Space = mongoose.model("Space", spaceSchema);

module.exports = Space;
