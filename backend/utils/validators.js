/**
 * Input Validation Utilities
 */

/**
 * Validate email format
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Minimum 6 characters
 */
const validatePassword = (password) => {
  return password && password.length >= 6;
};

/**
 * Validate product data
 */
const validateProductData = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("Product name is required");
  }

  if (!data.price || typeof data.price !== "number" || data.price < 0) {
    errors.push("Valid product price is required");
  }

  if (!data.image || data.image.trim() === "") {
    errors.push("Product image is required");
  }

  if (!data.category || data.category.trim() === "") {
    errors.push("Product category is required");
  }

  if (data.discount !== undefined) {
    if (typeof data.discount !== "number" || data.discount < 0 || data.discount > 100) {
      errors.push("Discount must be between 0 and 100");
    }
  }

  if (data.stock !== undefined) {
    if (typeof data.stock !== "number" || data.stock < 0) {
      errors.push("Stock must be a non-negative number");
    }
  }

  return errors;
};

/**
 * Validate user registration data
 */
const validateUserRegistration = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === "") {
    errors.push("Name is required");
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push("Valid email is required");
  }

  if (!validatePassword(data.password)) {
    errors.push("Password must be at least 6 characters");
  }

  return errors;
};

/**
 * Validate user login data
 */
const validateUserLogin = (data) => {
  const errors = [];

  if (!data.email || !validateEmail(data.email)) {
    errors.push("Valid email is required");
  }

  if (!data.password) {
    errors.push("Password is required");
  }

  return errors;
};

/**
 * Validate MongoDB ObjectId
 */
const validateObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export {
  validateEmail,
  validatePassword,
  validateProductData,
  validateUserRegistration,
  validateUserLogin,
  validateObjectId,
};
