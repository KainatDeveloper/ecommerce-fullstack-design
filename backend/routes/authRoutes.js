import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import { asyncHandler, sendSuccessResponse, sendErrorResponse } from "../utils/errorHandler.js";
import { validateUserRegistration, validateUserLogin } from "../utils/validators.js";
import { HTTP_STATUS, SUCCESS_MESSAGES, ERROR_MESSAGES, JWT_CONFIG } from "../utils/constants.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    const validationErrors = validateUserRegistration({ name, email, password });
    if (validationErrors.length > 0) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_INPUT, validationErrors);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendErrorResponse(res, HTTP_STATUS.CONFLICT, ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: JWT_CONFIG.EXPIRY }
    );

    const userResponse = user.toJSON();

    return sendSuccessResponse(
      res,
      HTTP_STATUS.CREATED,
      SUCCESS_MESSAGES.USER_REGISTERED,
      { user: userResponse, token }
    );
  })
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get token
 * @access  Public
 */
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    const validationErrors = validateUserLogin({ email, password });
    if (validationErrors.length > 0) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_INPUT, validationErrors);
    }

    // Find user and select password
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check if user is active
    if (!user.isActive) {
      return sendErrorResponse(res, HTTP_STATUS.FORBIDDEN, "User account is inactive");
    }

    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return sendErrorResponse(res, HTTP_STATUS.BAD_REQUEST, ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: JWT_CONFIG.EXPIRY }
    );

    const userResponse = user.toJSON();

    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGES.LOGIN_SUCCESS,
      { user: userResponse, token }
    );
  })
);

/**
 * @route   GET /api/auth/checkAuth
 * @desc    Check if user is authenticated
 * @access  Private
 */
router.get(
  "/checkAuth",
  protect,
  asyncHandler(async (req, res) => {
    const user = req.user.toJSON();
    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGES.AUTH_VERIFIED,
      { user }
    );
  })
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post(
  "/logout",
  protect,
  asyncHandler(async (req, res) => {
    return sendSuccessResponse(
      res,
      HTTP_STATUS.OK,
      SUCCESS_MESSAGES.LOGOUT_SUCCESS
    );
  })
);

export default router;
