const mongoose = require("mongoose");

const facultySchema = mongoose.Schema({
  facultyid: Number,
  facultyname: String,
});

module.exports = mongoose.model("Facultys", facultySchema);
