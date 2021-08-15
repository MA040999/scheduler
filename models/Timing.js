const mongoose = require("mongoose");

const timingSchema = mongoose.Schema({
  timingid: Number,
  timeslot: String,
});

module.exports = mongoose.model("Timing", timingSchema);
