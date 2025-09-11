import { Link } from 'react-router-dom';
import { BiLogoTwitter, BiLogoFacebook, BiLogoInstagram } from 'react-icons/bi';

const Footer = () => (
  <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-12 lg:py-16">
    <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
        <div>
          <h5 className="text-xl font-semibold mb-5 text-white">Lumixing</h5>
          <p className="text-gray-300 text-base mb-6 leading-relaxed">
            Your one-stop shop for the latest iPhones, MacBooks, and accessories.
          </p>
          <div className="flex space-x-6">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-gray-300 hover:text-blue-400 transition-colors duration-300"
            >
              <BiLogoTwitter />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-gray-300 hover:text-blue-400 transition-colors duration-300"
            >
              <BiLogoFacebook />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-gray-300 hover:text-blue-400 transition-colors duration-300"
            >
              <BiLogoInstagram />
            </a>
          </div>
        </div>
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
        <div>
          <h5 className="text-xl font-semibold mb-5 text-white">Support</h5>
          <ul className="space-y-4">
            <li>
              <Link
                to="/contact"
                className="text-gray-300 text-base hover:text-white transition-colors duration-200"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link
                to="/account"
                className="text-gray-300 text-base hover:text-white transition-colors duration-200"
              >
                Order Status
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-300 text-base hover:text-white transition-colors duration-200"
              >
                Returns
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-300 text-base hover:text-white transition-colors duration-200"
              >
                FAQs
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h5 className="text-xl font-semibold mb-5 text-white">Contact Us</h5>
          <p className="text-gray-300 text-base leading-relaxed">
            Email: <a href="mailto:support@applestore.com" className="hover:text-white transition-colors duration-200">support@applestore.com</a>
            <br />
            Phone: <a href="tel:+18002752273" className="hover:text-white transition-colors duration-200">+1 (800) 275-2273</a>
            <br />
            Address: 123 Apple Way, Cupertino, CA
          </p>
        </div>
      </div>
      <div className="mt-12 pt-8 border-t border-gray-700 text-center">
        <p className="text-gray-300 text-base mb-2">&copy; 2025 Lumixing. All rights reserved.</p>
        <p className="text-gray-400 text-sm">Powered by <a href="https://acement.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">Acement</a></p>
      </div>
    </div>
  </footer>
);

export default Footer;