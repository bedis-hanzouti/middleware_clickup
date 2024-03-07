const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: Number,

      unique: true,
    },
  },
  { strict: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
