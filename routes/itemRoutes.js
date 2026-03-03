const router = require("express").Router();
const Item = require("../models/Item");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");


// =================================
// GET ALL ITEMS
// =================================
router.get("/", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});


// =================================
// ADD ITEM (USER)
// =================================
router.post("/", async (req, res) => {
  const item = new Item({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    img: req.body.img,
    status: "available"
  });

  await item.save();
  res.json(item);
});


// =================================
// USER PAYMENT → MARK PENDING
// =================================
router.put("/:id/pay", auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item)
      return res.status(404).json({ message: "Item not found" });

    if (item.status !== "available")
      return res.status(400).json({ message: "Item already processed" });

    item.status = "pending";
    await item.save();

    res.json(item);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// =================================
// ADMIN MARK AS SOLD
// =================================
router.put("/:id/sold", auth, admin, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status: "sold" },
      { new: true }
    );

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// =================================
// ADMIN DELETE ITEM
// =================================
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// =================================
// ADMIN MARK AS AVAILABLE
// =================================
router.put("/:id/available", auth, admin, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status: "available" },
      { new: true }
    );

    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
