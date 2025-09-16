import { useState, useEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import {
  BiPhone,
  BiDollar,
  BiCheck,
  BiSearch,
  BiUser,
  BiHeart,
  BiCart,
  BiMenu,
  BiChevronDown,
} from "react-icons/bi";
import { useCart } from "./CartContext"; // Import the useCart hook

const Header = () => {
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [iPhoneMenuOpen, setIPhoneMenuOpen] = useState(false);
  const [macBookMenuOpen, setMacBookMenuOpen] = useState(false);
  const [androidMenuOpen, setAndroidMenuOpen] = useState(false);
  const { cart } = useCart(); // Use the cart state from context
  const cartCount = cart.length; // Calculate cartCount from cart array

  const iPhoneMenuRef = useRef(null);
  const macBookMenuRef = useRef(null);
  const androidMenuRef = useRef(null);
  const currencyMenuRef = useRef(null);
  const accountMenuRef = useRef(null);

  // Close mobile nav on link click
  const handleNavLinkClick = () => {
    setMobileNavOpen(false);
    setIPhoneMenuOpen(false);
    setMacBookMenuOpen(false);
    setAndroidMenuOpen(false);
  };

  // Click outside handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        iPhoneMenuRef.current &&
        !iPhoneMenuRef.current.contains(event.target)
      ) {
        setIPhoneMenuOpen(false);
      }
      if (
        macBookMenuRef.current &&
        !macBookMenuRef.current.contains(event.target)
      ) {
        setMacBookMenuOpen(false);
      }
      if (
        androidMenuRef.current &&
        !androidMenuRef.current.contains(event.target)
      ) {
        setAndroidMenuOpen(false);
      }
      if (
        currencyMenuRef.current &&
        !currencyMenuRef.current.contains(event.target)
      ) {
        setCurrencyOpen(false);
      }
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md transition-all duration-300">
      <div className="py-2 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="hidden lg:flex items-center">
              <BiPhone className="mr-2 text-lg text-gray-600" />
              <span className="text-sm text-gray-700">
                Need help? Call us:{" "}
              </span>
              <a
                href="tel:+1800-275-2273"
                className="ml-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                +233 540 000 982
              </a>
            </div>
            <div className="text-center w-full lg:w-auto">
              <Swiper
                modules={[Autoplay]}
                loop={true}
                speed={600}
                autoplay={{ delay: 5000 }}
                slidesPerView={1}
                direction="vertical"
                effect="slide"
                className="h-8 text-sm lg:text-base text-gray-700"
              >
                <SwiperSlide>🚚 Free shipping on orders!!!</SwiperSlide>
                <SwiperSlide>
                  📱 Pre-order iPhone 17 now, get it delivered to you!!!
                </SwiperSlide>
              </Swiper>
            </div>
            <div className="hidden lg:flex justify-end space-x-4">
              <div className="relative" ref={currencyMenuRef}>
                <button
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  className="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <BiDollar className="mr-2 text-lg" />
                  GHS
                </button>
                <ul
                  className={`absolute right-0 bg-white shadow-lg rounded mt-2 w-48 z-50 transition-all duration-200 ${
                    currencyOpen ? "block opacity-100" : "hidden opacity-0"
                  }`}
                >
                  <li>
                    <button className="flex items-center px-4 py-3 hover:bg-gray-50 w-full text-left text-base text-gray-700">
                      <BiCheck className="mr-2 text-lg text-blue-600" />
                      GHS
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="/assets/img/apple-logo.png"
              alt="Lumixing"
              className="h-8 transition-transform hover:scale-105"
            />
          </Link>
          <div
            className={`xl:flex w-1/3 max-w-md ${
              mobileSearchOpen ? "block" : "hidden"
            }`}
          >
            <div className="flex border border-gray-300 rounded-lg w-full bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <input
                type="text"
                className="flex-grow p-2 outline-none text-sm bg-transparent text-gray-700 placeholder-gray-400"
                placeholder="Search for iPhones, MacBooks, and more"
              />
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-r-lg transition-colors">
                <BiSearch className="text-lg text-gray-600" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="xl:hidden text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <BiSearch className="text-lg" />
            </button>
            <div className="relative" ref={accountMenuRef}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <BiUser className="text-xl" />
              </button>
              <div
                className={`absolute right-0 bg-white shadow-lg rounded-lg mt-2 w-64 z-50 transition-all duration-200 ${
                  accountOpen ? "block opacity-100" : "hidden opacity-0"
                }`}
              >
                <div className="p-4 border-b">
                  <h6 className="text-lg font-semibold text-gray-800">
                    Welcome to <span className="font-bold">Lumixing</span>
                  </h6>
                  <p className="mb-0 text-sm text-gray-600">
                    Manage your orders
                  </p>
                </div>
                <div className="p-4 space-y-2">
                  <Link
                    to="/account"
                    onClick={handleNavLinkClick}
                    className="flex items-center py-2 hover:text-blue-600 text-base text-gray-700 transition-colors"
                  >
                    <BiCart className="mr-2 text-lg" />
                    My Orders
                  </Link>
                  <Link
                    to="/account"
                    onClick={handleNavLinkClick}
                    className="flex items-center py-2 hover:text-blue-600 text-base text-gray-700 transition-colors"
                  >
                    <BiHeart className="mr-2 text-lg" />
                    Saved Items
                  </Link>
                </div>
                <div className="p-4 space-y-2"></div>
              </div>
            </div>
            <Link
              to="/account"
              onClick={handleNavLinkClick}
              className="hidden md:block relative text-gray-600 hover:text-blue-600 transition-colors"
            >
              <BiHeart className="text-xl" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 text-xs">
                0
              </span>
            </Link>
            <Link
              to="/cart"
              onClick={handleNavLinkClick}
              className="relative text-gray-600 hover:text-blue-600 transition-colors"
            >
              <BiCart className="text-xl" />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full px-2 text-xs">
                {cartCount}
              </span>
            </Link>
            <BiMenu
              className="xl:hidden text-xl text-gray-600 hover:text-blue-600 cursor-pointer transition-colors"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            />
          </div>
        </div>
      </div>
      <div className="bg-gray-50">
        <div className="container mx-auto px-4">
          <nav
            className={`navmenu ${
              mobileNavOpen
                ? "block w-full min-h-screen bg-white xl:bg-transparent"
                : "hidden xl:block"
            }`}
          >
            <ul className="flex flex-col xl:flex-row space-y-4 xl:space-y-0 xl:space-x-6 py-4">
              <li>
                <NavLink
                  to="/"
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 font-semibold text-base"
                      : "text-gray-700 hover:text-blue-600 text-base transition-colors"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 font-semibold text-base"
                      : "text-gray-700 hover:text-blue-600 text-base transition-colors"
                  }
                >
                  About
                </NavLink>
              </li>
              <li className="relative" ref={iPhoneMenuRef}>
                <button
                  onClick={() => setIPhoneMenuOpen(!iPhoneMenuOpen)}
                  className="flex items-center text-gray-700 hover:text-blue-600 text-base transition-colors"
                >
                  iPhones <BiChevronDown className="ml-1 text-lg" />
                </button>
                <div
                  className={`mobile-megamenu block xl:hidden max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg mt-2 ${
                    iPhoneMenuOpen ? "block" : "hidden"
                  }`}
                >
                  <ul className="flex flex-col">
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        iPhone XR
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        iPhone 11
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        iPhone 12
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        iPhone 13
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        iPhone 14
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        iPhone 15
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        iPhone 16
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        iPhone 16e
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        iPhone 17
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        iPhone 17 Air
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        iPhone 17 Pro
                      </Link>
                    </li>
                  </ul>
                </div>
                <div
                  className={`desktop-megamenu hidden xl:block absolute left-0 bg-white shadow-lg rounded-lg mt-2 w-[600px] p-4 z-50 transition-all duration-200 ${
                    iPhoneMenuOpen ? "block opacity-100" : "hidden opacity-0"
                  }`}
                >
                  <ul className="grid grid-cols-3 gap-4">
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        iPhone XR
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        iPhone 11
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        iPhone 12
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        iPhone 13
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        iPhone 14
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        iPhone 15
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        iPhone 16
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        iPhone 16e
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        iPhone 17
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        iPhone 17 Air
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        iPhone 17 Pro
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="relative" ref={macBookMenuRef}>
                <button
                  onClick={() => setMacBookMenuOpen(!macBookMenuOpen)}
                  className="flex items-center text-gray-700 hover:text-blue-600 text-base transition-colors"
                >
                  MacBooks <BiChevronDown className="ml-1 text-lg" />
                </button>
                <div
                  className={`mobile-megamenu block xl:hidden max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg mt-2 ${
                    macBookMenuOpen ? "block" : "hidden"
                  }`}
                >
                  <ul className="flex flex-col">
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        MacBook Air M4
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        MacBook Pro M4
                      </Link>
                    </li>
                  </ul>
                </div>
                <div
                  className={`desktop-megamenu hidden xl:block absolute left-0 bg-white shadow-lg rounded-lg mt-2 w-[600px] p-4 z-50 transition-all duration-200 ${
                    macBookMenuOpen ? "block opacity-100" : "hidden opacity-0"
                  }`}
                >
                  <ul className="grid grid-cols-2 gap-4">
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        MacBook Air M4
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        MacBook Pro M4
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="relative" ref={androidMenuRef}>
                <button
                  onClick={() => setAndroidMenuOpen(!androidMenuOpen)}
                  className="flex items-center text-gray-700 hover:text-blue-600 text-base transition-colors"
                >
                  Galaxy S <BiChevronDown className="ml-1 text-lg" />
                </button>
                <div
                  className={`mobile-megamenu block xl:hidden max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg mt-2 ${
                    androidMenuOpen ? "block" : "hidden"
                  }`}
                >
                  <ul className="flex flex-col">
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Galaxy S
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Galaxy S II
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Galaxy S III
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Galaxy S4
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Galaxy S5
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Galaxy S6 / S6 Edge
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Galaxy S7 / S7 Edge
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Galaxy S8 / S8+
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Galaxy S9 / S9+
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Galaxy S10e / S10 / S10+ / S10 5G
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S20 / S20+ / S20 Ultra
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S21 / S21+ / S21 Ultra
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S22 / S22+ / S22 Ultra
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S23 / S23+ / S23 Ultra
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S24 / S24+ / S24 Ultra
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S25 / S25+ / S25 Ultra / S25 Edge
                      </Link>
                    </li>
                  </ul>
                </div>
                <div
                  className={`desktop-megamenu hidden xl:block absolute left-0 bg-white shadow-lg rounded-lg mt-2 w-[600px] p-4 z-50 transition-all duration-200 ${
                    androidMenuOpen ? "block opacity-100" : "hidden opacity-0"
                  }`}
                >
                  <ul className="grid grid-cols-3 gap-4">
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S II
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S III
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S4
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S5
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S6 / S6 Edge
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S7 / S7 Edge
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S8 / S8+
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S9 / S9+
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S10e / S10 / S10+ / S10 5G
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S20 / S20+ / S20 Ultra
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S21 / S21+ / S21 Ultra
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S22 / S22+ / S22 Ultra
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S23 / S23+ / S23 Ultra
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S24 / S24+ / S24 Ultra
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/category"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Galaxy S25 / S25+ / S25 Ultra / S25 Edge
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <NavLink
                  to="/category"
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 font-semibold text-base"
                      : "text-gray-700 hover:text-blue-600 text-base transition-colors"
                  }
                >
                  Shop
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 font-semibold text-base"
                      : "text-gray-700 hover:text-blue-600 text-base transition-colors"
                  }
                >
                  Contact
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
