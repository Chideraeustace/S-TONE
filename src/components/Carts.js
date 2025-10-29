import React, { useState, useEffect, useMemo } from "react";
import { useCart } from "./CartContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaSpinner,
  FaMapMarkerAlt,
  FaStore,
  FaTruckLoading,
} from "react-icons/fa";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../Firebase";
import { toast } from "react-toastify";

// 📦 Placeholder Data for Locations (Replace with actual data from Firestore/API)
const STORE_LOCATIONS = [
  {
    id: 1,
    name: "S-Tone Accra Mall",
    address: "Spintex Road, Accra",
    lat: 5.6148,
    lon: -0.1983,
  },
  {
    id: 2,
    name: "S-Tone Kumasi City Mall",
    address: "Asokwa, Kumasi",
    lat: 6.6787,
    lon: -1.5833,
  },
];

const COLLECTION_POINTS = [
  {
    id: 101,
    name: "KFC Achimota Collection",
    address: "Achimota Retail Centre, Accra",
    lat: 5.6262,
    lon: -0.2193,
  },
  {
    id: 102,
    name: "Palace Hypermarket Point",
    address: "Spintex Rd, Tema",
    lat: 5.6669,
    lon: -0.0076,
  },
  {
    id: 103,
    name: "Kumasi Kejetia Hub",
    address: "Kejetia Market, Kumasi",
    lat: 6.6908,
    lon: -1.6253,
  },
  {
    id: 104,
    name: "Takoradi Market Circle Drop",
    address: "Market Circle, Takoradi",
    lat: 4.887,
    lon: -1.7588,
  },
];

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [guestDetails, setGuestDetails] = useState({
    email: "",
    name: "",
    country: "",
    regionCity: "",
    phone: "",
  });
  const [pickupOption, setPickupOption] = useState("s-tone stores");
  const [loading, setLoading] = useState(false);

  // ⭐ NEW STATE: for user's current coordinates
  const [userLocation, setUserLocation] = useState(null);
  // ⭐ NEW STATE: for selected location (store or collection point)
  const [selectedLocation, setSelectedLocation] = useState(null);

  const navigate = useNavigate();

  // --- Geolocation Effect ---
  useEffect(() => {
    // Attempt to get user's geographical location for dynamic collection points
    if (pickupOption === "designated collection point" && !userLocation) {
      if (navigator.geolocation) {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lon: longitude });
            toast.success("Location retrieved for nearby collection points.");
            setLoading(false);
          },
          (error) => {
            console.error("Geolocation error:", error);
            toast.warn(
              "Could not retrieve your location. Showing all collection points."
            );
            setLoading(false);
          }
        );
      } else {
        toast.error("Geolocation is not supported by this browser.");
      }
    }
  }, [pickupOption, userLocation]);

  // --- User Details Auto-fill Effect (Existing Logic) ---
  useEffect(() => {
    // ... existing user fetch logic ...
    const fetchUserDetails = async () => {
      if (auth.currentUser) {
        try {
          const userDoc = await getDoc(
            doc(db, "s-tone-users", auth.currentUser.uid)
          );
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setGuestDetails({
              email: userData.email || "",
              name: userData.name || "",
              country: userData.country || "",
              regionCity: userData.regionCity || "",
              phone: userData.phone || "",
            });
          } else {
            setGuestDetails({
              email: auth.currentUser.email || "",
              name: auth.currentUser.name || "",
              country: "",
              regionCity: "",
              phone: "",
            });
          }
        } catch (error) {
          console.error(
            "[DEBUG] Cart: Error fetching user data:",
            error,
            auth.currentUser.name
          );
          toast.error("Failed to load user details. Please fill manually.");
        }
      }
    };
    fetchUserDetails();
  }, []);

  // --- Core Calculation (DELIVERY FEE REMOVED) ---
  // ⭐ MODIFICATION: Removed shippingFeeGHS declaration
  const subtotalGHS = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  // ⭐ MODIFICATION: totalPriceGHS is now just the subtotal
  const totalPriceGHS = subtotalGHS;

  const isFormComplete =
    guestDetails.email &&
    guestDetails.name &&
    guestDetails.country &&
    guestDetails.regionCity &&
    guestDetails.phone &&
    selectedLocation; // ⭐ NEW REQUIREMENT: A pickup location must be selected

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGuestDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePickupChange = (e) => {
    setPickupOption(e.target.value);
    setSelectedLocation(null); // Reset selected location when the option changes
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // --- Location Calculation Utility (Haversine for distance) ---
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // --- Dynamic Locations Memo ---
  const availableLocations = useMemo(() => {
    if (pickupOption === "s-tone stores") {
      return STORE_LOCATIONS;
    } else if (pickupOption === "designated collection point") {
      if (userLocation) {
        // Sort collection points by proximity to user
        return COLLECTION_POINTS.map((point) => ({
          ...point,
          distance: getDistance(
            userLocation.lat,
            userLocation.lon,
            point.lat,
            point.lon
          ),
        }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3); // Show the 3 closest points
      }
      return COLLECTION_POINTS; // Fallback to all if location fails
    }
    return [];
  }, [pickupOption, userLocation]);

  // --- Firestore & Paystack Logic ---
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
        shippingFee: 0, // ⭐ MODIFICATION: Set shipping fee to 0
        totalAmount: totalPriceGHS,
        customer: {
          email: guestDetails.email,
          name: guestDetails.name,
          location: location,
          phone: guestDetails.phone,
        },
        pickupOption: pickupOption,
        // ⭐ NEW FIELD: Save the selected pickup location details
        selectedPickupLocation: selectedLocation,
        createdAt: serverTimestamp(),
        status: "confirmed",
      });
      localStorage.setItem("userEmail", guestDetails.email);
    } catch (error) {
      console.error("[DEBUG] Cart: Error saving order to Firestore:", error);
      toast.error("Failed to save order. Please contact support.");
      throw error;
    }
  };

  const handleCheckout = () => {
    if (!window.PaystackPop) {
      toast.error("Paystack script not loaded. Please try again later.");
      return;
    }

    if (!isFormComplete) {
      toast.error(
        "Please fill in all checkout details and select a pickup location."
      );
      return;
    }

    if (!validateEmail(guestDetails.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const ghsAmount = (totalPriceGHS * 100).toFixed(0);

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
        shippingFee: 0, // ⭐ MODIFICATION: Set shipping fee to 0
        pickupOption: pickupOption,
        selectedPickupLocation: selectedLocation, // ⭐ NEW: Selected location
      },
      callback: function (response) {
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
            setPickupOption("s-tone stores");
            setSelectedLocation(null);
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
          // ... Empty Cart UI ...
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
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <ul className="divide-y divide-gray-200">
                  {cart.map((item, index) => (
                    // ... Cart Item Display (already updated for "N/A" rendering) ...
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
                        {item.selectedColor && item.selectedColor !== "N/A" && (
                          <p className="text-xs font-sans text-gray-600">
                            Color: {item.selectedColor}
                          </p>
                        )}
                        {item.selectedLength &&
                          item.selectedLength !== "N/A" && (
                            <p className="text-xs font-sans text-gray-600">
                              Length: {item.selectedLength} mm
                            </p>
                          )}
                        {item.selectedSize && item.selectedSize !== "N/A" && (
                          <p className="text-xs font-sans text-gray-600">
                            Size: {item.selectedSize}
                          </p>
                        )}
                        {item.selectedStyle && item.selectedStyle !== "N/A" && (
                          <p className="text-xs font-sans text-gray-600">
                            Style: {item.selectedStyle}
                          </p>
                        )}
                        {item.selectedThickness &&
                          item.selectedThickness !== "N/A" && (
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
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {/* ... Customer Details Inputs ... */}
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
                      placeholder="e.g., Accra, Spintex road"
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

                {/* --- Pickup Option Section (Enhanced) --- */}
                <h2 className="text-base font-serif font-bold text-gray-800 mb-4 border-t pt-4">
                  Pickup Selection
                </h2>

                {/* Pickup Type Radio Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  {/* Store Pickup Option */}
                  <button
                    onClick={() => setPickupOption("s-tone stores")}
                    className={`flex items-center p-3 rounded-lg border-2 w-full transition-colors duration-200 ${
                      pickupOption === "s-tone stores"
                        ? "border-[#4A5D23] bg-green-50 shadow-md"
                        : "border-gray-300 hover:border-gray-400 bg-white"
                    }`}
                  >
                    <FaStore className="w-5 h-5 mr-3 text-[#4A5D23]" />
                    <span className="text-sm font-sans font-semibold">
                      Pickup from S-Tone Stores
                    </span>
                  </button>
                  {/* Collection Point Option */}
                  <button
                    onClick={() =>
                      setPickupOption("designated collection point")
                    }
                    className={`flex items-center p-3 rounded-lg border-2 w-full transition-colors duration-200 ${
                      pickupOption === "designated collection point"
                        ? "border-[#4A5D23] bg-green-50 shadow-md"
                        : "border-gray-300 hover:border-gray-400 bg-white"
                    }`}
                  >
                    <FaTruckLoading className="w-5 h-5 mr-3 text-[#4A5D23]" />
                    <span className="text-sm font-sans font-semibold">
                      Pickup from Collection Points
                    </span>
                  </button>
                </div>

                {/* Dynamic Location Selection */}
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <p className="text-sm font-serif font-bold text-gray-700 mb-3 flex items-center">
                    <FaMapMarkerAlt className="w-4 h-4 mr-2 text-red-500" />
                    Select your{" "}
                    {pickupOption === "s-tone stores"
                      ? "Store"
                      : "Collection Point"}
                    {pickupOption === "designated collection point" &&
                      userLocation && (
                        <span className="text-xs font-normal text-green-600 ml-2">
                          (Sorted by proximity)
                        </span>
                      )}
                    {pickupOption === "designated collection point" &&
                      !userLocation &&
                      loading && (
                        <span className="text-xs font-normal text-blue-600 ml-2 flex items-center">
                          <FaSpinner className="animate-spin w-3 h-3 mr-1" />
                          Finding your location...
                        </span>
                      )}
                  </p>

                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {availableLocations.map((location) => (
                      <div
                        key={location.id}
                        onClick={() => setSelectedLocation(location)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                          selectedLocation &&
                          selectedLocation.id === location.id
                            ? "bg-[#4A5D23] text-white shadow-lg ring-2 ring-[#3A4A1C]"
                            : "bg-white border border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <p
                          className={`font-semibold text-sm ${
                            selectedLocation &&
                            selectedLocation.id === location.id
                              ? "text-white"
                              : "text-gray-800"
                          }`}
                        >
                          {location.name}
                        </p>
                        <p
                          className={`text-xs ${
                            selectedLocation &&
                            selectedLocation.id === location.id
                              ? "text-gray-200"
                              : "text-gray-600"
                          }`}
                        >
                          {location.address}
                        </p>
                        {location.distance && (
                          <p
                            className={`text-xs mt-1 font-bold ${
                              selectedLocation &&
                              selectedLocation.id === location.id
                                ? "text-yellow-300"
                                : "text-blue-600"
                            }`}
                          >
                            ~{location.distance.toFixed(1)} km away
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  {availableLocations.length === 0 && (
                    <p className="text-sm text-center text-gray-500 py-4">
                      No locations available.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* --- Order Summary --- */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
                <h2 className="text-base font-serif font-bold text-gray-800 mb-4">
                  Order Summary
                </h2>
                <div className="flex justify-between text-sm font-sans text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>₵{subtotalGHS.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-sans text-gray-600 mb-4 border-b pb-4">
                  <span>Shipping (Pickup)</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold font-sans text-gray-800 pt-4">
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
                {!isFormComplete && (
                  <p className="text-red-500 text-xs mt-2 text-center">
                    * Please complete all details and select a pickup location.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
