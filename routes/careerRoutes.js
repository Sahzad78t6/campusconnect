const router = require("express").Router();
const Career = require("../models/Career");
const User = require("../models/User");   // ✅ IMPORTANT
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// ===============================
// GET ALL CAREERS (for buttons)
// ===============================
router.get("/", async (req,res)=>{
  const careers = await Career.find();
  res.json(careers);
});

// ===============================
// GET SINGLE CAREER BY TYPE
// ===============================
router.get("/:type", async (req,res)=>{
  const career = await Career.findOne({ type: req.params.type });
  if(!career) return res.status(404).json({ message:"Not found" });
  res.json(career);
});

// ===============================
// MARK PHASE COMPLETE (TOGGLE)
// IMPORTANT: KEEP THIS ABOVE ADMIN ROUTES
// ===============================
router.put("/complete/:id", auth, async (req,res)=>{

  const user = await User.findById(req.user.id);

  const existing = user.progress.find(
    p => p.careerId.toString() === req.params.id
  );

  if(existing){
    // ✅ TOGGLE
    existing.completed = !existing.completed;
  } else {
    user.progress.push({
      careerId: req.params.id,
      completed: true
    });
  }

  await user.save();

  res.json(user.progress);
});

// ===============================
// ADMIN ADD CAREER
// ===============================
router.post("/", auth, admin, async (req,res)=>{
  const career = new Career(req.body);
  await career.save();
  res.json(career);
});

module.exports = router;
