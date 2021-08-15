const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
  courseid: Number,
  class: String,
  name: String,
  studentcount: Number,
});

module.exports = mongoose.model("Course", courseSchema);
