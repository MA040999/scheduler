const mongoose = require('mongoose');

const labSchema = mongoose.Schema({
    labid: Number,
    labname: String,
});

module.exports = mongoose.model('Lab', labSchema);