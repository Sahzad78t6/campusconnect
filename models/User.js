const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

  name: String,

  email: {
    type: String,
    unique: true
  },

  password: String,

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
profileImage: {
  type: String,
  default: ""
},
totalScore: {
    type: Number,
    default: 0
  },
  solvedProblems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem"
  }],
  // ✅ PROGRESS MUST BE INSIDE SCHEMA
  progress: [
    {
      careerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Career"
      },
      completed: {
        type: Boolean,
        default: false
      }
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
