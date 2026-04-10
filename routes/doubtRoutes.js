const router = require("express").Router();
const Doubt = require("../models/Doubt");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");


// =====================================
// 🧠 POST DOUBT (Logged User)
// =====================================
router.post("/", auth, async (req,res)=>{

  const { question } = req.body;

  const doubt = new Doubt({
    question,
    user: req.user.id
  });

  await doubt.save();

  res.json(doubt);
});
// =====================================
// 📚 GET ALL DOUBTS
// (Answers sorted by votes DESC)
// =====================================
router.get("/", async (req, res) => {
  try {
    const doubts = await Doubt.find().populate("user", "name");

    // Sort answers inside each doubt by votes
    const sortedDoubts = doubts.map(d => {
      d.answers.sort((a, b) => b.votes - a.votes);
      return d;
    });

    res.json(sortedDoubts);

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


// =====================================
// 💬 ADD ANSWER (Logged User)
// =====================================
router.post("/:id/answer", auth, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);

    doubt.answers.push({
      text: req.body.text,
      user: req.user.id,
      votes: 0,
      isPinned: false
    });

    await doubt.save();
    res.json(doubt);

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


// =====================================
// 👍 UPVOTE ANSWER
// =====================================
router.put("/:doubtId/answer/:answerId/vote", auth, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.doubtId);
    const answer = doubt.answers.id(req.params.answerId);

    if (!answer)
      return res.status(404).json({ message: "Answer not found" });

    answer.votes += 1;

    await doubt.save();
    res.json(doubt);

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


// =====================================
// 👑 ADMIN DELETE DOUBT
// =====================================
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await Doubt.findByIdAndDelete(req.params.id);
    res.json({ message: "Doubt deleted" });

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


// =====================================
// 👑 ADMIN PIN BEST ANSWER
// =====================================
router.put("/:doubtId/answer/:answerId/pin", auth, admin, async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.doubtId);

    // Remove existing pinned
    doubt.answers.forEach(a => a.isPinned = false);

    const answer = doubt.answers.id(req.params.answerId);
    if (!answer)
      return res.status(404).json({ message: "Answer not found" });

    answer.isPinned = true;

    await doubt.save();
    res.json(doubt);

  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
