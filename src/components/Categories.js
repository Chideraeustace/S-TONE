import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { db } from "../Firebase"; // Adjust the path to your Firebase config
import { collection, getDocs } from "firebase/firestore";

const Category = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categorySnapshot = await getDocs(
          collection(db, "s-tone-categories")
        );
        const categoriesData = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter top-level categories and associate subcategories
        const topLevelCategories = categoriesData
          .filter((cat) => !cat.isSubcategory)
          .map((category) => ({
            ...category,
            subcategories: categoriesData.filter(
              (subcat) =>
                subcat.isSubcategory && subcat.parentCategoryId === category.id
            ),
          }));

        setCategories(topLevelCategories);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch all products
        const productSnapshot = await getDocs(
          collection(db, "s-tone-products")
        );
        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (err) {
        setError("Failed to fetch products");
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  // Determine selected category based on URL
  useEffect(() => {
    const path = location.pathname;
    const matchedCategory = categories
      .flatMap((cat) => [
        { ...cat, isSubcategory: false },
        ...cat.subcategories.map((subcat) => ({
          ...subcat,
          parentName: cat.name,
        })),
      ])
      .find((cat) => cat.url === path);

    if (matchedCategory) {
      setSelectedCategory(matchedCategory.id);
    } else {
      setSelectedCategory("all");
    }
  }, [location.pathname, categories]);

  // Filter categories and products based on search term
  const filteredCategories = categories
    .map((category) => ({
      ...category,
      subcategories: category.subcategories.filter((subcat) =>
        subcat.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.subcategories.length > 0
    );

  const filteredProducts =
    selectedCategory === "all"
      ? products.filter(
          (product) =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : products
          .filter((product) =>
            categories
              .flatMap((cat) => [
                { id: cat.id, isSubcategory: false },
                ...cat.subcategories,
              ])
              .find((cat) => cat.id === selectedCategory)?.isSubcategory
              ? product.subcategoryId === selectedCategory
              : product.categoryId === selectedCategory
          )
          .filter(
            (product) =>
              product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
          );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-cream-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-cream-100 flex items-center justify-center">
        <div className="p-3 bg-red-100 text-red-800 rounded-lg flex items-center">
          <svg
            className="w-5 h-5 mr-2"
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

  // Find the current category or subcategory for the title
  const currentCategory = categories
    .flatMap((cat) => [
      { ...cat, isSubcategory: false },
      ...cat.subcategories.map((subcat) => ({
        ...subcat,
        parentName: cat.name,
      })),
    ])
    .find((cat) => cat.id === selectedCategory);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 bg-gradient-to-b from-white-50 to-cream-100">
      <h1
        className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-8 text-center tracking-tight"
        data-aos="fade-up"
      >
        {currentCategory
          ? currentCategory.isSubcategory
            ? `${currentCategory.parentName} - ${currentCategory.name}`
            : currentCategory.name
          : "Discover Our Luxe Collection"}
      </h1>

      {/* Search Bar and Category Dropdown */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
        <div className="relative w-full sm:w-1/2">
          <input
            type="text"
            placeholder="Search products or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-gray-700 placeholder-gray-400 transition-all duration-300"
          />
          <svg
            className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-1/2 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5D23] bg-white text-gray-700 transition-all duration-300"
        >
          <option value="all">All Products</option>
          {filteredCategories.map((category) => (
            <optgroup
              key={category.id}
              label={category.name}
              className="font-semibold text-gray-800"
            >
              <option value={category.id} className="font-normal">
                {category.name}
              </option>
              {category.subcategories.map((subcategory) => (
                <option
                  key={subcategory.id}
                  value={subcategory.id}
                  className="pl-4"
                >
                  {subcategory.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-md transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative flex items-center justify-center bg-white p-4">
                <img
                  src={
                    product.images?.[0]?.url ||
                    "https://via.placeholder.com/150"
                  }
                  alt={product.title}
                  className="w-full h-48 object-contain transition-transform duration-300 hover:scale-105"
                />
                {product.quantity <= 5 && (
                  <span
                    className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full ${
                      product.quantity === 0
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {product.quantity === 0 ? "Sold Out" : "Low Stock"}
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1 truncate font-serif">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-gray-800 text-lg font-bold mb-2 font-sans">
                    ₵{product.price ? product.price.toFixed(2) : "N/A"}
                  </p>
                </div>
                <Link
                  to={`/product-details/${product.id}`}
                  className={`inline-block px-4 py-1 rounded-full font-medium text-xs transition-colors duration-300 ${
                    product.quantity === 0
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-[#4A5D23] text-white hover:bg-pink-600"
                  } text-center`}
                  aria-disabled={product.quantity === 0}
                  onClick={(e) => product.quantity === 0 && e.preventDefault()}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center col-span-full font-serif text-base">
            No products found for your search.
          </p>
        )}
      </div>
    </div>
  );
};

export default Category;
