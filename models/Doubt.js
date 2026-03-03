const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  text: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  votes: {
    type: Number,
    default: 0
  },
  isPinned: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const doubtSchema = new mongoose.Schema({
  question: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  answers: [answerSchema]
}, { timestamps: true });

module.exports = mongoose.model("Doubt", doubtSchema);
