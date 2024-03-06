const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
  {
    id: {
      type: Number,

      unique: true,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
    },
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
    },
  },
  { strict: false }
);

module.exports = mongoose.model("List", listSchema);
