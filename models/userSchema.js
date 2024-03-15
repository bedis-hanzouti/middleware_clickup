const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,

      unique: true,
    },
    permission: {
      type: Object,
      ref: "Permission",
      default: null,
    },
    role: {
      type: Object,
      ref: "Role",
    },
  },
  { strict: false }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
