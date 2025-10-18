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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
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
        console.error("Failed to fetch categories:", err);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <footer className="bg-gradient-to-b from-[#4A5D23] to-[#3A4A1C] text-[#F5F5F5] py-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h5 className="text-lg font-serif font-bold mb-4 text-[#F5F5F5]">
              S-TONE Cosmetics
            </h5>
            <p className="text-[#F5F5F5] text-sm font-sans leading-relaxed mb-4">
              Your premier destination for premium lashes, nails, and
              semi-permanent makeup. Free shipping to Ghana on orders over ₵1000
              plus free brow mapping tools!
            </p>
            <div className="flex space-x-3">
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
                  className="p-2 rounded-full bg-[#F5F5F5] hover:bg-[#E0E0E0] transition-colors duration-300 text-lg"
                >
                  <Icon className="text-[#4A5D23]" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h5 className="text-base font-serif font-semibold mb-4 text-[#F5F5F5] border-l-4 border-[#F5F5F5] pl-3">
              Shop
            </h5>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-[#F5F5F5] text-sm font-sans hover:text-[#E0E0E0] transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              {loading ? (
                <li className="text-[#F5F5F5] text-sm font-sans">
                  Loading categories...
                </li>
              ) : (
                categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={category.url}
                      className="text-[#F5F5F5] text-sm font-sans hover:text-[#E0E0E0] transition-colors duration-300"
                    >
                      ➤ {category.name}
                    </Link>
                    {category.subcategories.map((subcat) => (
                      <Link
                        key={subcat.id}
                        to={subcat.url}
                        className="text-[#F5F5F5] text-sm font-sans hover:text-[#E0E0E0] transition-colors duration-300 block pl-4"
                      >
                        - {subcat.name}
                      </Link>
                    ))}
                  </li>
                ))
              )}
              {[
                { name: "Kits", url: "/kits" },
                { name: "Glam Guide", url: "/glam-guide" },
                { name: "Learning Portal", url: "/learning-portal" },
              ].map((item) => (
                <li key={item.url}>
                  <Link
                    to={item.url}
                    className="text-[#F5F5F5] text-sm font-sans hover:text-[#E0E0E0] transition-colors duration-300"
                  >
                    ➤ {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Helpful Links */}
          <div>
            <h5 className="text-base font-serif font-semibold mb-4 text-[#F5F5F5] border-l-4 border-[#F5F5F5] pl-3">
              Helpful Links
            </h5>
            <ul className="space-y-2">
              {[
                { name: "FAQs", url: "/faqs" },
                { name: "Testimonials", url: "/testimonials" },
                { name: "Partner with us", url: "/partner" },
                { name: "Our Story", url: "/our-story" },
                { name: "Join the List", url: "/join-the-list" },
              ].map((link) => (
                <li key={link.url}>
                  <Link
                    to={link.url}
                    className="text-[#F5F5F5] text-sm font-sans hover:text-[#E0E0E0] transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h5 className="text-base font-serif font-semibold mb-4 text-[#F5F5F5] border-l-4 border-[#F5F5F5] pl-3">
              Contact Us
            </h5>
            <ul className="space-y-3">
              <li className="flex items-start">
                <BiMap className="text-xl mr-2 text-[#F5F5F5] mt-1" />
                <span className="text-[#F5F5F5] text-sm font-sans">
                  <strong>UK Head Office</strong>
                  <br />
                  S-TONE Cosmetics, Shaguns International Ltd, Imagestor, Palace
                  Gates, Bridge Rd, London N22 7SN, United Kingdom
                </span>
              </li>
              <li className="flex items-center">
                <BiPhone className="text-xl mr-2 text-[#F5F5F5]" />
                <a
                  href="tel:+447545371740"
                  className="text-[#F5F5F5] text-sm font-sans hover:underline"
                >
                  +44 7545 371740
                </a>
              </li>
              <li className="flex items-start">
                <BiMap className="text-xl mr-2 text-[#F5F5F5] mt-1" />
                <span className="text-[#F5F5F5] text-sm font-sans">
                  <strong>Turkey Regional Office</strong>
                  <br />
                  S-TONE Cosmetics, Coins de beaute chez Fikirtepe, Mandira
                  Caddeci, 34720 Evinpark, Kadikoy/Istanbul, Türkiye
                </span>
              </li>
              <li className="flex items-center">
                <BiPhone className="text-xl mr-2 text-[#F5F5F5]" />
                <a
                  href="tel:+905314566604"
                  className="text-[#F5F5F5] text-sm font-sans hover:underline"
                >
                  +90 531 456 6604
                </a>
              </li>
              <li className="flex items-center">
                <BiEnvelope className="text-xl mr-2 text-[#F5F5F5]" />
                <a
                  href="mailto:info@stonecosmetics.com"
                  className="text-[#F5F5F5] text-sm font-sans hover:underline"
                >
                  info@stonecosmetics.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-10 pt-6 border-t border-[#F5F5F5]/30">
          <h5 className="text-base font-serif font-semibold mb-4 text-[#F5F5F5] text-center">
            Join Our Newsletter
          </h5>
          <p className="text-[#F5F5F5] text-sm font-sans text-center mb-4">
            Stay up to date with the new collections, products, and exclusive
            offers.
          </p>
          <form className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="w-full p-2 border border-[#F5F5F5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5F5F5] bg-white text-gray-700 text-sm font-sans"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-[#F5F5F5] text-[#4A5D23] rounded-lg hover:bg-[#E0E0E0] transition-colors duration-300 text-sm font-sans"
            >
              Subscribe
            </button>
          </form>
          {/* Blogs */}
          <div className="mt-6">
            <h5 className="text-base font-serif font-semibold mb-4 text-[#F5F5F5] text-center">
              Blogs
            </h5>
            <ul className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 text-center">
              {[
                {
                  name: "The Ultimate Guide to Choosing...",
                  url: "/blog/ultimate-guide",
                },
                {
                  name: "Drill Bit Symphony: The Ultimate...",
                  url: "/blog/drill-bit-symphony",
                },
                {
                  name: "Nail It, Lash It, Own...",
                  url: "/blog/nail-it-lash-it",
                },
              ].map((blog) => (
                <li key={blog.url}>
                  <Link
                    to={blog.url}
                    className="text-[#F5F5F5] text-sm font-sans hover:text-[#E0E0E0] transition-colors duration-300"
                  >
                    {blog.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-4 border-t border-[#F5F5F5]/30 text-center">
          <p className="text-[#F5F5F5] text-sm font-sans">
            &copy; 2025 <span className="font-semibold">S-TONE Cosmetics</span>.
            All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center mt-2 space-y-1 sm:space-y-0 sm:space-x-4">
            <p className="text-sm text-[#F5F5F5] font-sans">
              Powered by{" "}
              <a
                href="http://wa.me/233559370174"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5F5F5] hover:underline"
              >
                Acement
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
