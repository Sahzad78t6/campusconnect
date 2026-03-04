const auth = require("../middleware/authMiddleware");
const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req,res)=>{
  try {

    const existingUser = await User.findOne({ email: req.body.email });
    if(existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(req.body.password,10);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashed,
      role: req.body.role || "user"   // 👈 THIS LINE FIX
    });

    await user.save();

    res.json({message:"User registered"});

  } catch(err){
    res.status(500).json({message:"Server error"});
  }
});


// LOGIN
router.post("/login", async (req,res)=>{
  try {

    const user = await User.findOne({ email: req.body.email });
    if(!user)
      return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(req.body.password, user.password);
    if(!valid)
      return res.status(400).json({ message: "Wrong password" });

    // 👇 KEEP IT HERE
    const token = jwt.sign(
  { 
    id: user._id,
    role: user.role || "user"
  },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);


    res.json({ token });

  } catch(err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET CURRENT USER
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});
// ===============================
// GET ALL USERS (ADMIN ONLY)
// ===============================
const admin = require("../middleware/adminMiddleware");

router.get("/all", auth, admin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// ===============================
// DELETE USER (ADMIN)
// ===============================
router.delete("/:id", auth, admin, async (req,res)=>{
  await User.findByIdAndDelete(req.params.id);
  res.json({message:"User deleted"});
});

// ===============================
// CHANGE USER ROLE (ADMIN)
// ===============================
router.put("/:id/role", auth, admin, async (req,res)=>{
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: req.body.role },
    { new:true }
  );
  res.json(user);
});
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: function(req, file, cb){
    cb(null, req.user.id + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.put("/upload-profile", auth, upload.single("profile"), async (req,res)=>{
  try{
    const user = await User.findById(req.user.id);
    user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ profileImage: user.profileImage });
  }catch(err){
    res.status(500).json({ message: "Upload failed" });
  }
});
const passport = require("passport");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {

    const token = generateToken(req.user._id);

    res.redirect(`/login.html?token=${token}`);
  }
);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
module.exports = router;
