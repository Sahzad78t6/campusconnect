const mongoose = require("mongoose");

const phaseSchema = new mongoose.Schema({
  title: String,
  difficulty: String,
  estimatedTime: String,
  youtubeLink: String,
  resourceLink: String,
  order: Number
});

const careerSchema = new mongoose.Schema({
  name: String, // Web Developer
  type: String, // web, sde, data
  description: String,
  phases: [phaseSchema]
});

module.exports = mongoose.model("Career", careerSchema);
