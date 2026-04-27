import React, { useState } from "react";
import { useInquiryStore } from "../../stores/inquiry.store";
import { useAuthStore } from "../../stores/auth.store";
import toast from "react-hot-toast";

export default function SectionInquiry() {
  const { createInquiry, loading } = useInquiryStore();
  const { authUser } = useAuthStore();
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    quantity: "",
    unit: "Pcs",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.itemName.trim()) {
      newErrors.itemName = "Item name is required";
    } else if (formData.itemName.trim().length < 3) {
      newErrors.itemName = "Item name must be at least 3 characters";
    } else if (formData.itemName.length > 100) {
      newErrors.itemName = "Item name cannot exceed 100 characters";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
    }

    if (!formData.quantity || parseInt(formData.quantity) < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }

    const validUnits = ["Pcs", "Kg", "Meter", "Box", "Dozen", "Ton", "Liter", "Set"];
    if (!validUnits.includes(formData.unit)) {
      newErrors.unit = "Invalid unit selected";
    }

    return newErrors;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!authUser) {
      toast.error("Please login to send an inquiry");
      return;
    }

    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await createInquiry({
        itemName: formData.itemName.trim(),
        description: formData.description.trim(),
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
      });

      // Reset form on success
      setFormData({
        itemName: "",
        description: "",
        quantity: "",
        unit: "Pcs",
      });
      setErrors({});
    } catch (error) {
      console.error("Error sending inquiry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle mobile submit
  const handleMobileSubmit = () => {
    if (!authUser) {
      toast.error("Please login to send an inquiry");
      return;
    }
    // Could open a modal or redirect to full form
    toast.info("Please use the desktop view to send inquiry or tap the form");
  };

  return (
    <div className="w-full max-w-[1180px] h-[150px] lg:h-[446px] mt-4 flex flex-col md:flex-row relative justify-between md:justify-normal p-0 gap-0 container border border-gray-300 rounded bg-base-100 overflow-hidden">
      <img
        className="object-cover w-full scale-x-[-1]"
        src="/Image/inc.png"
        alt="Inquiry background"
      />
      <div
        style={{
          background:
            "linear-gradient(94.99deg, #2C7CF1 7.19%, rgba(0, 209, 255, 0.5) 89.49%)",
        }}
        className="w-full h-full absolute z-10"
      ></div>
      <div className="w-full h-full bg-transparent absolute z-20 flex justify-between p-7 md:p-12">
        <div className="w-[217px] lg:w-[440px] space-y-3 text-white">
          <div className="text-[17px] font-semibold lg:text-[32px] lg:leading-9">
            An easy way to send requests to all suppliers
          </div>
          <p className="hidden lg:block w-[400px]">
            Get quotes from multiple suppliers instantly. Compare prices and delivery times to find the best deal for your items.
          </p>
          <button
            onClick={handleMobileSubmit}
            className="text-xs p-2 rounded active:bg-blue-950 active:scale-y-90 cursor-pointer bg-blue-700 lg:hidden hover:bg-blue-800 transition"
            disabled={!authUser || isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send inquiry"}
          </button>
        </div>

        {/* Desktop Form */}
        <form
          onSubmit={handleSubmit}
          className="hidden lg:block w-[491px] h-auto max-h-[346px] bg-white rounded p-5 space-y-4 overflow-y-auto"
        >
          <h1 className="text-[20px] font-bold text-gray-900">Send quote to suppliers</h1>

          {/* Item Name Input */}
          <div>
            <input
              type="text"
              name="itemName"
              placeholder="What item you need?"
              value={formData.itemName}
              onChange={handleInputChange}
              className={`input input-md w-full outline-none border ${
                errors.itemName ? "border-red-500" : "border-gray-300"
              }`}
              disabled={!authUser}
            />
            {errors.itemName && (
              <p className="text-xs text-red-500 mt-1">{errors.itemName}</p>
            )}
          </div>

          {/* Description Textarea */}
          <div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Type more details (optional)"
              className={`textarea w-full outline-none border resize-none h-24 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              disabled={!authUser}
            ></textarea>
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/1000
            </p>
          </div>

          {/* Quantity and Unit */}
          <div className="flex space-x-2">
            <div className="flex-1">
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                className={`input w-full outline-none border ${
                  errors.quantity ? "border-red-500" : "border-gray-300"
                }`}
                disabled={!authUser}
              />
              {errors.quantity && (
                <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>
              )}
            </div>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              className={`select w-[120px] outline-none border ${
                errors.unit ? "border-red-500" : "border-gray-300"
              }`}
              disabled={!authUser}
            >
              <option value="Pcs">Pcs</option>
              <option value="Kg">Kg</option>
              <option value="Meter">Meter</option>
              <option value="Box">Box</option>
              <option value="Dozen">Dozen</option>
              <option value="Ton">Ton</option>
              <option value="Liter">Liter</option>
              <option value="Set">Set</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!authUser || isSubmitting || loading}
            className={`btn w-full text-white font-semibold transition ${
              authUser && !isSubmitting && !loading
                ? "bg-blue-600 hover:bg-blue-700 active:scale-y-95"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isSubmitting || loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Sending...
              </>
            ) : !authUser ? (
              "Login to Send Inquiry"
            ) : (
              "Send Inquiry"
            )}
          </button>

          {/* Auth Info */}
          {!authUser && (
            <p className="text-xs text-gray-500 text-center">
              Please login to send inquiries to suppliers
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
