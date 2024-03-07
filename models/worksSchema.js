const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
  },
  { strict: false }
);

const Workspace = mongoose.model("Workspace", workspaceSchema);

module.exports = Workspace;
