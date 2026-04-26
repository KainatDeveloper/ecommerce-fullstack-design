import { useEffect } from "react";
import { Trash2, Heart } from "lucide-react";
import { useCartStore } from "../../stores/cart.store";
import { useSaveForLaterStore } from "../../stores/saveForLater.store";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, getCartItems, deleteCartItem, updateCArtItem, isLoading } =
    useCartStore();
  const { addToSaveForLater } = useSaveForLaterStore();

  useEffect(() => {
    getCartItems();
  }, [getCartItems]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * (item.quantity || 1),
    0
  );
  const discount = subtotal * 0.1; // 10% discount
  const tax = (subtotal - discount) * 0.1; // 10% tax
  const total = subtotal - discount + tax;

  const handleRemove = async (productId) => {
    await deleteCartItem(productId);
  };

  const handleSaveForLater = async (productId) => {
    await addToSaveForLater(productId);
    await deleteCartItem(productId);
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCArtItem(productId, newQuantity);
  };

  if (isLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          My cart ({cartItems.length})
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex flex-col sm:flex-row gap-4 pb-6 border-b last:border-b-0 last:pb-0"
                  >
                    {/* Product Image */}
                    <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={item.product?.image || "https://via.placeholder.com/100"}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.product?.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Size: medium, Color: blue, Material: Plastic
                      </p>
                      <p className="text-sm text-gray-500">
                        Seller: {item.product?.seller || "Unknown"}
                      </p>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex flex-col items-end gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          ${(item.product?.price || 0).toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Control */}
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product._id,
                              item.quantity - 1
                            )
                          }
                          className="px-2 py-1 text-gray-600 hover:text-gray-900"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product._id,
                              item.quantity + 1
                            )
                          }
                          className="px-2 py-1 text-gray-600 hover:text-gray-900"
                        >
                          +
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRemove(item.product._id)}
                          className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-1"
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                        <button
                          onClick={() => handleSaveForLater(item.product._id)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1"
                        >
                          <Heart size={16} /> Save for later
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Back to Shop */}
              <Link
                to="/products"
                className="inline-block mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-300"
              >
                ← Back to shop
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Coupon */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Have a coupon?</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add coupon"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-red-600 font-semibold">
                    <span>Discount:</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Tax:</span>
                    <span>+${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between text-2xl font-bold text-gray-900 border-t border-gray-200 pt-4 mb-6">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {/* Checkout Button */}
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition duration-300 mb-4">
                  Checkout
                </button>

                {/* Payment Methods */}
                <div className="flex gap-2 justify-center items-center pt-4 border-t border-gray-200">
                  <img src="https://via.placeholder.com/30x20" alt="visa" />
                  <img src="https://via.placeholder.com/30x20" alt="mastercard" />
                  <img src="https://via.placeholder.com/30x20" alt="paypal" />
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3">
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                  <p className="text-sm font-semibold text-gray-900">
                    🔒 Secure payment
                  </p>
                  <p className="text-xs text-gray-600">Hope you ever finally just</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                  <p className="text-sm font-semibold text-gray-900">
                    💬 Customer support
                  </p>
                  <p className="text-xs text-gray-600">Hope you ever finally just</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4 text-center">
                  <p className="text-sm font-semibold text-gray-900">
                    🚚 Free delivery
                  </p>
                  <p className="text-xs text-gray-600">Hope you ever finally just</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
