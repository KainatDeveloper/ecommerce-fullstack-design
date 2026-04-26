import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../HeroSection/HeroSection";
import CategoriesSection from "../CategoriesSection/CategoriesSection";
import { useProductStore } from "../../stores/product.store";
import { useCartStore } from "../../stores/cart.store";
import { ShoppingCart, Star } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { products, getAllProducts, loading } = useProductStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  const featuredProducts = products.slice(0, 4);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category.name}`);
  };

  const handleAddToCart = async (e, productId) => {
    e.stopPropagation();
    await addToCart(productId);
  };

  return (
    <div>
      <HeroSection
        onButtonClick={() => navigate("/products")}
      />

      <CategoriesSection onCategoryClick={handleCategoryClick} />

      {/* Featured Products Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Handpicked items just for you
            </p>
          </div>

          {loading && products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {featuredProducts.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2 cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    <img
                      src={product.image || "https://via.placeholder.com/300x300"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${
                            i < Math.floor(product.rating || 4)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-blue-600">
                        ${product.price?.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(e, product._id)}
                        className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <button
              onClick={() => navigate("/products")}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
