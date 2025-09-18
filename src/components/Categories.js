import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";

const Category = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categorySnapshot = await getDocs(
          collection(db, "lumixing-categories")
        );
        const categoryList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryList);

        // Fetch all products
        const productSnapshot = await getDocs(
          collection(db, "lumixing-product")
        );
        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.categoryId === selectedCategory);

  // Random verification years (4–10 years)
  const getRandomVerificationYears = () => Math.floor(Math.random() * 7) + 4;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 bg-gray-50">
      <h1
        className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center"
        data-aos="fade-up"
      >
        Shop by Category
      </h1>

      {/* Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-gray-200">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 text-sm sm:text-base font-medium rounded-t-lg transition-colors duration-200 ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 text-sm sm:text-base font-medium rounded-t-lg transition-colors duration-200 ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden transform transition-all duration-300 hover:-translate-y-1 flex flex-row"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="w-1/3 flex items-center justify-center bg-white">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-48 object-contain"
                />
              </div>
              <div className="w-2/3 p-3 sm:p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 truncate">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                    ${product.price ? product.price.toFixed(2) : "N/A"}
                  </p>
                  {/* If Firestore prices are in GHS, convert to USD here:
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">
                    ${(product.price ? (product.price * 0.064).toFixed(2) : "N/A")}
                  </p>
                  */}
                  <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-1 sm:mr-2"
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
                    Verified {getRandomVerificationYears()} yrs ago
                  </div>
                  <p
                    className={`text-xs sm:text-sm mb-2 sm:mb-3 ${
                      product.quantity === 0
                        ? "text-red-600"
                        : product.quantity <= 5
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }`}
                  >
                    {product.quantity === 0
                      ? "Sold Out"
                      : product.quantity <= 5
                      ? "Limited Stock"
                      : `Quantity Left: ${product.quantity}`}
                  </p>
                </div>
                <Link
                  to={`/product-details/${product.id}`}
                  className={`inline-block px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors duration-200 ${
                    product.quantity === 0
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  aria-disabled={product.quantity === 0}
                  onClick={(e) => product.quantity === 0 && e.preventDefault()}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center col-span-full">
            No products found in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default Category;
