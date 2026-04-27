/**
 * Application Constants
 */

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_REGISTERED: "User registered successfully",
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logged out successfully",
  AUTH_VERIFIED: "Authentication verified",

  PRODUCT_CREATED: "Product created successfully",
  PRODUCT_UPDATED: "Product updated successfully",
  PRODUCT_DELETED: "Product deleted successfully",
  PRODUCTS_RETRIEVED: "Products retrieved successfully",

  CART_RETRIEVED: "Cart retrieved successfully",
  ITEM_ADDED_TO_CART: "Item added to cart successfully",
  CART_UPDATED: "Cart updated successfully",
  ITEM_REMOVED_FROM_CART: "Item removed from cart successfully",

  SAVED_ITEM_ADDED: "Item saved successfully",
  SAVED_ITEM_REMOVED: "Item removed from saved list",
};

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_INPUT: "Invalid input provided",
  UNAUTHORIZED: "Not authorized to perform this action",
  FORBIDDEN: "Access denied",
  NOT_FOUND: "Resource not found",
  ALREADY_EXISTS: "Resource already exists",

  USER_NOT_FOUND: "User not found",
  USER_ALREADY_EXISTS: "User already exists with this email",
  INVALID_CREDENTIALS: "Invalid email or password",
  INVALID_TOKEN: "Invalid or expired token",
  TOKEN_REQUIRED: "Authentication token is required",

  PRODUCT_NOT_FOUND: "Product not found",
  INVALID_PRODUCT_DATA: "Invalid product data provided",
  
  CART_NOT_FOUND: "Cart not found",
  INVALID_CART_DATA: "Invalid cart data provided",

  INTERNAL_ERROR: "Internal server error",
};

// Database
export const DB_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 5000,
};

// JWT
export const JWT_CONFIG = {
  EXPIRY: "7d",
};
