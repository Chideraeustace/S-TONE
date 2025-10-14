import { Link } from "react-router-dom";
import {
  BiLogoTwitter,
  BiLogoFacebook,
  BiLogoInstagram,
  BiMap,
  BiPhone,
  BiEnvelope,
} from "react-icons/bi";

const Footer = () => {
  const categories = [
    { id: "lashes", name: "Lashes", url: "/category/lashes" },
    { id: "nails", name: "Nails", url: "/category/nails" },
    {
      id: "semi-permanent",
      name: "Semi-Permanent Makeup",
      url: "/category/semi-permanent",
    },
    { id: "kits", name: "Kits", url: "/kits" },
    { id: "glam-guide", name: "Glam Guide", url: "/glam-guide" },
    { id: "learning-portal", name: "Learning Portal", url: "/learning-portal" },
  ];

  return (
    <footer className="bg-[#4A5D23] text-whitesmoke py-14 sm:py-20">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h5 className="text-2xl font-bold mb-4 text-whitesmoke">
              S-TONE Cosmetics
            </h5>
            <p className="text-whitesmoke leading-relaxed mb-6">
              Your premier destination for premium lashes, nails, and
              semi-permanent makeup. Free shipping to Ghana on orders over $100
              plus free brow mapping tools!
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
                  className="p-2 rounded-full bg-gray-200 hover:bg-whitesmoke hover:text-[#4A5D23] transition-colors duration-300 text-xl"
                >
                  <Icon className="text-[#4A5D23] hover:text-[#4A5D23]" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-lg font-semibold mb-5 text-whitesmoke border-l-4 border-whitesmoke pl-3">
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
                    className="text-whitesmoke hover:text-gray-200 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-lg font-semibold mb-5 text-whitesmoke border-l-4 border-whitesmoke pl-3">
              Categories
            </h5>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    to={category.url}
                    className="text-whitesmoke hover:text-gray-200 transition-colors duration-300"
                  >
                    ➤ {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="text-lg font-semibold mb-5 text-whitesmoke border-l-4 border-whitesmoke pl-3">
              Contact Us
            </h5>
            <ul className="space-y-4">
              <li className="flex items-center">
                <BiPhone className="text-2xl mr-3 text-whitesmoke" />
                <a
                  href="tel:07545371740"
                  className="text-whitesmoke hover:underline"
                >
                  07545371740
                </a>
              </li>
              <li className="flex items-center">
                <BiEnvelope className="text-2xl mr-3 text-whitesmoke" />
                <a
                  href="mailto:info@stonecosmetics.com"
                  className="text-whitesmoke hover:underline"
                >
                  info@stonecosmetics.com
                </a>
              </li>
              <li className="flex items-center">
                <BiMap className="text-2xl mr-3 text-whitesmoke" />
                <span className="text-whitesmoke">
                  S-TONE Cosmetics, Shaguns International Ltd, Imagestor,Palace
                  Gates, Bridge Rd London N22 7SN
                  <br /> United Kingdom
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-gray-400 text-center">
          <p className="text-whitesmoke">
            &copy; 2025{" "}
            <span className="text-whitesmoke font-semibold">
              S-TONE Cosmetics
            </span>
            . All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center mt-1 space-y-1 sm:space-y-0 sm:space-x-4">
            <p className="text-sm text-whitesmoke">
              Powered by{" "}
              <a
                href="http://wa.me/233559370174"
                target="_blank"
                rel="noopener noreferrer"
                className="text-whitesmoke hover:underline"
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
