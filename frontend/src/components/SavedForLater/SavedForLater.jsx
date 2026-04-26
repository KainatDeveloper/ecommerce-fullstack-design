import { useEffect } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useSaveForLaterStore } from "../../stores/saveForLater.store";
import { useCartStore } from "../../stores/cart.store";

const SavedForLater = () => {
  const { saveForLaterItems, getSaveForLaterItems, removeFromSaveForLater, loading } =
    useSaveForLaterStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    getSaveForLaterItems();
  }, [getSaveForLaterItems]);

  const handleMoveToCart = async (productId) => {
    await addToCart(productId);
    await removeFromSaveForLater(productId);
  };

  const handleRemove = async (productId) => {
    await removeFromSaveForLater(productId);
  };

  if (loading && saveForLaterItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading saved items...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
          Saved for later ({saveForLaterItems.length})
        </h1>

        {saveForLaterItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg">
              You haven't saved any items yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {saveForLaterItems.map((item) => (
              <div
                key={item.product._id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300"
              >
                {/* Product Image */}
                <div className="relative h-64 sm:h-72 bg-gray-200 overflow-hidden">
                  <img
                    src={item.product?.image || "https://via.placeholder.com/300x300"}
                    alt={item.product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                    {item.product?.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4">
                    ${item.product?.price?.toFixed(2) || "0.00"}
                  </p>

                  <div className="space-y-2">
                    <button
                      onClick={() => handleMoveToCart(item.product._id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} /> Move to cart
                    </button>
                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 sm:py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={18} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedForLater;
