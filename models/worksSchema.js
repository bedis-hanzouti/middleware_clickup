const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema({}, { strict: false });

const Workspace = mongoose.model("Workspace", workspaceSchema);

module.exports = Workspace;
