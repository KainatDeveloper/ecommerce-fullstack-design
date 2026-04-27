import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    itemName: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      minlength: [3, "Item name must be at least 3 characters"],
      maxlength: [100, "Item name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    unit: {
      type: String,
      enum: ["Pcs", "Kg", "Meter", "Box", "Dozen", "Ton", "Liter", "Set"],
      default: "Pcs",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "responded", "completed"],
      default: "pending",
    },
    responses: [
      {
        supplier: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        deliveryTime: {
          type: String,
          required: true,
        },
        message: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
inquirySchema.index({ user: 1, createdAt: -1 });
inquirySchema.index({ status: 1 });

export default mongoose.model("Inquiry", inquirySchema);
