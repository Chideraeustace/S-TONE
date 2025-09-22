import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaTag } from "react-icons/fa";

const PromoCards = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categorySnapshot = await getDocs(
          collection(db, "lumixing-categories")
        );
        const categoryList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryList);

        const querySnapshot = await getDocs(collection(db, "lumixing-product"));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products");
        setLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const getRandomVerificationYears = () => Math.floor(Math.random() * 3) + 4;

  const getRandomMinOrders = () => Math.floor(Math.random() * 71) + 30;

  if (loading) {
    return (
      <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <p className="text-gray-700 font-medium text-base">Loading...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <p className="text-red-600 font-semibold text-base">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-1">
          {products.map((product, index) => {
            const verificationYears = getRandomVerificationYears();
            const minOrders = getRandomMinOrders();
            const category = categories.find(
              (c) => c.id === product.categoryId
            );

            return (
              <Link
                key={product.id}
                to={`/product-details/${product.id}`}
                className="bg-white rounded-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 flex flex-col sm:flex-row md:flex-row hover:bg-gray-50"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Image Section */}
                <div className="w-full sm:w-1/3 flex items-center justify-center bg-gray-50">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-32 sm:h-40 object-contain"
                  />
                </div>

                {/* Text Section */}
                <div className="p-3 sm:p-4 w-full sm:w-2/3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 flex items-center">
                      <FaTag className="text-blue-600 mr-1.5 w-4 h-4" />
                      <span>{product.title}</span>
                    </h3>

                    {category && (
                      <p className="text-xs sm:text-sm text-gray-500 mb-2 font-medium tracking-wide">
                        {category.name}
                      </p>
                    )}

                    <p className="text-gray-800 text-sm sm:text-base font-semibold mb-2">
                      Price:{" "}
                      <span className="text-blue-600">
                        ${product.price ? product.price.toFixed(2) : "N/A"}
                      </span>
                    </p>
                    <div className="flex items-center text-xs sm:text-sm mb-2">
                      <span className="inline-flex items-center px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        2 Years Warranty
                      </span>
                    </div>

                    <div className="flex items-center mb-2 text-xs sm:text-sm text-gray-700">
                      <svg
                        className="w-4 h-4 text-green-600 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="font-medium">
                        Verified {verificationYears} yrs ago
                      </span>
                    </div>

                    <p className="text-gray-700 text-xs sm:text-sm font-medium">
                      {minOrders} Sold
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PromoCards;
