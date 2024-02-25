const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: Number,
  username: String,
  email: String,
  color: String,
  profilePicture: String,
  initials: String,
  role: Number,
  custom_role: String,
  last_active: String,
  date_joined: String,
  date_invited: String,
});

module.exports = mongoose.model("User", userSchema);
