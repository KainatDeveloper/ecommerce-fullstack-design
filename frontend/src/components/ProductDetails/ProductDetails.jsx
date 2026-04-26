import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, ArrowLeft, Star, Minus, Plus } from "lucide-react";
import { useProductStore } from "../../stores/product.store";
import { useCartStore } from "../../stores/cart.store";
import { useSaveForLaterStore } from "../../stores/saveForLater.store";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, getAllProducts } = useProductStore();
  const { addToCart } = useCartStore();
  const { addToSaveForLater } = useSaveForLaterStore();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (products.length === 0) {
      getAllProducts();
    }
    setLoading(false);
  }, [products.length, getAllProducts]);

  const product = products.find((p) => p._id === id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Product not found</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    for (let i = 0; i < quantity; i++) {
      await addToCart(product._id);
    }
  };

  const handleSaveForLater = async () => {
    await addToSaveForLater(product._id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-10">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image || "https://via.placeholder.com/600x600"}
                alt={product.name}
                className="w-full h-96 sm:h-[500px] object-cover rounded-lg"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={`${
                        i < Math.floor(product.rating || 4)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  ({product.reviews || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  ${product.price?.toFixed(2)}
                </span>
                {product.stock > 0 ? (
                  <span className="ml-4 text-green-600 font-semibold">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="ml-4 text-red-600 font-semibold">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {product.description || "No description available."}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-gray-700 font-semibold">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={handleSaveForLater}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 px-8 rounded-lg transition duration-300 flex items-center justify-center gap-2"
                >
                  <Heart size={20} />
                  Save for Later
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

