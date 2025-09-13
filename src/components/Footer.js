import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BiLogoTwitter, BiLogoFacebook, BiLogoInstagram } from "react-icons/bi";
import { db } from "../Firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categorySnapshot = await getDocs(collection(db, "lumixing-categories"));
        const categoryList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryList);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch categories");
        console.error(err);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle newsletter form submission
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError = "Please enter a valid email address";
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      await addDoc(collection(db, "lumixing-newsletter"), {
        email,
        subscribedAt: new Date(),
      });
      setSuccess("Thank you for subscribing!");
      setEmail("");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to subscribe. Please try again.");
      console.error(err);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 sm:py-16" data-aos="fade-up">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg shadow-md flex items-center mx-auto max-w-lg">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg shadow-md flex items-center mx-auto max-w-lg">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Lumixing Section */}
          <div className="lg:col-span-2">
            <h5 className="text-xl font-semibold mb-5 text-white">Lumixing</h5>
            <p className="text-gray-300 text-base mb-6 leading-relaxed">
              Your one-stop shop for the latest iPhones, MacBooks, and accessories.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-gray-300 hover:text-blue-400 transition-colors duration-300"
                aria-label="Twitter"
              >
                <BiLogoTwitter />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-gray-300 hover:text-blue-400 transition-colors duration-300"
                aria-label="Facebook"
              >
                <BiLogoFacebook />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl text-gray-300 hover:text-blue-400 transition-colors duration-300"
                aria-label="Instagram"
              >
                <BiLogoInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-xl font-semibold mb-5 text-white">Quick Links</h5>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 text-base hover:text-white transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 text-base hover:text-white transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/category"
                  className="text-gray-300 text-base hover:text-white transition-colors duration-200"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 text-base hover:text-white transition-colors duration-200"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-xl font-semibold mb-5 text-white">Categories</h5>
            {loading ? (
              <p className="text-gray-300 text-base">Loading categories...</p>
            ) : categories.length > 0 ? (
              <ul className="space-y-4">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={category.url}
                      className="text-gray-300 text-base hover:text-white transition-colors duration-200"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-300 text-base">No categories available.</p>
            )}
          </div>

          {/* Newsletter Signup */}
          <div>
            <h5 className="text-xl font-semibold mb-5 text-white">Newsletter</h5>
            <p className="text-gray-300 text-base mb-4">
              Subscribe for the latest deals and updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                aria-label="Email for newsletter"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-300 text-base mb-2">&copy; 2025 Lumixing. All rights reserved.</p>
          <p className="text-gray-400 text-sm">
            Powered by <a href="https://acement.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">Acement</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;