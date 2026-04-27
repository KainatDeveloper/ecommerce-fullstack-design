import { Link } from "react-router-dom";
import { useState } from "react";
import { useCartStore } from "../../stores/cart.store";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addToCart } = useCartStore();
  const [isHovered, setIsHovered] = useState(false);

  if (!product) return null;

  const calculateDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return (price * (100 - discount)) / 100;
  };

  const discountedPrice = calculateDiscountedPrice(product.price, product.discount);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success("Added to cart!");
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="h-full w-full border border-gray-300 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white cursor-pointer flex flex-col"
    >
      {/* Image Container */}
      <div
        className="relative overflow-hidden bg-gray-100 flex items-center justify-center"
        style={{ aspectRatio: "1" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm">
            -{product.discount}%
          </div>
        )}

        {/* Stock Status */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}

        {/* Add to Cart Button (appears on hover) */}
        {isHovered && product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 left-2 right-2 btn btn-sm btn-primary text-white"
          >
            Add to Cart
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-blue-600">
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${discountedPrice.toFixed(2)}
          </span>
          {product.discount > 0 && (
            <span className="text-sm text-gray-500 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Indicator */}
        <p className="text-xs mt-1">
          {product.stock > 0 ? (
            <span className="text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-red-600 font-medium">Out of Stock</span>
          )}
        </p>
      </div>
    </Link>
  );
}
