const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  img: String,
  status: {
    type: String,
    default: "available"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });


module.exports = mongoose.model("Item", itemSchema);
