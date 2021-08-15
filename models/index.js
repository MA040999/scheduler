const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  Course: require("./Course"),
  Lab: require("./Lab"),
  Timing: require("./Timing"),
  Relation: require("./Relation"),
  Faculty: require("./Faculty"),
};
