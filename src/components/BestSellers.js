import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../Firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      try {
        const q = query(
          collection(db, "lumixing-product"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch recent products");
        console.error(err);
        setLoading(false);
      }
    };

    fetchRecentProducts();
  }, []);

  // Auto-slide effect (5 seconds)
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

  if (loading) {
    return (
      <div className="py-12 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 bg-gray-50 flex items-center justify-center">
        <div className="p-4 bg-red-100 text-red-800 rounded-lg flex items-center">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <h2
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center"
          data-aos="fade-up"
        >
          Best Sellers
        </h2>
        {products.length > 0 ? (
          <div className="relative">
            {/* Slider Container */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="min-w-full flex items-center justify-center bg-white rounded-xl overflow-hidden"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <Link to={`/product-details/${product.id}`}>
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-48 object-contain"
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            {/* Navigation Arrows */}
            {products.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
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
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
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
        ) : (
          <p className="text-gray-600 text-center">
            No recent products available.
          </p>
        )}
      </div>
    </section>
  );
};

export default BestSellers;
