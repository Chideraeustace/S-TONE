import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "./CartContext";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { handleAddToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = await getDoc(doc(db, "lumixing-product", productId));
        if (productDoc.exists()) {
          const productData = { id: productDoc.id, ...productDoc.data() };
          productData.quantity =
            typeof productData.quantity === "number" ? productData.quantity : 0;
          productData.title =
            typeof productData.title === "string"
              ? productData.title
              : "Untitled Product";
          productData.description =
            typeof productData.description === "string"
              ? productData.description
              : "No description available";
          productData.imageUrl =
            typeof productData.imageUrl === "string"
              ? productData.imageUrl
              : "https://via.placeholder.com/150";
          productData.price =
            typeof productData.price === "number" ? productData.price : 0;
          setProduct(productData);
          setLoading(false);
        } else {
          setError(`No product found for ID: ${productId}`);
          setLoading(false);
        }
      } catch (err) {
        setError(`Failed to fetch product details: ${err.message}`);
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    } else {
      setError("No product ID provided in the URL");
      setLoading(false);
    }
  }, [productId]);

  const handleQuantityChange = (event) => {
    const value = Math.max(
      1,
      Math.min(Number(event.target.value), product?.quantity || 1)
    );
    setSelectedQuantity(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 bg-red-100 text-red-800 rounded-xl flex items-center shadow-lg">
          <svg
            className="w-8 h-8 mr-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-lg font-medium">
            {error || "Product not found"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden md:flex">
          {/* Product Image Section */}
          <div className="md:w-1/2 p-6 flex items-center justify-center bg-gray-50">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-auto max-h-[500px] object-contain rounded-lg"
            />
          </div>
          {/* Product Details Section */}
          <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
                {product.title}
              </h1>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                {product.description}
              </p>
              {/* Product Status */}
              <div
                className={`flex items-center text-sm font-semibold mb-6 ${
                  product.quantity === 0
                    ? "text-red-600"
                    : product.quantity <= 5
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {product.quantity === 0
                  ? "Sold Out"
                  : product.quantity <= 5
                  ? "Limited Stock"
                  : `In Stock: ${product.quantity}`}
              </div>
              {/* Quantity Selection */}
              <div className="mb-8">
                <label className="text-sm font-medium text-gray-900 block mb-2">
                  Quantity:
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setSelectedQuantity((prev) => Math.max(1, prev - 1))
                    }
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={selectedQuantity <= 0 || product.quantity === 0}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={selectedQuantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.quantity}
                    className="w-16 h-10 text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    disabled={product.quantity === 0}
                  />
                  <button
                    onClick={() =>
                      setSelectedQuantity((prev) =>
                        Math.min(product.quantity, prev + 1)
                      )
                    }
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      selectedQuantity >= product.quantity ||
                      product.quantity === 0
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            {/* Add to Cart Button */}
            <button
              onClick={() => handleAddToCart(product, selectedQuantity)}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                product.quantity === 0 || selectedQuantity < 1
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
              }`}
              disabled={product.quantity === 0 || selectedQuantity < 1}
              aria-label={`Add ${product.title} to cart`}
            >
              <FaShoppingCart />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
