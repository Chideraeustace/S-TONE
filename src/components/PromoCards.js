import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";

const PromoCards = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products and categories from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categorySnapshot = await getDocs(collection(db, "categories"));
        const categoryList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryList);

        // Fetch products
        const querySnapshot = await getDocs(collection(db, "products"));
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

  // Get category URL by ID
  const getCategoryUrl = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.url : "/category";
  };

  if (loading) {
    return (
      <section className="py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-56 sm:h-64 object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {product.title}
                </h3>
                <p className="text-gray-600 text-base mb-4">
                  {product.description}
                </p>
                <Link
                  to={getCategoryUrl(product.categoryId)}
                  className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-medium text-base hover:bg-blue-700 transition-colors duration-200"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoCards;
