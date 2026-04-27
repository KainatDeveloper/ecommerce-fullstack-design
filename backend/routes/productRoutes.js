import express from "express";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/auth.js";
import { asyncHandler, sendSuccessResponse, sendErrorResponse } from "../utils/errorHandler.js";
import { validateProductData, validateObjectId } from "../utils/validators.js";
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES } from "../utils/constants.js";

const router = express.Router();

/**
 * @route   GET /api/product
 * @desc    Get all products with search and filtering
 * @access  Public
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { search, category, page = 1, limit = 10, sort = "-createdAt" } = req.query;

    let query = { isActive: true };

    // Search functionality
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by category
    if (category && category !== "all") {
      query.category = category.toLowerCase();
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, Math.min(50, parseInt(limit)));
    const skip = (pageNum - 1) * pageSize;

    // Get total count for pagination
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / pageSize);

    // Fetch products
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .lean();

    return sendSuccessResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PRODUCTS_RETRIEVED, {
      products,
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
 * @route   GET /api/product/featured
 * @desc    Get featured products
 * @access  Public
 */
router.get(
  "/featured",
  asyncHandler(async (req, res) => {
    const featured = await Product.find({
      isFeatured: true,
      isActive: true,
    })
      .limit(8)
      .sort("-createdAt")
      .lean();

    return sendSuccessResponse(res, HTTP_STATUS.OK, "Featured products retrieved", {
      products: featured,
    });
  })
);

/**
 * @route   GET /api/product/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    // Validate MongoDB ObjectId
    if (!validateObjectId(req.params.id)) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Invalid product ID format");
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    return sendSuccessResponse(res, HTTP_STATUS.OK, "Product retrieved", { product });
  })
);

/**
 * @route   POST /api/product
 * @desc    Create a new product (Admin only)
 * @access  Private (Admin)
 */
router.post(
  "/",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    // Validate input
    const validationErrors = validateProductData(req.body);
    if (validationErrors.length > 0) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_PRODUCT_DATA, validationErrors);
    }

    // Create product
    const product = await Product.create({
      ...req.body,
      category: req.body.category.toLowerCase(),
    });

    return sendSuccessResponse(res, HTTP_STATUS.CREATED, SUCCESS_MESSAGES.PRODUCT_CREATED, {
      product,
    });
  })
);

/**
 * @route   PUT /api/product/:id
 * @desc    Update product (Admin only)
 * @access  Private (Admin)
 */
router.put(
  "/:id",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    // Validate ID
    if (!validateObjectId(req.params.id)) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Invalid product ID format");
    }

    // Validate input data
    const validationErrors = validateProductData(req.body);
    if (validationErrors.length > 0) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_PRODUCT_DATA, validationErrors);
    }

    // Update product
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, category: req.body.category?.toLowerCase() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    return sendSuccessResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PRODUCT_UPDATED, {
      product,
    });
  })
);

/**
 * @route   DELETE /api/product/:id
 * @desc    Delete product (Admin only)
 * @access  Private (Admin)
 */
router.delete(
  "/:id",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    // Validate ID
    if (!validateObjectId(req.params.id)) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Invalid product ID format");
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    return sendSuccessResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PRODUCT_DELETED);
  })
);

/**
 * @route   PATCH /api/product/:id/featured
 * @desc    Toggle product featured status (Admin only)
 * @access  Private (Admin)
 */
router.patch(
  "/:id/featured",
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    // Validate ID
    if (!validateObjectId(req.params.id)) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, "Invalid product ID format");
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return sendErrorResponse(res, HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.PRODUCT_NOT_FOUND);
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    return sendSuccessResponse(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.PRODUCT_UPDATED, {
      product,
    });
  })
);

export default router;

export default router;
