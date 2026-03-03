const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "User"
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coding"
  },
  language: String,
  code: String,
  status: String,
  score: Number
}, { timestamps: true });

module.exports = mongoose.model("Submission", SubmissionSchema);
