import express from "express";
import SaveForLater from "../models/SaveForLater.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET SAVED ITEMS
router.get("/", protect, async (req, res) => {
  try {
    const saved = await SaveForLater.findOne({ user: req.user._id }).populate("products");
    if (!saved) {
      return res.json({ saveForLaterItems: [] });
    }
    // Return in same format as cart expects
    const items = saved.products.map((product) => ({ product }));
    res.json({ saveForLaterItems: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD TO SAVE FOR LATER
router.post("/", protect, async (req, res) => {
  try {
    const { productId } = req.body;
    let saved = await SaveForLater.findOne({ user: req.user._id });

    if (!saved) {
      saved = new SaveForLater({ user: req.user._id, products: [] });
    }

    if (!saved.products.includes(productId)) {
      saved.products.push(productId);
      await saved.save();
    }

    const populated = await SaveForLater.findOne({ user: req.user._id }).populate("products");
    const items = populated.products.map((product) => ({ product }));
    res.json({ saveForLaterItems: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// REMOVE FROM SAVE FOR LATER
router.delete("/", protect, async (req, res) => {
  try {
    const { productId } = req.body;
    let saved = await SaveForLater.findOne({ user: req.user._id });

    if (!saved) {
      return res.status(404).json({ message: "Save for later list not found" });
    }

    saved.products = saved.products.filter((id) => id.toString() !== productId);
    await saved.save();

    const populated = await SaveForLater.findOne({ user: req.user._id }).populate("products");
    const items = populated.products.map((product) => ({ product }));
    res.json({ saveForLaterItems: items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

