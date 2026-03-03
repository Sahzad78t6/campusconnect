const router = require("express").Router();
const axios = require("axios");

const Coding = require("../models/Coding");
const Submission = require("../models/Submission");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");


// =====================================
// GET ALL PROBLEMS
// =====================================
router.get("/problems", async (req, res) => {
  try {
    const problems = await Coding.find().select("-testCases");
    res.json(problems);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching problems" });
  }
});


// =====================================
// GET SINGLE PROBLEM
// =====================================
router.get("/problem/:id", async (req, res) => {
  try {
    const problem = await Coding.findById(req.params.id);

    if (!problem)
      return res.status(404).json({ message: "Problem not found" });

    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: "Invalid problem ID" });
  }
});


// =====================================
// SUBMIT CODE
// =====================================
router.post("/submit/:id", auth, async (req, res) => {
  try {
    const { language, code } = req.body;

    if (!language || !code)
      return res.status(400).json({ message: "Language and code required" });

    const problem = await Coding.findById(req.params.id);
    if (!problem)
      return res.status(404).json({ message: "Problem not found" });

    let allPassed = true;
    let failedOutput = "";
    let expectedOutput = "";

    for (let test of problem.testCases) {

      const judgeResponse = await axios.post(
        "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
        {
          source_code: code,
          language_id: language,
          stdin: test.input
        }
      );

      const output = judgeResponse.data.stdout?.trim();

      if (output !== test.expectedOutput.trim()) {
        allPassed = false;
        failedOutput = output;
        expectedOutput = test.expectedOutput.trim();
        break;
      }
    }

    const status = allPassed ? "Accepted" : "Wrong Answer";

    // Save submission
    const submission = new Submission({
      user: req.user.id,
      problem: problem._id,
      language,
      code,
      status,
      score: allPassed ? problem.points : 0
    });

    await submission.save();

    // ===============================
    // 🔥 FIX: Add score only once
    // ===============================
    if (allPassed) {

      const alreadySolved = await Submission.findOne({
        user: req.user.id,
        problem: problem._id,
        status: "Accepted",
        _id: { $ne: submission._id } // exclude current submission
      });

      if (!alreadySolved) {
        await User.findByIdAndUpdate(req.user.id, {
          $inc: { totalScore: problem.points }
        });
      }
    }

    res.json({
      status,
      score: allPassed ? problem.points : 0,
      expected: expectedOutput,
      output: failedOutput
    });

  } catch (err) {
    console.log(err.response?.data || err);
    res.status(500).json({ message: "Submission error" });
  }
});


// =====================================
// GET USER SUBMISSIONS
// =====================================
router.get("/my-submissions", auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.id })
      .populate("problem", "title")
      .sort({ createdAt: -1 });

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching submissions" });
  }
});


// =====================================
// GET USER SUBMISSION FOR A PROBLEM
// =====================================
router.get("/submission/:problemId", auth, async (req, res) => {
  try {
    const submission = await Submission.findOne({
      user: req.user.id,
      problem: req.params.problemId
    }).sort({ createdAt: -1 });

    if (!submission) return res.json(null);

    res.json(submission);

  } catch (err) {
    res.status(500).json({ message: "Error fetching submission" });
  }
});


// =====================================
// GET ACCEPTED PROBLEMS OF USER
// =====================================
router.get("/user-submissions", auth, async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user.id,
      status: "Accepted"
    });

    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: "Error fetching submissions" });
  }
});


// =====================================
// ADD PROBLEM (TEMPORARY)
// =====================================
router.post("/add", async (req, res) => {
  try {
    const problem = await Coding.create(req.body);
    res.json(problem);
  } catch (err) {
    res.status(500).json({ message: "Error adding problem" });
  }
});

// =====================================
// LEADERBOARD
// =====================================
router.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find()
      .select("name totalScore")
      .sort({ totalScore: -1 })
      .limit(50);

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
});
module.exports = router;
