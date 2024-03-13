const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,

      unique: true,
    },
    // invited_by: {
    //   type: Object,
    //   ref: "User",
    // },
    role: {
      type: Object,
      ref: "Role",
    },
  },
  { strict: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
