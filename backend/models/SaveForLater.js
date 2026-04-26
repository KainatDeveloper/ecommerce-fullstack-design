import mongoose from "mongoose";

const saveForLaterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const SaveForLater = mongoose.model("SaveForLater", saveForLaterSchema);

export default SaveForLater;

