const router = require("express").Router();
const Event = require("../models/Event");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");


// ===============================
// 🔐 ADMIN ROUTES
// ===============================

// ➕ Add Event (Admin Only)
router.post("/", auth, admin, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


// ✏️ Edit Event (Admin Only)
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


// ❌ Delete Event (Admin Only)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


// ===============================
// 🌍 PUBLIC ROUTES
// ===============================

// 📅 Get all upcoming events
router.get("/", async (req, res) => {
  try {
    const now = new Date();

    const events = await Event.find({
      eventDate: { $gt: now }   // only future events
    }).sort({ eventDate: 1 });  // nearest event first

    res.json(events);

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
