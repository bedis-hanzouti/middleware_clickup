const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  id: String,
  name: String,
  orderindex: Number,
  content: String,
  status: String,
  priority: String,
  assignee: String,
  task_count: Number,
  due_date: String,
  start_date: String,
});

module.exports = mongoose.model("List", listSchema);
