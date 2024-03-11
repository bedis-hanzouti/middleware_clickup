const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    id: {
      type: Number,
    },
  },
  { strict: false }
);

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
