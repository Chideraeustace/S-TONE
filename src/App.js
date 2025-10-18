import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./Firebase";
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
import { useCategories } from "./components/CategoriesContex";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = !!auth.currentUser;

  console.log("[DEBUG] ProtectedRoute:", {
    isAuthenticated,
    authCurrentUser: auth.currentUser
      ? { uid: auth.currentUser.uid, email: auth.currentUser.email }
      : null,
    location: location.pathname,
  });

  return isAuthenticated ? (
    children
  ) : (
    <>
      {console.log(
        "[DEBUG] ProtectedRoute: Redirecting to /login from",
        location.pathname
      )}
      <Navigate to="/login" state={{ from: location }} replace />
    </>
  );
};

function App() {
  const { categories, loading } = useCategories();

  console.log(
    "[DEBUG] App rendering, categories:",
    categories.length,
    "loading:",
    loading
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F5F5F5] to-cream-100">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Hero />
                  <BestSellers />
                  <PromoCards />
                  <Categories />
                  <GlamGuide />
                  <Testimonials />
                </>
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/category"
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />
          {!loading &&
            categories.map((category) => (
              <Route
                key={category.id}
                path={category.url}
                element={
                  <ProtectedRoute>
                    <Category />
                  </ProtectedRoute>
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
                    <ProtectedRoute>
                      <Category />
                    </ProtectedRoute>
                  }
                />
              ))
            )}
          <Route
            path="/product-details/:productId"
            element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kits"
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />
          <Route
            path="/glam-guide"
            element={
              <ProtectedRoute>
                <GlamGuide />
              </ProtectedRoute>
            }
          />
          <Route
            path="/learning-portal"
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        toastClassName="bg-[#4A5D23] text-white font-sans text-sm rounded-lg shadow-md"
        bodyClassName="text-white font-sans"
      />
    </div>
  );
}

export default App;
