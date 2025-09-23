import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./components/CartContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PromoCards from "./components/PromoCards";
import BestSellers from "./components/BestSellers";
import Cards from "./components/Cards";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import About from "./components/About";
import Category from "./components/Categories";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Carts";
import Checkout from "./components/Checkout";
import Login from "./components/Login";
import Account from "./components/Account";

const ProtectedRoute = ({ children }) => {
  const userType = localStorage.getItem("userType");
  return userType ? children : <Navigate to="/login" />;
};

function App({ categories }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
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
                    <PromoCards />
                    <BestSellers />
                    <Cards />
                    <CallToAction />
                  </>
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
            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />
            {categories.map((category) => (
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
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account/>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </CartProvider>
  );
}

export default App;
