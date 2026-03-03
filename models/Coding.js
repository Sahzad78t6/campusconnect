const mongoose = require("mongoose");

const codingSchema = new mongoose.Schema({
  title: String,
  description: String,
  sampleInput: String,
  sampleOutput: String,
  testCases: [
    {
      input: String,
      expectedOutput: String
    }
  ],
  points: Number
});

module.exports = mongoose.model("Coding", codingSchema);
