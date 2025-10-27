import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTag, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";

const PromoCards = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -5, transition: { duration: 0.3 } },
  };

  // Fetch all products and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all categories
        const categorySnapshot = await getDocs(
          collection(db, "s-tone-categories")
        );
        const categoryData = categorySnapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data().name;
          return acc;
        }, {});

        // Fetch all products
        const productsSnapshot = await getDocs(
          collection(db, "s-tone-products")
        );
        const productsList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          rating: doc.data().rating || 4.5, // Use actual rating if available; otherwise, mock rating
          link: `/product-details/${doc.id}`,
        }));

        setCategories(categoryData);
        setProducts(productsList);
        setLoading(false);
      } catch (err) {
        console.error("[DEBUG] Error fetching products:", err);
        let errorMessage = "Failed to load products. Please try again.";
        if (err.code === "permission-denied") {
          errorMessage =
            "Access denied: Insufficient permissions to view products.";
        }
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400 w-4 h-4" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-yellow-400 w-4 h-4" />
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 w-4 h-4" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-whitesmoke flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-t-4 border-[#4A5D23] rounded-full"
        ></motion.div>
      </section>
    );
  }

  return (
    <section className="py-12 lg:py-16 bg-whitesmoke">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-3xl sm:text-4xl font-serif font-bold text-[#4A5D23] mb-8 text-center"
        >
          Our Products
        </motion.h2>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm max-w-4xl mx-auto"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto"
        >
          {products.length === 0 ? (
            <motion.p
              variants={cardVariants}
              className="col-span-full text-center text-gray-600 text-sm font-sans"
            >
              No products found.
            </motion.p>
          ) : (
            products.map((product, index) => (
              <motion.div
                key={product.id}
                variants={cardVariants}
                whileHover="hover"
              >
                <Link
                  to={product.link}
                  className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg w-full max-w-none mx-auto"
                >
                  <div className="w-full h-32 sm:h-40 flex items-center justify-center bg-whitesmoke">
                    <img
                      src={
                        product.images[0]?.url ||
                        "https://via.placeholder.com/150"
                      }
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-bold text-[#4A5D23] mb-1 flex items-center">
                      <FaTag className="text-[#4A5D23] mr-1.5 w-4 h-4" />
                      <span>{product.title}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2 font-medium tracking-wide">
                      {categories[product.categoryId] || "Unknown Category"}
                    </p>
                    <div className="flex items-center mb-2">
                      {renderStars(product.rating)}
                      <span className="ml-2 text-xs sm:text-sm text-gray-600">
                        ({product.rating})
                      </span>
                    </div>
                    <p className="text-[#4A5D23] text-xs sm:text-sm font-semibold mb-2">
                      Price: <span>${product.price.toFixed(2)}</span>
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PromoCards;
