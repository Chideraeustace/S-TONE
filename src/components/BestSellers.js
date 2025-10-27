import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import lashesImage from "../assets/eyelash.webp";
import nailsImage from "../assets/nails.webp";
import semiPermanentImage from "../assets/makeup.webp";

const BestSellers = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const products = [
    {
      id: "lashes",
      title: "Premium Lashes Collection",
      description:
        "Enhance your eyes with our luxurious strip and individual lashes. Free shipping to Ghana on orders over $100 plus free brow mapping tools!",
      imageUrl: lashesImage,
      link: "/category/lashes",
    },
    {
      id: "nails",
      title: "Nails & Press-Ons",
      description:
        "Transform your nails with our vibrant polishes and stylish press-ons. Free shipping to Ghana on orders over $100 plus free brow mapping tools!",
      imageUrl: nailsImage,
      link: "/category/nails",
    },
    {
      id: "semi-permanent",
      title: "Semi-Permanent Makeup",
      description:
        "Achieve flawless brows, eyeliner, and lips with our semi-permanent makeup solutions. Free shipping to Ghana on orders over $100 plus free brow mapping tools!",
      imageUrl: semiPermanentImage,
      link: "/category/semi-permanent",
    },
  ];

  // Auto-slide effect (5 seconds) - Only for mobile/small screens
  useEffect(() => {
    if (products.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % products.length);
      }, 5000); // 5 seconds
      return () => clearInterval(interval); // cleanup
    }
  }, [products]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <section className="py-12 sm:py-16 bg-whitesmoke">
      {/* Container for Centering and Max Width */}
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-bold text-[#4A5D23] mb-8 sm:mb-12 text-center"
          data-aos="fade-up"
        >
          Best Sellers
        </h2>

        {products.length > 0 ? (
          <>
            {/* Mobile/Tablet Slider View (Default/Small screens) */}
            <div className="relative w-full md:hidden">
              {/* Slider Container and Navigation (Original logic) */}
              <div className="overflow-hidden w-full">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className="min-w-full flex flex-col items-center justify-center bg-white overflow-hidden"
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <Link to={product.link} className="w-full">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full max-h-100 sm:max-h-74 md:max-h-70 lg:max-h-96 object-contain"
                        />
                      </Link>
                      <div className="p-4 text-center max-w-2xl mx-auto">
                        <h3 className="text-xl font-semibold text-[#4A5D23] mb-2">
                          {product.title}
                        </h3>
                        <p className="text-gray-600 text-sm sm:text-base mb-4">
                          {product.description}
                        </p>
                        <Link
                          to={product.link}
                          className="inline-block bg-[#4A5D23] text-white px-4 py-2 rounded-lg font-semibold text-sm sm:text-base hover:bg-[#3A4A1C] transition-colors duration-200"
                        >
                          Shop Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Navigation Arrows */}
              {products.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#4A5D23] text-white p-2 rounded-full hover:bg-[#3A4A1C] transition-colors duration-200"
                    aria-label="Previous slide"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#4A5D23] text-white p-2 rounded-full hover:bg-[#3A4A1C] transition-colors duration-200"
                    aria-label="Next slide"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Desktop Grid View (Medium screens and up) with Overlap and Expansion */}
            <div className="hidden md:flex justify-center relative h-[30rem] lg:h-[36rem] px-16">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className={`group absolute w-1/3 h-full overflow-hidden bg-white shadow-xl rounded-xl transition-all duration-500 ease-in-out cursor-pointer hover:shadow-2xl hover:z-30
                    ${index === 0 ? "left-0 z-10" : ""}
                    ${index === 1 ? "z-20" : ""} 
                    ${index === 2 ? "right-0 z-10" : ""}

                    group-hover:w-[45%] group-hover:!z-50
                    ${index === 0 && "hover:translate-x-[50%]"} 
                    ${index === 2 && "hover:-translate-x-[50%]"}
                  `}
                  data-aos="fade-up"
                >
                  <Link to={product.link} className="block w-full h-full">
                    <div className="w-full h-full">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        // MODIFIED: Higher opacity and brightness filter on hover
                        className="w-full h-full object-cover transition-all duration-500 group-hover:opacity-50 group-hover:brightness-50 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center bg-black bg-opacity-0 transition-all duration-500 group-hover:bg-opacity-80">
                      {" "}
                      {/* Slightly less opaque overlay now */}
                      <div className="opacity-0 transform translate-y-8 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                        <h3 className="text-3xl font-extrabold text-[#90ee90] mb-4">
                          {product.title}
                        </h3>
                        <p className="text-gray-200 text-lg mb-8">
                          {product.description}
                        </p>
                        <span className="inline-block bg-[#4A5D23] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-[#3A4A1C] transition-colors duration-200">
                          Shop Now &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-center">No products available.</p>
        )}
      </div>
    </section>
  );
};

export default BestSellers;
