const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const careerRoutes = require("./routes/careerRoutes");
const session = require("express-session");
const passport = require("./config/passport");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
const path = require("path");

app.use(express.static(path.join(__dirname)));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/doubts", require("./routes/doubtRoutes"));
app.use("/api/career", require("./routes/careerRoutes"));

app.get("/", (req, res) => {
  res.send("Campus Connect API Running 🚀");
});


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/career", require("./routes/careerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/coding", require("./routes/codingRoutes"));
app.use("/api/doubts", require("./routes/doubtRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));  


app.use("/uploads", express.static("uploads"));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});