const CategoriesSection = ({
  title = "Shop by Category",
  subtitle = "Browse our wide range of products",
  categories = [
    { id: 1, name: "Fashion", icon: "👗" },
    { id: 2, name: "Electronics", icon: "📱" },
    { id: 3, name: "Home", icon: "🏡" },
    { id: 4, name: "Beauty", icon: "💄" },
    { id: 5, name: "Sports", icon: "⚽" },
    { id: 6, name: "Accessories", icon: "👜" },
  ],
  onCategoryClick = null,
}) => {
  const handleCategoryClick = (category) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    }
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-8 text-center cursor-pointer group"
            >
              {/* Icon/Image Container */}
              <div className="mb-6">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 mx-auto object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-300 inline-block">
                    {category.icon}
                  </div>
                )}
              </div>

              {/* Category Name */}
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                {category.name}
              </h3>

              {/* Optional Description */}
              {category.description && (
                <p className="text-gray-600 text-sm mt-2 group-hover:text-gray-700 transition-colors duration-300">
                  {category.description}
                </p>
              )}

              {/* Explore Button (appears on hover) */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-blue-600 font-semibold flex items-center justify-center gap-2">
                  Explore <span className="text-lg">→</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
