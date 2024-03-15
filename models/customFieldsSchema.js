const mongoose = require("mongoose");

const customFieldSchema = new mongoose.Schema(
  {
    id: {
      type: String,

      unique: true,
    },

    tasks: [
      {
        type: Object,
        ref: "Task",
      },
    ],
  },
  { strict: false }
);

const CustomField = mongoose.model("CustomField", customFieldSchema);

module.exports = CustomField;
