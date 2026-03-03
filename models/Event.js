const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  location: String,
  description: String,
  eventDate: Date,
  registrationLink: String
});

module.exports = mongoose.model("Event", eventSchema);
