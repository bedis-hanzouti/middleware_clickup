const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    folder: {
      type: Object,
      ref: "Folder",
    },
    space: {
      type: Object,
      ref: "Space",
    },
  },
  { strict: false }
);

module.exports = mongoose.model("List", listSchema);
