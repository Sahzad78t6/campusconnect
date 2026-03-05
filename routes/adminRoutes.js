const router = require("express").Router();
const User = require("../models/User");
const Event = require("../models/Event");
const Item = require("../models/Item");
const Doubt = require("../models/Doubt");
const Career = require("../models/Career");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const jwt = require("jsonwebtoken");
// ==============================
// GET PLATFORM STATS
// ==============================
router.get("/stats", auth, admin, async (req, res) => {
  try {

    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalItems = await Item.countDocuments();
    const totalDoubts = await Doubt.countDocuments();
    const totalCareers = await Career.countDocuments();

    // Count total phases
    const careers = await Career.find();
    let totalPhases = 0;

    careers.forEach(c => {
      if (c.phases) {
        totalPhases += c.phases.length;
      }
    });

    // 💰 Revenue
    const soldItems = await Item.find({ status: "sold" });

    const revenue = soldItems.reduce(
      (sum, item) => sum + (item.price || 0),
      0
    );

    res.json({
      users: totalUsers,
      events: totalEvents,
      items: totalItems,
      doubts: totalDoubts,
      careers: totalCareers,
      phases: totalPhases,
      revenue
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/dashboard", auth, admin, (req, res) => {
  console.log(req.user); // ✅ user is attached to req
  res.json({ message: "Welcome Admin" });
});

module.exports = router;
