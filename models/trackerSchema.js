const mongoose = require("mongoose");

const trackerSchema = new mongoose.Schema(
  {
    id: {
      type: String,

      unique: true,
    },

    customField: {
      type: Object,
      ref: "CustomField",
    },
  },
  { strict: false }
);

const Tracker = mongoose.model("Tracker", trackerSchema);

module.exports = Tracker;
