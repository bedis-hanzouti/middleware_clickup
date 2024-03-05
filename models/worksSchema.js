const mongoose = require("mongoose");
const User = require("./userSchema");
const List = require("./listSchema");
const workspacetSchema = new mongoose.Schema({
  id: String,
  name: String,
  color: String,
  avatar: String,
  members: [User.schema],
  lists: [List.schema],
});

module.exports = mongoose.model("Workspace", workspacetSchema);
