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
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 bg-gray-50">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 text-center">
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
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 truncate">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4 line-clamp-2">
                  {product.description}
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
            No products found in this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default Category;
