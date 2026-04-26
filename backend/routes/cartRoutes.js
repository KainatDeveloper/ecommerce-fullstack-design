import express from "express";
import Cart from "../models/Cart.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// GET CART ITEMS
router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart) {
      return res.json({ cartItems: [] });
    }
    res.json({ cartItems: cart.items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD TO CART
router.post("/", protect, async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.json({ cartItems: populatedCart.items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE CART ITEM QUANTITY
router.put("/", protect, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      if (quantity < 1) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
    }

    await cart.save();
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.json({ cartItems: populatedCart.items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE CART ITEM
router.delete("/", protect, async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.json({ cartItems: populatedCart.items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

