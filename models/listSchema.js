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
    members: [
      {
        type: Object,
        ref: "User",
      },
    ],
  },
  { strict: false }
);

const List = mongoose.model("List", listSchema);
module.exports = List;
