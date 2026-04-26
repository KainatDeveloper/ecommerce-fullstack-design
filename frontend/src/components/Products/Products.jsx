import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { useProductStore } from "../../stores/product.store";
import { useCartStore } from "../../stores/cart.store";
import { useSaveForLaterStore } from "../../stores/saveForLater.store";

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, getAllProducts, loading } = useProductStore();
  const { addToCart } = useCartStore();
  const { addToSaveForLater } = useSaveForLaterStore();
  const [selectedCategory, setSelectedCategory] = useState("AllCategory");
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "";

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    }
  }, [urlCategory]);

  const categories = [
    "AllCategory",
    ...new Set(products.map((p) => p.category)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "AllCategory" || product.category === selectedCategory;
    const matchesSearch =
      !urlSearch ||
      product.name.toLowerCase().includes(urlSearch.toLowerCase()) ||
      product.category.toLowerCase().includes(urlSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "AllCategory") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", category);
    }
    setSearchParams(searchParams);
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId);
  };

  const handleSaveForLater = async (productId) => {
    await addToSaveForLater(productId);
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Our Products
          </h1>
          <p className="text-gray-600 text-lg">
            Browse our collection of premium products
          </p>
          {urlSearch && (
            <p className="text-blue-600 mt-2">
              Search results for: "{urlSearch}"
            </p>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Filter by Category
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition duration-300 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-900 border border-gray-300 hover:border-blue-600"
                }`}
              >
                {category === "AllCategory" ? "All Products" : category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No products found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2 cursor-pointer"
                onMouseEnter={() => setHoveredProduct(product._id)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {/* Product Image */}
                <div className="relative h-64 sm:h-72 overflow-hidden bg-gray-200">
                  <img
                    src={product.image || "https://via.placeholder.com/300x300"}
                    alt={product.name}
                    className="w-full h-full object-cover transition duration-300 transform hover:scale-110"
                  />

                  {/* Quick Add Button (appears on hover) */}
                  {hoveredProduct === product._id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product._id);
                      }}
                      className="absolute inset-0 m-auto w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition duration-300 shadow-lg"
                    >
                      <ShoppingCart size={24} />
                    </button>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 truncate">
                    {product.name}
                  </h3>

                  {/* Category */}
                  <p className="text-sm text-gray-500 mb-3">
                    {product.category}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < Math.floor(product.rating || 4)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      ({product.reviews || 0})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                      ${product.price?.toFixed(2) || "0.00"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.description || "High-quality product"}
                  </p>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product._id);
                      }}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2 sm:py-3 rounded-lg transition duration-300 transform hover:scale-105"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveForLater(product._id);
                      }}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 sm:py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2"
                    >
                      <Heart size={18} /> Save for later
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

export default Products;
