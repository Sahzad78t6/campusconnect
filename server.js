const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const careerRoutes = require("./routes/careerRoutes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/doubts", require("./routes/doubtRoutes"));
app.use("/api/career", require("./routes/careerRoutes"));

app.get("/", (req, res) => {
  res.send("Campus Connect API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
app.use("/api/auth", require("./routes/authRoutes"));
const path = require("path");

app.use(express.static(path.join(__dirname)));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/events", require("./routes/eventRoutes"));
app.use("/api/career", require("./routes/careerRoutes"));
app.use("/api/career", careerRoutes);
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/uploads", express.static("uploads"));
const codingRoutes = require("./routes/codingRoutes");
app.use("/api/coding", codingRoutes);
app.use("/api/coding", require("./routes/codingRoutes"));
