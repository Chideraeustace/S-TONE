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
import { useCart } from "./CartContext";
import logo from "../assets/s-tonelogo.avif";

const Header = () => {
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [lashesMenuOpen, setLashesMenuOpen] = useState(false);
  const [nailsMenuOpen, setNailsMenuOpen] = useState(false);
  const [semiPermanentMenuOpen, setSemiPermanentMenuOpen] = useState(false);
  const { cart } = useCart();
  const cartCount = cart.length;

  const lashesMenuRef = useRef(null);
  const nailsMenuRef = useRef(null);
  const semiPermanentMenuRef = useRef(null);
  const currencyMenuRef = useRef(null);
  const accountMenuRef = useRef(null);

  // Close mobile nav on link click
  const handleNavLinkClick = () => {
    setMobileNavOpen(false);
    setLashesMenuOpen(false);
    setNailsMenuOpen(false);
    setSemiPermanentMenuOpen(false);
  };

  // Click outside handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        lashesMenuRef.current &&
        !lashesMenuRef.current.contains(event.target)
      ) {
        setLashesMenuOpen(false);
      }
      if (
        nailsMenuRef.current &&
        !nailsMenuRef.current.contains(event.target)
      ) {
        setNailsMenuOpen(false);
      }
      if (
        semiPermanentMenuRef.current &&
        !semiPermanentMenuRef.current.contains(event.target)
      ) {
        setSemiPermanentMenuOpen(false);
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
      <div className="py-2 bg-[#4A5D23]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="hidden lg:flex items-center">
              <BiPhone className="mr-2 text-lg text-gray-600" />
              <span className="text-sm text-white">
                Need help? Call us:{" "}
              </span>
              <a
                href="tel:+8613527956171"
                className="ml-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                +8613527956171
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
                className="h-8 text-sm lg:text-base text-gray"
              >
                <SwiperSlide>
                  Free shipping to Ghana for orders over $100!!
                </SwiperSlide>
                <SwiperSlide>
                  S-TONE Cosmetics | Beauty Essentials!!!
                </SwiperSlide>
              </Swiper>
            </div>
            <div className="hidden lg:flex justify-end space-x-4">
              <div className="relative" ref={currencyMenuRef}>
                <button
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  className="flex items-center text-sm text-white hover:text-blue-600 transition-colors"
                >
                  <BiDollar className="mr-2 text-lg" />
                  USD
                </button>
                <ul
                  className={`absolute right-0 bg-white shadow-lg rounded mt-2 w-48 z-50 transition-all duration-200 ${
                    currencyOpen ? "block opacity-100" : "hidden opacity-0"
                  }`}
                >
                  <li>
                    <button className="flex items-center px-4 py-3 hover:bg-gray-50 w-full text-left text-base text-white">
                      <BiCheck className="mr-2 text-lg text-white" />
                      USD
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
              src={logo}
              alt="S-TONE Cosmetics"
              className="
                h-12 w-auto
                rounded-lg
                transition-all
                duration-300
                ease-in-out
                hover:scale-110
                hover:shadow-xl
              "
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
                placeholder="Search for lashes, nails, makeup, and more"
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
                    Welcome to{" "}
                    <span className="font-bold">S-TONE Cosmetics</span>
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
              <li className="relative" ref={lashesMenuRef}>
                <button
                  onClick={() => setLashesMenuOpen(!lashesMenuOpen)}
                  className="flex items-center text-gray-700 hover:text-blue-600 text-base transition-colors"
                >
                  Lashes <BiChevronDown className="ml-1 text-lg" />
                </button>
                <div
                  className={`mobile-megamenu block xl:hidden max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg mt-2 ${
                    lashesMenuOpen ? "block" : "hidden"
                  }`}
                >
                  <ul className="flex flex-col">
                    <li>
                      <Link
                        to="/category/lashes/strip-lashes"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Strip Lashes
                      </Link>
                      <ul className="pl-4">
                        <li>
                          <Link
                            to="/category/lashes/strip-lashes/natural"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Natural
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/lashes/strip-lashes/dramatic"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Dramatic
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/lashes/strip-lashes/volume"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Volume
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link
                        to="/category/lashes/individual-lashes"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Individual Lashes
                      </Link>
                      <ul className="pl-4">
                        <li>
                          <Link
                            to="/category/lashes/individual-lashes/clusters"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Clusters
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/lashes/individual-lashes/single-flares"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Single Flares
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/lashes/individual-lashes/extensions"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Extensions
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link
                        to="/category/lashes/lash-tools"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Lash Tools
                      </Link>
                      <ul className="pl-4">
                        <li>
                          <Link
                            to="/category/lashes/lash-tools/adhesives"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Adhesives
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/lashes/lash-tools/applicators"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Applicators
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/lashes/lash-tools/removers"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Removers
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div
                  className={`desktop-megamenu hidden xl:block absolute left-0 bg-white shadow-lg rounded-lg mt-2 w-[600px] p-4 z-50 transition-all duration-200 ${
                    lashesMenuOpen ? "block opacity-100" : "hidden opacity-0"
                  }`}
                >
                  <ul className="grid grid-cols-3 gap-4">
                    <li>
                      <Link
                        to="/category/lashes/strip-lashes"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Strip Lashes
                      </Link>
                      <ul>
                        <li>
                          <Link
                            to="/category/lashes/strip-lashes/natural"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Natural
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/lashes/strip-lashes/dramatic"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Dramatic
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/lashes/strip-lashes/volume"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Volume
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link
                        to="/category/lashes/individual-lashes"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Individual Lashes
                      </Link>
                      <ul>
                        <li>
                          <Link
                            to="/category/lashes/individual-lashes/clusters"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Clusters
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/lashes/individual-lashes/single-flares"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Single Flares
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/lashes/individual-lashes/extensions"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Extensions
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link
                        to="/category/lashes/lash-tools"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Lash Tools
                      </Link>
                      <ul>
                        <li>
                          <Link
                            to="/category/lashes/lash-tools/adhesives"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Adhesives
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/lashes/lash-tools/applicators"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Applicators
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/lashes/lash-tools/removers"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Removers
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="relative" ref={nailsMenuRef}>
                <button
                  onClick={() => setNailsMenuOpen(!nailsMenuOpen)}
                  className="flex items-center text-gray-700 hover:text-blue-600 text-base transition-colors"
                >
                  Nails <BiChevronDown className="ml-1 text-lg" />
                </button>
                <div
                  className={`mobile-megamenu block xl:hidden max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg mt-2 ${
                    nailsMenuOpen ? "block" : "hidden"
                  }`}
                >
                  <ul className="flex flex-col">
                    <li>
                      <Link
                        to="/category/nails/polish"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Nail Polish
                      </Link>
                      <ul className="pl-4">
                        <li>
                          <Link
                            to="/category/nails/polish/gel"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Gel Polish
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/nails/polish/regular"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Regular Polish
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/nails/polish/glitter"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Glitter Polish
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link
                        to="/category/nails/press-ons"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Press-On Nails
                      </Link>
                      <ul className="pl-4">
                        <li>
                          <Link
                            to="/category/nails/press-ons/short"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Short
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/nails/press-ons/medium"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Medium
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/nails/press-ons/long"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Long
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link
                        to="/category/nails/nail-tools"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Nail Tools
                      </Link>
                      <ul className="pl-4">
                        <li>
                          <Link
                            to="/category/nails/nail-tools/files"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Files
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/nails/nail-tools/clippers"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Clippers
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/nails/nail-tools/brushes"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Brushes
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div
                  className={`desktop-megamenu hidden xl:block absolute left-0 bg-white shadow-lg rounded-lg mt-2 w-[600px] p-4 z-50 transition-all duration-200 ${
                    nailsMenuOpen ? "block opacity-100" : "hidden opacity-0"
                  }`}
                >
                  <ul className="grid grid-cols-3 gap-4">
                    <li>
                      <Link
                        to="/category/nails/polish"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Nail Polish
                      </Link>
                      <ul>
                        <li>
                          <Link
                            to="/category/nails/polish/gel"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Gel Polish
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/nails/polish/regular"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Regular Polish
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/nails/polish/glitter"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Glitter Polish
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link
                        to="/category/nails/press-ons"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Press-On Nails
                      </Link>
                      <ul>
                        <li>
                          <Link
                            to="/category/nails/press-ons/short"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Short
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/nails/press-ons/medium"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Medium
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/nails/press-ons/long"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Long
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link
                        to="/category/nails/nail-tools"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Nail Tools
                      </Link>
                      <ul>
                        <li>
                          <Link
                            to="/category/nails/nail-tools/files"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Files
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/nails/nail-tools/clippers"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Clippers
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/nails/nail-tools/brushes"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Brushes
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="relative" ref={semiPermanentMenuRef}>
                <button
                  onClick={() =>
                    setSemiPermanentMenuOpen(!semiPermanentMenuOpen)
                  }
                  className="flex items-center text-gray-700 hover:text-blue-600 text-base transition-colors"
                >
                  Semi-Permanent Makeup{" "}
                  <BiChevronDown className="ml-1 text-lg" />
                </button>
                <div
                  className={`mobile-megamenu block xl:hidden max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg mt-2 ${
                    semiPermanentMenuOpen ? "block" : "hidden"
                  }`}
                >
                  <ul className="flex flex-col">
                    <li>
                      <Link
                        to="/category/semi-permanent/eyebrows"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Eyebrows
                      </Link>
                      <ul className="pl-4">
                        <li>
                          <Link
                            to="/category/semi-permanent/eyebrows/microblading"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Microblading
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/semi-permanent/eyebrows/powder-brows"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Powder Brows
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/semi-permanent/eyebrows/ombre-brows"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Ombre Brows
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link
                        to="/category/semi-permanent/eyeliners"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Eyeliners
                      </Link>
                      <ul className="pl-4">
                        <li>
                          <Link
                            to="/category/semi-permanent/eyeliners/upper-liner"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Upper Liner
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/semi-permanent/eyeliners/lower-liner"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Lower Liner
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/semi-permanent/eyeliners/winged-liner"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Winged Liner
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link
                        to="/category/semi-permanent/lips"
                        onClick={handleNavLinkClick}
                        className="block px-4 py-3 hover:bg-gray-50 text-base text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        Lips
                      </Link>
                      <ul className="pl-4">
                        <li>
                          <Link
                            to="/category/semi-permanent/lips/lip-blush"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Lip Blush
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/semi-permanent/lips/full-lip"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Full Lip
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/semi-permanent/lips/lip-liner"
                            onClick={handleNavLinkClick}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Lip Liner
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
                <div
                  className={`desktop-megamenu hidden xl:block absolute left-0 bg-white shadow-lg rounded-lg mt-2 w-[600px] p-4 z-50 transition-all duration-200 ${
                    semiPermanentMenuOpen
                      ? "block opacity-100"
                      : "hidden opacity-0"
                  }`}
                >
                  <ul className="grid grid-cols-3 gap-4">
                    <li>
                      <Link
                        to="/category/semi-permanent/eyebrows"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Eyebrows
                      </Link>
                      <ul>
                        <li>
                          <Link
                            to="/category/semi-permanent/eyebrows/microblading"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Microblading
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/semi-permanent/eyebrows/powder-brows"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Powder Brows
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/semi-permanent/eyebrows/ombre-brows"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Ombre Brows
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link
                        to="/category/semi-permanent/eyeliners"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Eyeliners
                      </Link>
                      <ul>
                        <li>
                          <Link
                            to="/category/semi-permanent/eyeliners/upper-liner"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Upper Liner
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/semi-permanent/eyeliners/lower-liner"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Lower Liner
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/semi-permanent/eyeliners/winged-liner"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Winged Liner
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Link
                        to="/category/semi-permanent/lips"
                        onClick={handleNavLinkClick}
                        className="block py-2 text-gray-700 hover:text-blue-600 text-base transition-colors"
                      >
                        Lips
                      </Link>
                      <ul>
                        <li>
                          <Link
                            to="/category/semi-permanent/lips/lip-blush"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Lip Blush
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/semi-permanent/lips/full-lip"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Full Lip
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/category/semi-permanent/lips/lip-liner"
                            onClick={handleNavLinkClick}
                            className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            Lip Liner
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <NavLink
                  to="/kits"
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 font-semibold text-base"
                      : "text-gray-700 hover:text-blue-600 text-base transition-colors"
                  }
                >
                  Kits
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/glam-guide"
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 font-semibold text-base"
                      : "text-gray-700 hover:text-blue-600 text-base transition-colors"
                  }
                >
                  Glam Guide
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/learning-portal"
                  onClick={handleNavLinkClick}
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-600 font-semibold text-base"
                      : "text-gray-700 hover:text-blue-600 text-base transition-colors"
                  }
                >
                  Learning Portal
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
