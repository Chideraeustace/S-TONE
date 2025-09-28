import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BiLogoTwitter,
  BiLogoFacebook,
  BiLogoInstagram,
  BiMap,
  BiPhone,
  BiEnvelope,
} from "react-icons/bi";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categorySnapshot = await getDocs(
          collection(db, "lumixing-categories")
        );
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

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 py-14 sm:py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg shadow-md flex items-center mx-auto max-w-lg">
            <span className="font-semibold">⚠️ {error}</span>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h5 className="text-2xl font-bold mb-4 text-white">Lumixing</h5>
            <p className="text-gray-400 leading-relaxed mb-6">
              Your one-stop shop for the latest iPhones, MacBooks, and premium
              accessories.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: BiLogoTwitter, link: "https://twitter.com" },
                { icon: BiLogoFacebook, link: "https://facebook.com" },
                { icon: BiLogoInstagram, link: "https://instagram.com" },
              ].map(({ icon: Icon, link }, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-800 hover:bg-blue-500 transition-colors duration-300 text-xl"
                >
                  <Icon className="text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-lg font-semibold mb-5 text-white border-l-4 border-blue-500 pl-3">
              Quick Links
            </h5>
            <ul className="space-y-3">
              {[
                { name: "Home", to: "/" },
                { name: "About", to: "/about" },
                { name: "Shop", to: "/category" },
                { name: "Contact", to: "/contact" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="hover:text-blue-400 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-lg font-semibold mb-5 text-white border-l-4 border-blue-500 pl-3">
              Categories
            </h5>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : categories.length > 0 ? (
              <ul className="space-y-3">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={category.url}
                      className="hover:text-blue-400 transition-colors duration-300"
                    >
                      ➤ {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No categories available.</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-lg font-semibold mb-5 text-white border-l-4 border-blue-500 pl-3">
              Contact Us
            </h5>
            <ul className="space-y-4">
              <li className="flex items-center">
                <BiPhone className="text-2xl mr-3 text-blue-400" />
                <a href="tel:+8613527956171" className="hover:underline">
                  +861 352 795 6171
                </a>
              </li>
              <li className="flex items-center">
                <BiEnvelope className="text-2xl mr-3 text-blue-400" />
                <a
                  href="mailto:Lumixing.shop@gmail.com"
                  className="hover:underline"
                >
                  info@lumixing.com
                </a>
              </li>
              <li className="flex items-center">
                <BiMap className="text-2xl mr-3 text-blue-400" />
                <span>
                  1 Zhaojiabang Road, Xuhui District .
                  <br /> Shanghai, China
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400">
            &copy; 2025{" "}
            <span className="text-white font-semibold">Lumixing</span>. All
            rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center mt-1 space-y-1 sm:space-y-0 sm:space-x-4">
            <p className="text-sm text-gray-500">
              Powered by{" "}
              <a
                href="http://wa.me/233559370174"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                Acement
              </a>
            </p>
            <span className="text-sm text-gray-500">|</span>
            <p className="text-sm text-gray-500 flex items-center space-x-1">
              Sponsored by{" "}
              <a
                href="https://www.alibaba.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 hover:underline"
              >
                <img
                  src="data:image/png;base64,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"
                  alt="Alibaba"
                  className="h-4 w-auto"
                />
                <span>Alibaba</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
