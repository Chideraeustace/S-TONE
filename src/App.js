import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from './components/Header';
import Hero from './components/Hero';
import PromoCards from './components/PromoCards';
import BestSellers from './components/BestSellers';
import Cards from './components/Cards';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import About from './components/About';
import Category from './components/Categories';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Carts';
import Checkout from './components/Checkout';
import Contact from './components/contact';
import Account from './components/Account';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <BrowserRouter>
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
            <Route path="/about" element={<About />} />
            <Route path="/category" element={<Category />} />
            <Route path="/product-details" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/account" element={<Account />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;