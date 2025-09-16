import React, { useState } from "react";
import { useCart } from "./CartContext";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaSpinner } from "react-icons/fa";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../Firebase";
import { toast } from "react-toastify";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [guestDetails, setGuestDetails] = useState({
    email: "",
    name: "",
    location: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Check if all guest details fields are filled
  const isFormComplete =
    guestDetails.email &&
    guestDetails.name &&
    guestDetails.location &&
    guestDetails.phone;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuestDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Separate async function to handle order saving
  const saveOrderToFirestore = async (response) => {
    try {
      await addDoc(collection(db, "lumixing-orders"), {
        transactionRef: response.reference,
        cartItems: cart.map((item) => ({
          id: item.id,
          name: item.title,
          quantity: item.quantity,
          price: item.price,
          selectedColor: item.color,
        })),
        totalAmount: totalPrice,
        customer: {
          email: guestDetails.email,
          name: guestDetails.name,
          location: guestDetails.location,
          phone: guestDetails.phone,
        },
        createdAt: serverTimestamp(),
        status: "confirmed",
      });
    } catch (error) {
      console.error("Error saving order to Firestore:", error);
      toast.error("Failed to save order. Please contact support.");
    }
  };

  const handleCheckout = () => {
    if (!window.PaystackPop) {
      toast.error("Paystack script not loaded. Please try again later.");
      return;
    }

    // Validate guest details (fallback, though button is disabled if incomplete)
    if (!isFormComplete) {
      toast.error("Please fill in all checkout details.");
      return;
    }

    setLoading(true);

    const paystack = window.PaystackPop.setup({
      key:
        process.env.REACT_APP_PAYSTACK_PUBLIC_KEY ||
        "pk_test_d3834e4345d6c4535860bde88c00b25760e86fb1",
      email: guestDetails.email,
      amount: totalPrice * 100, // Paystack expects amount in kobo (GHS * 100)
      currency: "GHS",
      ref: `LUMIXING_${Math.floor(Math.random() * 1000000000)}`,
      metadata: {
        cartItems: cart.map((item) => ({
          id: item.id,
          name: item.title,
          quantity: item.quantity,
          price: item.price,
          selectedColor: item.color,
        })),
        customer: {
          email: guestDetails.email,
          name: guestDetails.name,
          location: guestDetails.location,
          phone: guestDetails.phone,
        },
      },
      callback: function (response) {
        // Handle payment success in a non-async callback
        saveOrderToFirestore(response).then(() => {
          navigate("/order-confirmation", {
            state: {
              transactionRef: response.reference,
              cartItems: cart,
              totalAmount: totalPrice,
              customer: {
                email: guestDetails.email,
                name: guestDetails.name,
                location: guestDetails.location,
                phone: guestDetails.phone,
              },
            },
          });
          clearCart();
          setGuestDetails({ email: "", name: "", location: "", phone: "" });
          toast.success("Order placed successfully!");
          setLoading(false);
        });
      },
      onClose: function () {
        toast.error("Payment cancelled.");
        setLoading(false);
      },
    });

    paystack.openIframe();
  };

  return (
    <section className="py-16 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8">
          Your Cart
        </h1>
        {cart.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
            <p className="text-lg text-gray-700 mb-6">Your cart is empty</p>
            <Link
              to="/category"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <ul className="divide-y divide-gray-200">
                  {cart.map((item, index) => (
                    <li
                      key={index}
                      className="py-4 flex flex-col sm:flex-row items-center gap-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-24 h-24 object-contain rounded-lg border border-gray-200"
                      />
                      <div className="flex-grow">
                        <h2 className="text-lg font-semibold text-gray-900">
                          {item.title}
                        </h2>
                        <p className="text-sm text-gray-600">
                          Color: {item.color}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          Price: ₵{(item.price * item.quantity).toFixed(2)}
                        </p>
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity - 1)
                            }
                            className="p-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-medium text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity + 1)
                            }
                            className="p-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                          >
                            <FaPlus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors duration-200"
                      >
                        <FaTrash className="w-4 h-4 mr-2" />
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Checkout Details */}
              <div className="mt-6 bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Checkout Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={guestDetails.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={guestDetails.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={guestDetails.location}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your location"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={guestDetails.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>₵{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-4">
                  <span>Total</span>
                  <span>₵{totalPrice.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="mt-6 block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={loading || !isFormComplete}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin w-5 h-5 mr-2" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
