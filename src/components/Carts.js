import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaSpinner } from "react-icons/fa";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../Firebase";
import { toast } from "react-toastify";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [guestDetails, setGuestDetails] = useState({
    email: "",
    name: "",
    country: "",
    regionCity: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Auto-fill user details for logged-in users
  useEffect(() => {
    console.log("[DEBUG] Cart: Checking auth.currentUser:", auth.currentUser);
    const fetchUserDetails = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(
            doc(db, "s-tone-users", auth.currentUser.uid)
          );
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("[DEBUG] Cart: Fetched user data:", userData);
            setGuestDetails({
              email: userData.email || "",
              name: userData.name || "",
              country: userData.country || "",
              regionCity: userData.regionCity || "",
              phone: userData.phone || "",
            });
          } else {
            console.log("[DEBUG] Cart: No user data found in Firestore");
            setGuestDetails({
              email: auth.currentUser.email || "",
              name: "",
              country: "",
              regionCity: "",
              phone: "",
            });
          }
        } catch (error) {
          console.error("[DEBUG] Cart: Error fetching user data:", error);
          toast.error("Failed to load user details. Please fill manually.");
        }
      } else {
        console.log("[DEBUG] Cart: No authenticated user");
      }
    };
    fetchUserDetails();
  }, []);

  const shippingFeeGHS = 100; // Fixed shipping fee in GHS
  const subtotalGHS = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalPriceGHS = subtotalGHS + shippingFeeGHS;

  const isFormComplete =
    guestDetails.email &&
    guestDetails.name &&
    guestDetails.country &&
    guestDetails.regionCity &&
    guestDetails.phone;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuestDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const saveOrderToFirestore = async (transactionRef) => {
    try {
      const location = `${guestDetails.country}, ${guestDetails.regionCity}`;
      await addDoc(collection(db, "s-tone-orders"), {
        transactionRef,
        cartItems: cart.map((item) => ({
          id: item.id,
          name: item.title,
          quantity: item.quantity,
          price: item.price,
          color: item.selectedColor || "N/A",
          length: item.selectedLength || "N/A",
          size: item.selectedSize || "N/A",
          style: item.selectedStyle || "N/A",
          thickness: item.selectedThickness || "N/A",
        })),
        subtotal: subtotalGHS,
        shippingFee: shippingFeeGHS,
        totalAmount: totalPriceGHS,
        customer: {
          email: guestDetails.email,
          name: guestDetails.name,
          location: location,
          phone: guestDetails.phone,
        },
        createdAt: serverTimestamp(),
        status: "confirmed",
      });
      localStorage.setItem("userEmail", guestDetails.email);
      console.log(
        "[DEBUG] Cart: Order saved to Firestore, transactionRef:",
        transactionRef
      );
    } catch (error) {
      console.error("[DEBUG] Cart: Error saving order to Firestore:", error);
      toast.error("Failed to save order. Please contact support.");
      throw error;
    }
  };

  const handleCheckout = () => {
    console.log(
      "[DEBUG] Cart: Initiating Paystack checkout, isFormComplete:",
      isFormComplete
    );
    if (!window.PaystackPop) {
      console.error("[DEBUG] Cart: Paystack script not loaded");
      toast.error("Paystack script not loaded. Please try again later.");
      return;
    }

    if (!isFormComplete) {
      console.log("[DEBUG] Cart: Form incomplete, guestDetails:", guestDetails);
      toast.error("Please fill in all checkout details.");
      return;
    }

    if (!validateEmail(guestDetails.email)) {
      console.log("[DEBUG] Cart: Invalid email:", guestDetails.email);
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const ghsAmount = (totalPriceGHS * 100).toFixed(0); // Paystack expects amount in kobo (cents)

    const paystack = window.PaystackPop.setup({
      key:
        process.env.REACT_APP_PAYSTACK_PUBLIC_KEY ||
        "pk_test_d3834e4345d6c4535860bde88c00b25760e86fb1",
      email: guestDetails.email,
      amount: ghsAmount,
      currency: "GHS",
      ref: `STONE_${Math.floor(Math.random() * 1000000000)}`,
      metadata: {
        cartItems: cart.map((item) => ({
          id: item.id,
          name: item.title,
          quantity: item.quantity,
          price: item.price,
          color: item.selectedColor || "N/A",
          length: item.selectedLength || "N/A",
          size: item.selectedSize || "N/A",
          style: item.selectedStyle || "N/A",
          thickness: item.selectedThickness || "N/A",
        })),
        customer: {
          email: guestDetails.email,
          name: guestDetails.name,
          location: `${guestDetails.country}, ${guestDetails.regionCity}`,
          phone: guestDetails.phone,
        },
        shippingFee: shippingFeeGHS,
      },
      callback: function (response) {
        console.log("[DEBUG] Cart: Paystack callback, response:", response);
        saveOrderToFirestore(response.reference)
          .then(() => {
            clearCart();
            setGuestDetails({
              email: "",
              name: "",
              country: "",
              regionCity: "",
              phone: "",
            });
            toast.success(
              "Order placed successfully! View your order in your account."
            );
            setLoading(false);
            navigate("/account");
          })
          .catch(() => {
            setLoading(false);
          });
      },
      onClose: function () {
        console.log("[DEBUG] Cart: Paystack payment cancelled");
        toast.error("Payment cancelled.");
        setLoading(false);
      },
    });

    paystack.openIframe();
  };

  return (
    <section className="py-12 bg-gradient-to-b from-[#F5F5F5] to-cream-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-8 tracking-tight">
          Your Cart
        </h1>
        {cart.length === 0 ? (
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <p className="text-base font-sans text-gray-600 mb-4">
              Your cart is empty
            </p>
            <Link
              to="/category"
              className="inline-block px-4 py-2 bg-[#4A5D23] text-white rounded-lg hover:bg-[#3A4A1C] transition-colors duration-300 font-sans text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-4">
                <ul className="divide-y divide-gray-200">
                  {cart.map((item, index) => (
                    <li
                      key={index}
                      className="py-3 flex flex-col sm:flex-row items-center gap-3 hover:bg-gray-50 transition-colors duration-300"
                    >
                      <img
                        src={
                          item.images?.[0]?.url ||
                          "https://via.placeholder.com/150"
                        }
                        alt={item.title}
                        className="w-20 h-20 object-contain rounded-md border border-gray-200"
                      />
                      <div className="flex-grow">
                        <h2 className="text-base font-serif font-semibold text-gray-800">
                          {item.title}
                        </h2>
                        <p className="text-sm font-sans text-gray-600">
                          ₵{(item.price * item.quantity).toFixed(2)}
                        </p>
                        {item.selectedColor && (
                          <p className="text-xs font-sans text-gray-600">
                            Color: {item.selectedColor}
                          </p>
                        )}
                        {item.selectedLength && (
                          <p className="text-xs font-sans text-gray-600">
                            Length: {item.selectedLength} mm
                          </p>
                        )}
                        {item.selectedSize && (
                          <p className="text-xs font-sans text-gray-600">
                            Size: {item.selectedSize}
                          </p>
                        )}
                        {item.selectedStyle && (
                          <p className="text-xs font-sans text-gray-600">
                            Style: {item.selectedStyle}
                          </p>
                        )}
                        {item.selectedThickness && (
                          <p className="text-xs font-sans text-gray-600">
                            Thickness: {item.selectedThickness} mm
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity - 1)
                            }
                            className="p-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-sans text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity + 1)
                            }
                            className="p-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-300"
                          >
                            <FaPlus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="flex items-center justify-center px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors duration-300 text-sm font-sans"
                      >
                        <FaTrash className="w-3 h-3 mr-1" />
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4 bg-white rounded-lg shadow-md p-4">
                <h2 className="text-base font-serif font-bold text-gray-800 mb-4">
                  Checkout Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-sans text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={guestDetails.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-200 rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-sans text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={guestDetails.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-200 rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-sans text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={guestDetails.country}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-200 rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans"
                      placeholder="Enter your country"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-sans text-gray-700">
                      Region/City
                    </label>
                    <input
                      type="text"
                      name="regionCity"
                      value={guestDetails.regionCity}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-200 rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans"
                      placeholder="Enter your region or city and address (e.g., Accra, Spintex road)"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-sans text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={guestDetails.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-200 rounded-lg focus:ring-[#4A5D23] focus:border-[#4A5D23] text-sm font-sans"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
                <h2 className="text-base font-serif font-bold text-gray-800 mb-4">
                  Order Summary
                </h2>
                <div className="flex justify-between text-sm font-sans text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>₵{subtotalGHS.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-sans text-gray-600 mb-4">
                  <span>Shipping</span>
                  <span>₵{shippingFeeGHS.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold font-sans text-gray-800 border-t border-gray-200 pt-4">
                  <span>Total</span>
                  <span>₵{totalPriceGHS.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="mt-4 block w-full px-4 py-2 bg-[#4A5D23] text-white rounded-lg hover:bg-[#3A4A1C] transition-colors duration-300 text-sm font-sans flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !isFormComplete}
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin w-4 h-4 mr-2" />
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
