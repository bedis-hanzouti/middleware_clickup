const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({}, { strict: false });

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission;
