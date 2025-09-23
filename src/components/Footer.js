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
          <p className="text-sm text-gray-500 mt-1">
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
