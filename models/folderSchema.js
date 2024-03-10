const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    spaces: {
      type: Object,
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

// async function clearData() {
//   await Promise.all([
//     Workspace.deleteMany(),
//     User.deleteMany(),
//     List.deleteMany(),
//     TrackedTime.deleteMany(),
//     Task.deleteMany(),
//     Space.deleteMany(),
//     Folder.deleteMany(),
//     Test.deleteMany(),
//   ]);
// }
