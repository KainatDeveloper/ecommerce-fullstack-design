import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler, sendSuccessResponse, sendErrorResponse } from "../utils/errorHandler.js";
import { validateObjectId } from "../utils/validators.js";
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from "../utils/constants.js";

const router = express.Router();

/**
 * @route   GET /api/cart
 * @desc    Get user's cart items
 * @access  Private
 */
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: "items.product",
        select: "name price image discount stock",
      })
      .lean();

    if (!cart) {
      return sendSuccessResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.CART_RETRIEVED, {
        items: [],
        total: 0,
        itemCount: 0,
      });
    }

    // Calculate totals
    const total = cart.items.reduce((sum, item) => {
      const discountedPrice =
        (item.product.price * (100 - item.product.discount)) / 100;
      return sum + discountedPrice * item.quantity;
    }, 0);

    return sendSuccessResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.CART_RETRIEVED, {
      items: cart.items,
      total: Math.round(total * 100) / 100,
      itemCount: cart.items.length,
    });
  })
);

/**
 * @route   POST /api/cart
 * @desc    Add item to cart
 * @access  Private
 */
router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    // Validate input
    if (!productId) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Product ID is required");
    }

    if (!validateObjectId(productId)) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Invalid product ID format");
    }

    if (quantity < 1 || !Number.isInteger(quantity)) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Quantity must be a positive integer");
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    if (!product.isActive) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Product is not available");
    }

    // Check stock
    if (product.stock < quantity) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, `Only ${product.stock} items available in stock`);
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if item already exists
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity if item exists
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      if (newQuantity > product.stock) {
        return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, `Only ${product.stock} items available in stock`);
      }
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // Populate and return updated cart
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.product",
      select: "name price image discount stock",
    });

    return sendSuccessResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.ITEM_ADDED_TO_CART, {
      items: populatedCart.items,
    });
  })
);

/**
 * @route   PUT /api/cart
 * @desc    Update cart item quantity
 * @access  Private
 */
router.put(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { productId, quantity } = req.body;

    // Validate input
    if (!productId || !validateObjectId(productId)) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Valid product ID is required");
    }

    if (quantity === undefined || !Number.isInteger(quantity) || quantity < 0) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Quantity must be a non-negative integer");
    }

    // Find cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.CART_NOT_FOUND);
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, "Item not found in cart");
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      cart.items.splice(itemIndex, 1);
    } else {
      // Check stock availability
      const product = await Product.findById(productId);
      if (quantity > product.stock) {
        return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, `Only ${product.stock} items available in stock`);
      }
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    // Populate and return updated cart
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.product",
      select: "name price image discount stock",
    });

    return sendSuccessResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.CART_UPDATED, {
      items: populatedCart.items,
    });
  })
);

/**
 * @route   DELETE /api/cart
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { productId } = req.body;

    // Validate input
    if (!productId || !validateObjectId(productId)) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Valid product ID is required");
    }

    // Find cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.CART_NOT_FOUND);
    }

    // Remove item
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    // Populate and return updated cart
    const populatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: "items.product",
      select: "name price image discount stock",
    });

    return sendSuccessResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.ITEM_REMOVED_FROM_CART, {
      items: populatedCart.items,
    });
  })
);

/**
 * @route   DELETE /api/cart/clear
 * @desc    Clear entire cart
 * @access  Private
 */
router.delete(
  "/clear",
  protect,
  asyncHandler(async (req, res) => {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    return sendSuccessResponse(res, HTTP_STATUS.OK, "Cart cleared successfully", {
      items: [],
    });
  })
);

export default router;

