import express from "express";
import SaveForLater from "../models/SaveForLater.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler, sendSuccessResponse, sendErrorResponse } from "../utils/errorHandler.js";
import { validateObjectId } from "../utils/validators.js";
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from "../utils/constants.js";

const router = express.Router();

/**
 * @route   GET /api/saveForLater
 * @desc    Get user's saved items
 * @access  Private
 */
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const saved = await SaveForLater.findOne({ user: req.user._id })
      .populate({
        path: "products",
        select: "name price image discount stock category description",
      })
      .lean();

    if (!saved || saved.products.length === 0) {
      return sendSuccessResponse(res, HTTP_STATUS.OK, "Saved items retrieved", {
        items: [],
        count: 0,
      });
    }

    const items = saved.products.map((product) => ({ product }));

    return sendSuccessResponse(res, HTTP_STATUS.OK, "Saved items retrieved", {
      items,
      count: items.length,
    });
  })
);

/**
 * @route   POST /api/saveForLater
 * @desc    Add item to save for later
 * @access  Private
 */
router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { productId } = req.body;

    // Validate input
    if (!productId) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Product ID is required");
    }

    if (!validateObjectId(productId)) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Invalid product ID format");
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    // Find or create save for later list
    let saved = await SaveForLater.findOne({ user: req.user._id });
    if (!saved) {
      saved = new SaveForLater({ user: req.user._id, products: [] });
    }

    // Check if product already saved
    if (saved.products.includes(productId)) {
      return sendErrorResponse(res, HTTP_STATUS.CONFLICT, "Item is already saved");
    }

    // Add product to saved list
    saved.products.push(productId);
    await saved.save();

    // Populate and return updated list
    const populated = await SaveForLater.findOne({ user: req.user._id }).populate({
      path: "products",
      select: "name price image discount stock category description",
    });

    const items = populated.products.map((product) => ({ product }));

    return sendSuccessResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.SAVED_ITEM_ADDED, {
      items,
      count: items.length,
    });
  })
);

/**
 * @route   DELETE /api/saveForLater
 * @desc    Remove item from save for later
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

    // Find save for later list
    const saved = await SaveForLater.findOne({ user: req.user._id });
    if (!saved) {
      return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, "Save for later list not found");
    }

    // Check if item exists
    if (!saved.products.includes(productId)) {
      return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, "Item not found in saved list");
    }

    // Remove item
    saved.products = saved.products.filter((id) => id.toString() !== productId);
    await saved.save();

    // Populate and return updated list
    const populated = await SaveForLater.findOne({ user: req.user._id }).populate({
      path: "products",
      select: "name price image discount stock category description",
    });

    const items = populated.products.map((product) => ({ product }));

    return sendSuccessResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.SAVED_ITEM_REMOVED, {
      items,
      count: items.length,
    });
  })
);

/**
 * @route   DELETE /api/saveForLater/clear
 * @desc    Clear all saved items
 * @access  Private
 */
router.delete(
  "/clear",
  protect,
  asyncHandler(async (req, res) => {
    await SaveForLater.findOneAndUpdate({ user: req.user._id }, { products: [] });

    return sendSuccessResponse(res, HTTP_STATUS.OK, "All saved items cleared", {
      items: [],
      count: 0,
    });
  })
);

export default router;

