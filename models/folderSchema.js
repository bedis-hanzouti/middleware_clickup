const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    spaces: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Space",
    },
    // lists: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "List",
    //   },
    // ],
  },
  { strict: false }
);

const Folder = mongoose.model("Folder", folderSchema);

module.exports = Folder;

// TOKEN_CLICKUP=pk_62642127_F8YVWWSYN7FFFOYOQ7HEYEYDLZ6PXXD3
