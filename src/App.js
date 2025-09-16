import React from "react";
import { Routes, Route } from "react-router-dom";
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
import Contact from "./components/contact";
import Account from "./components/Account";
import Login from "./components/Login";
import OrderConfirmation from "./components/OrderConfirmation";

function App({ categories }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <PromoCards />
                  <BestSellers />
                  <Cards />
                  <CallToAction />
                </>
              }
            />
            <Route path="/category" element={<Category />} />
            <Route path="/about" element={<About />} />
            {categories.map((category) => (
              <Route
                key={category.id}
                path={category.url}
                element={<Category />}
              />
            ))}
            <Route
              path="/product-details/:productId"
              element={<ProductDetails />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/account" element={<Account />} />
            <Route path="/login" element={<Login />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </CartProvider>
  );
}

export default App;
