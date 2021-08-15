const mongoose = require("mongoose");

const relationSchema = mongoose.Schema({
  scheduleid: Number,
  labid: Number,
  courseid: Number,
  facultyid: Number,
  daynumber: Number,
  timingid: Number,
});

module.exports = mongoose.model("Relation", relationSchema);
