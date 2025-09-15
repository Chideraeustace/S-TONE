import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../Firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
} from "firebase/firestore";

const Cards = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        // Fetch all categories
        const categorySnapshot = await getDocs(
          collection(db, "lumixing-categories")
        );
        const categories = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch one product per category
        const productList = [];
        for (const category of categories) {
          const q = query(
            collection(db, "lumixing-product"),
            where("categoryId", "==", category.id),
            orderBy("createdAt", "desc"),
            limit(1)
          );
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const product = querySnapshot.docs[0];
            productList.push({
              id: product.id,
              ...product.data(),
            });
          }
        }

        setProducts(productList);
        setLoading(false);
      } catch (err) {
        if (
          err.code === "failed-precondition" &&
          err.message.includes("index")
        ) {
          setError(
            "Firestore query requires an index. Please create it in the Firebase Console."
          );
        } else {
          setError("Failed to fetch products from categories");
        }
        console.error(err);
        setLoading(false);
      }
    };

    fetchProductsByCategory();
  }, []);

  if (loading) {
    return (
      <div className="py-12 bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 bg-white flex items-center justify-center">
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
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold text-gray-900 text-center sm:text-left"
            data-aos="fade-up"
          >
            Explore More
          </h2>
          <Link
            to="/category"
            className="mt-4 sm:mt-0 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium text-sm sm:text-base hover:bg-blue-700 transition-colors duration-200"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex items-center justify-center bg-white">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-48 object-contain"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 truncate">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-gray-600 text-sm sm:text-base mb-4">
                    ₵{product.price ? product.price.toFixed(2) : "N/A"}
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
              No products available in any category.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Cards;
