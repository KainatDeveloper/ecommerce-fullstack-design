import express from "express";
import Inquiry from "../models/Inquiry.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { asyncHandler, sendSuccessResponse, sendErrorResponse } from "../utils/errorHandler.js";
import { validateObjectId } from "../utils/validators.js";
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from "../utils/constants.js";

const router = express.Router();

/**
 * @route   POST /api/inquiry
 * @desc    Create a new inquiry (authenticated users)
 * @access  Private
 */
router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { itemName, description, quantity, unit } = req.body;

    // Validation
    const errors = [];

    if (!itemName || itemName.trim() === "") {
      errors.push("Item name is required");
    } else if (itemName.length < 3) {
      errors.push("Item name must be at least 3 characters");
    } else if (itemName.length > 100) {
      errors.push("Item name cannot exceed 100 characters");
    }

    if (description && description.length > 1000) {
      errors.push("Description cannot exceed 1000 characters");
    }

    if (!quantity || quantity < 1) {
      errors.push("Quantity must be at least 1");
    }

    if (unit) {
      const validUnits = ["Pcs", "Kg", "Meter", "Box", "Dozen", "Ton", "Liter", "Set"];
      if (!validUnits.includes(unit)) {
        errors.push(`Unit must be one of: ${validUnits.join(", ")}`);
      }
    }

    if (errors.length > 0) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Invalid inquiry data", errors);
    }

    // Create inquiry
    const inquiry = await Inquiry.create({
      user: req.user._id,
      itemName: itemName.trim(),
      description: description?.trim() || "",
      quantity: parseInt(quantity),
      unit: unit || "Pcs",
    });

    return sendSuccessResponse(res, HTTP_STATUS.CREATED, "Inquiry created successfully", {
      inquiry,
    });
  })
);

/**
 * @route   GET /api/inquiry
 * @desc    Get user's inquiries
 * @access  Private
 */
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    let query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, Math.min(50, parseInt(limit)));
    const skip = (pageNum - 1) * pageSize;

    const total = await Inquiry.countDocuments(query);
    const totalPages = Math.ceil(total / pageSize);

    const inquiries = await Inquiry.find(query)
      .sort("-createdAt")
      .skip(skip)
      .limit(pageSize)
      .lean();

    return sendSuccessResponse(res, HTTP_STATUS.OK, "Inquiries retrieved", {
      inquiries,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages,
      },
    });
  })
);

/**
 * @route   GET /api/inquiry/:id
 * @desc    Get inquiry details
 * @access  Private
 */
router.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    if (!validateObjectId(req.params.id)) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Invalid inquiry ID format");
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, "Inquiry not found");
    }

    // Check if user owns this inquiry or is admin
    if (inquiry.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return sendErrorResponse(res, HTTP_STATUS.FORBIDDEN, "Not authorized to view this inquiry");
    }

    return sendSuccessResponse(res, HTTP_STATUS.OK, "Inquiry retrieved", { inquiry });
  })
);

/**
 * @route   PUT /api/inquiry/:id
 * @desc    Update inquiry
 * @access  Private
 */
router.put(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    if (!validateObjectId(req.params.id)) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Invalid inquiry ID format");
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, "Inquiry not found");
    }

    // Check ownership
    if (inquiry.user.toString() !== req.user._id.toString()) {
      return sendErrorResponse(res, HTTP_STATUS.FORBIDDEN, "Not authorized to update this inquiry");
    }

    // Check if inquiry is still pending
    if (inquiry.status !== "pending") {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Cannot update inquiry that is already processed");
    }

    // Update fields
    const { itemName, description, quantity, unit } = req.body;

    if (itemName) inquiry.itemName = itemName.trim();
    if (description !== undefined) inquiry.description = description.trim();
    if (quantity) inquiry.quantity = parseInt(quantity);
    if (unit) inquiry.unit = unit;

    await inquiry.save();

    return sendSuccessResponse(res, HTTP_STATUS.OK, "Inquiry updated successfully", {
      inquiry,
    });
  })
);

/**
 * @route   DELETE /api/inquiry/:id
 * @desc    Delete inquiry
 * @access  Private
 */
router.delete(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    if (!validateObjectId(req.params.id)) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Invalid inquiry ID format");
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, "Inquiry not found");
    }

    // Check ownership
    if (inquiry.user.toString() !== req.user._id.toString()) {
      return sendErrorResponse(res, HTTP_STATUS.FORBIDDEN, "Not authorized to delete this inquiry");
    }

    await Inquiry.findByIdAndDelete(req.params.id);

    return sendSuccessResponse(res, HTTP_STATUS.OK, "Inquiry deleted successfully");
  })
);

/**
 * @route   GET /api/inquiry/admin/all
 * @desc    Get all inquiries (Admin only)
 * @access  Private (Admin)
 */
router.get(
  "/admin/all",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, Math.min(50, parseInt(limit)));
    const skip = (pageNum - 1) * pageSize;

    const total = await Inquiry.countDocuments(query);
    const totalPages = Math.ceil(total / pageSize);

    const inquiries = await Inquiry.find(query)
      .sort("-createdAt")
      .populate("user", "name email phone")
      .skip(skip)
      .limit(pageSize);

    return sendSuccessResponse(res, HTTP_STATUS.OK, "All inquiries retrieved", {
      inquiries,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages,
      },
    });
  })
);

/**
 * @route   PATCH /api/inquiry/:id/status
 * @desc    Update inquiry status (Admin only)
 * @access  Private (Admin)
 */
router.patch(
  "/:id/status",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!validateObjectId(req.params.id)) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Invalid inquiry ID format");
    }

    const validStatuses = ["pending", "processing", "responded", "completed"];
    if (!validStatuses.includes(status)) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, `Status must be one of: ${validStatuses.join(", ")}`);
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, "Inquiry not found");
    }

    return sendSuccessResponse(res, HTTP_STATUS.OK, "Inquiry status updated", { inquiry });
  })
);

export default router;
