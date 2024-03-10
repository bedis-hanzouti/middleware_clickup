const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,

      unique: true,
    },
  },
  { strict: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
