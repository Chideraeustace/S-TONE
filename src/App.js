import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // Removed CSS import causing compilation error
import { auth } from "./Firebase";
import { onAuthStateChanged } from "firebase/auth";
import promoImage from "./assets/smilinggirl.webp"; // Replace with your promo image path
import Header from "./components/Header";
import Hero from "./components/Hero";
import PromoCards from "./components/PromoCards";
import BestSellers from "./components/BestSellers";
import Categories from "./components/Cards";
import GlamGuide from "./components/CallToAction";
import Footer from "./components/Footer";
import About from "./components/About";
import Category from "./components/Categories";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Carts";
import Login from "./components/Login";
import Account from "./components/Account";
import Testimonials from "./components/Testimonials";
import Kit from "./components/Kit";
import Booking from "./components/booking";
import { useCategories } from "./components/CategoriesContex";

// --- PROMO MODAL COMPONENT ---
const PromoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose} // Close modal on clicking outside
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 sm:mx-6 lg:mx-8 p-6"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        data-aos="zoom-in"
        data-aos-duration="500"
      >
        <img
          src={promoImage}
          alt="S-TONE Promo"
          className="w-full h-64 sm:h-80 object-cover rounded-lg"
        />
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="bg-[#4A5D23] text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-[#3A4A1C] transition-all duration-300 transform hover:scale-105"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

// --- AUTH STATUS HOOK ---
const useAuthStatus = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!auth.currentUser);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsAuthReady(true);
      console.log(
        "[AUTH STATUS] Auth Check Complete. User authenticated:",
        !!user
      );
    });

    return () => unsubscribe();
  }, []);

  return { isAuthenticated, isAuthReady };
};

// --- PROTECTED ROUTE ---
const ProtectedRoute = ({ children, isAuthReady, isAuthenticated }) => {
  const location = useLocation();

  if (!isAuthReady) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-500 animate-pulse">Authenticating...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return children;
  }

  console.log(
    "[DEBUG] ProtectedRoute: Redirecting to /login from",
    location.pathname
  );
  return <Navigate to="/login" state={{ from: location }} replace />;
};

function App() {
  const { isAuthenticated, isAuthReady } = useAuthStatus();
  const { categories, loading } = useCategories();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  // --- MODAL LOGIC ---
  useEffect(() => {
    // Check if modal has been shown in this session
    const hasSeenModal = sessionStorage.getItem("hasSeenPromoModal");
    if (
      location.pathname === "/" &&
      isAuthReady &&
      isAuthenticated &&
      !hasSeenModal
    ) {
      setShowModal(true);
      sessionStorage.setItem("hasSeenPromoModal", "true");
    }
  }, [location.pathname, isAuthReady, isAuthenticated]);

  const closeModal = () => {
    setShowModal(false);
  };

  console.log(
    "[DEBUG] App rendering, categories:",
    categories.length,
    "loading:",
    loading,
    "Auth Ready:",
    isAuthReady,
    "Authenticated:",
    isAuthenticated,
    "Show Modal:",
    showModal
  );

  const ProtectedRouteWrapper = (props) => (
    <ProtectedRoute
      {...props}
      isAuthenticated={isAuthenticated}
      isAuthReady={isAuthReady}
    />
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F5F5F5] to-cream-100">
      <Header />
      <main className="flex-grow">
        <PromoModal isOpen={showModal} onClose={closeModal} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRouteWrapper>
                <>
                  <Hero />
                  <BestSellers />
                  <PromoCards />
                  <Categories />
                  <Kit />
                  <GlamGuide />
                  <Booking />
                  <Testimonials />
                </>
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRouteWrapper>
                <About />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/category"
            element={
              <ProtectedRouteWrapper>
                <Category />
              </ProtectedRouteWrapper>
            }
          />
          {!loading &&
            categories.map((category) => (
              <Route
                key={category.id}
                path={category.url}
                element={
                  <ProtectedRouteWrapper>
                    <Category />
                  </ProtectedRouteWrapper>
                }
              />
            ))}
          {!loading &&
            categories.flatMap((category) =>
              category.subcategories.map((subcategory) => (
                <Route
                  key={subcategory.id}
                  path={subcategory.url}
                  element={
                    <ProtectedRouteWrapper>
                      <Category />
                    </ProtectedRouteWrapper>
                  }
                />
              ))
            )}
          <Route
            path="/product-details/:productId"
            element={
              <ProtectedRouteWrapper>
                <ProductDetails />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRouteWrapper>
                <Cart />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRouteWrapper>
                <Account />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/kits"
            element={
              <ProtectedRouteWrapper>
                <Category />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/glam-guide"
            element={
              <ProtectedRouteWrapper>
                <GlamGuide />
              </ProtectedRouteWrapper>
            }
          />
          <Route
            path="/learning-portal"
            element={
              <ProtectedRouteWrapper>
                <Category />
              </ProtectedRouteWrapper>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        style={{
          "--toastify-color-success": "#4A5D23",
          "--toastify-color-error": "#B91C1C",
          "--toastify-color-warning": "#D97706",
          "--toastify-color-info": "#1D4ED8",
          "--toastify-color-progress-default": "#4A5D23",
        }}
        toastClassName="bg-[#4A5D23] text-white font-sans text-sm rounded-lg shadow-md"
        bodyClassName="text-white font-sans"
      />
    </div>
  );
}

export default App;
