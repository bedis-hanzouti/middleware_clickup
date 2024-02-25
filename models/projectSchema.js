const mongoose = require("mongoose");
const User = require("./userSchema");
const List = require("./listSchema");
const projectSchema = new mongoose.Schema({
  id: String,
  name: String,
  color: String,
  avatar: String,
  members: [User.schema],
  lists: [List.schema],
});

module.exports = mongoose.model("Project", projectSchema);
