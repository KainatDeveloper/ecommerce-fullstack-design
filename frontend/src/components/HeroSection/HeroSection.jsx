const HeroSection = ({
  backgroundImage = "https://images.unsplash.com/photo-1555939594-58d7cb561a1b?w=1200&h=800&fit=crop",
  title = "Shop the Latest Products",
  subtitle = "Discover our exclusive collection of premium products with unbeatable prices and exceptional quality.",
  buttonText = "Shop Now",
  onButtonClick = null,
  overlayOpacity = 50,
}) => {
  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
    >
      {/* Dark Overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300`}
        style={{ opacity: overlayOpacity / 100 }}
      ></div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight drop-shadow-lg">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl xl:text-2xl mb-8 sm:mb-10 text-gray-100 max-w-3xl mx-auto drop-shadow-md leading-relaxed">
          {subtitle}
        </p>

        {/* CTA Button */}
        <button
          onClick={handleButtonClick}
          className="inline-block bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-lg text-base sm:text-lg transition duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          {buttonText}
        </button>
      </div>

      {/* Optional: Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hidden sm:block">
        <svg
          className="w-6 h-6 text-white animate-bounce"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
