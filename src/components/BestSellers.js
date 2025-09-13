import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../Firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        // Fetch top 4 products, ordered by salesCount (or fallback to latest)
        const q = query(
          collection(db, "lumixing-product"),
          orderBy("salesCount", "desc"), // Fallback: orderBy("createdAt", "desc")
          limit(4)
        );
        const querySnapshot = await getDocs(q);
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch best sellers");
        console.error(err);
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

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
        <div className="p-4 bg-red-100 text-red-800 rounded-lg shadow-md flex items-center">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="p-4 sm:p-6">
                  <h5 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 truncate">
                    {product.title}
                  </h5>
                  <p className="text-gray-600 text-sm sm:text-base mb-4">
                    ${product.price ? product.price.toFixed(2) : "N/A"}
                  </p>
                  <Link
                    to={`/product-details/${product.id}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm sm:text-base hover:bg-blue-700 transition-colors duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-full">
              No best sellers available.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
