import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../Firebase";
import {
  FaMapMarkerAlt,
  FaStore,
  FaTruckLoading,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa"; // Import icons

const Account = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userType, setUserType] = useState("regular");
  // ⭐ NEW STATE: to track which order's details are expanded
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  // --- User Details Fetch (Unchanged) ---
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!auth.currentUser) {
        setError("Please log in to view your orders.");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        setUserEmail(auth.currentUser.email);
        const userDoc = await getDoc(
          doc(db, "s-tone-users", auth.currentUser.uid)
        );
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserType(userData.userType || "regular");
        } else {
          setUserType("regular");
        }
      } catch (err) {
        console.error("[DEBUG] Account: Error fetching user data:", err);
        setError("Failed to load user details. Please try again.");
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [navigate]);

  // --- Order Fetch (Unchanged, relies on userEmail) ---
  useEffect(() => {
    if (!userEmail) return;

    const ordersQuery = query(
      collection(db, "s-tone-orders"),
      where("customer.email", "==", userEmail),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (querySnapshot) => {
        const updatedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(updatedOrders);
        setLoading(false);
        if (error) setError(null);
      },
      (err) => {
        console.error("[DEBUG] Account: Snapshot error:", err);
        setLoading(false);
        setError(
          `Failed to load orders: ${err.message || "Please try again later."}`
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userEmail, error]);

  // --- Helper Functions ---

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "created":
        return "bg-yellow-100 text-yellow-800";
      case "picked up":
        return "bg-blue-100 text-blue-800";
      case "cancelled": // Added cancelled status for robustness
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderPickupLocation = (order) => {
    const loc = order.selectedPickupLocation;
    const type = order.pickupOption;
    if (!loc) {
      return <span className="text-gray-500 italic">Location Not Set</span>;
    }

    const isStore = type === "s-tone stores";
    const Icon = isStore ? FaStore : FaTruckLoading;
    const typeText = isStore ? "Store Pickup" : "Collection Point";

    return (
      <div className="flex flex-col space-y-1">
        <div className="flex items-center text-xs font-sans font-semibold text-gray-900">
          <Icon className="w-3 h-3 mr-1 text-[#4A5D23]" />
          {loc.name || "N/A Name"}
        </div>
        <p className="text-xs font-sans text-gray-600">
          {loc.address || "N/A Address"}
        </p>
        <p className="text-xs font-sans font-bold text-blue-600">
          ({typeText})
        </p>
      </div>
    );
  };

  // ⭐ NEW FUNCTION: Render detailed product options
  const renderItemDetails = (item) => {
    const details = [];
    if (item.color && item.color !== "N/A")
      details.push(
        <span key="color" className="mr-2">
          Color: {item.color}
        </span>
      );
    if (item.length && item.length !== "N/A")
      details.push(
        <span key="length" className="mr-2">
          Length: {item.length}mm
        </span>
      );
    if (item.size && item.size !== "N/A")
      details.push(
        <span key="size" className="mr-2">
          Size: {item.size}
        </span>
      );
    if (item.style && item.style !== "N/A")
      details.push(
        <span key="style" className="mr-2">
          Style: {item.style}
        </span>
      );
    if (item.thickness && item.thickness !== "N/A")
      details.push(
        <span key="thickness" className="mr-2">
          Thickness: {item.thickness}mm
        </span>
      );

    return details.length > 0 ? (
      <div className="text-xs text-gray-500 mt-1">{details}</div>
    ) : null;
  };

  // ⭐ NEW FUNCTION: Toggle the expanded state
  const toggleDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // --- Loading/Error States (Unchanged) ---
  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-b from-[#F5F5F5] to-cream-100 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-8 tracking-tight">
            My Orders
          </h2>
          <p className="text-gray-600 text-sm font-sans mb-8">
            Loading your orders...
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#4A5D23]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gradient-to-b from-[#F5F5F5] to-cream-100 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-8 tracking-tight">
            My Orders
          </h2>
          <p className="text-red-600 text-sm font-sans mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#4A5D23] text-white rounded-lg hover:bg-[#3A4A1C] transition-colors font-sans text-sm"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // --- Main Render ---
  return (
    <section className="py-12 bg-gradient-to-b from-[#F5F5F5] to-cream-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-8 tracking-tight">
          My Orders
        </h2>
        <p className="text-gray-600 text-sm font-sans mb-8">
          Manage your orders (User Type:{" "}
          <strong className="uppercase">{userType}</strong>)
        </p>

        {/* --- Empty State --- */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <p className="text-base font-sans text-gray-600 mb-4">
              No orders found.
            </p>
            <Link
              to="/category"
              className="inline-block px-6 py-2 bg-[#4A5D23] text-white rounded-lg hover:bg-[#3A4A1C] transition-colors font-sans text-sm"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* --- Desktop Table View --- */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* 1. FIXED: <thead...><tr...> compressed to remove whitespace */}
                <thead className="bg-[#F5F5F5]"><tr>
                  <th className="px-4 py-3 text-left text-xs font-sans font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-sans font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-sans font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-sans font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-sans font-medium text-gray-500 uppercase tracking-wider">
                    Pickup Location
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-sans font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr></thead>
                {/* 2. FIXED: <tbody>{orders.map... compressed to remove whitespace */}
                <tbody className="bg-white divide-y divide-gray-200">{orders.map((order) => (
                  <React.Fragment key={order.id}>
                    {/* 3. FIXED: <tr...> content starts immediately to remove whitespace */}
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-sans font-medium text-gray-900">
                        #{order.transactionRef || order.id.substring(0, 8)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-sans text-gray-500">
                        {order.createdAt
                          ? order.createdAt.toDate().toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-sans font-semibold rounded-full ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-sans text-gray-900 font-bold">
                        ₵
                        {order.totalAmount
                          ? order.totalAmount.toFixed(2)
                          : "0.00"}
                      </td>
                      <td className="px-4 py-3 text-sm font-sans text-gray-500">
                        {renderPickupLocation(order)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <button
                          onClick={() => toggleDetails(order.id)}
                          className="text-[#4A5D23] hover:text-[#3A4A1C] transition-colors"
                          title={
                            expandedOrder === order.id
                              ? "Hide details"
                              : "Show details"
                          }
                        >
                          {expandedOrder === order.id ? (
                            <FaEyeSlash className="w-4 h-4 mx-auto" />
                          ) : (
                            <FaEye className="w-4 h-4 mx-auto" />
                          )}
                        </button>
                      </td>
                    </tr>
                    {/* ⭐ EXPANDABLE PRODUCT DETAILS ROW - No change needed here as <tr> is a valid child of React.Fragment */}
                    {expandedOrder === order.id && (
                      <tr className="bg-gray-100">
                        <td colSpan="6" className="px-4 py-4">
                          <h4 className="text-sm font-serif font-bold text-gray-800 mb-2">
                            Ordered Items ({order.cartItems?.length || 0})
                          </h4>
                          <ul className="space-y-3">
                            {order.cartItems?.map((item, itemIndex) => (
                              <li
                                key={itemIndex}
                                className="p-3 bg-white rounded-lg shadow-sm border border-gray-200"
                              >
                                <div className="flex justify-between items-start">
                                  <p className="text-sm font-sans font-semibold text-gray-900">
                                    {item.name}
                                  </p>
                                  <p className="text-sm font-sans font-bold text-gray-900">
                                    ₵{(item.price * item.quantity).toFixed(2)}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-700 mt-1">
                                  {item.quantity} x ₵{item.price.toFixed(2)}
                                </p>
                                {/* Render product options */}
                                {renderItemDetails(item)}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}</tbody>
              </table>
            </div>

            {/* --- Mobile Vertical View (lg:hidden class hides it on larger screens) --- */}
            <div className="lg:hidden divide-y divide-gray-200">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-serif font-bold text-gray-900">
                      Order #{order.transactionRef || order.id.substring(0, 8)}
                    </h3>
                    <button
                      onClick={() => toggleDetails(order.id)}
                      className="text-[#4A5D23] hover:text-[#3A4A1C] transition-colors p-1"
                      title={
                        expandedOrder === order.id
                          ? "Hide details"
                          : "Show details"
                      }
                    >
                      {expandedOrder === order.id ? (
                        <FaEyeSlash className="w-4 h-4" />
                      ) : (
                        <FaEye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-1 text-sm font-sans">
                    <p className="flex justify-between">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-bold text-gray-900">
                        ₵
                        {order.totalAmount
                          ? order.totalAmount.toFixed(2)
                          : "0.00"}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span>
                        {order.createdAt
                          ? order.createdAt.toDate().toLocaleDateString()
                          : "N/A"}
                      </span>
                    </p>
                    <p className="flex justify-between items-center">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </p>
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-600 mb-1">Pickup Location:</p>
                      {renderPickupLocation(order)}
                    </div>
                  </div>

                  {/* ⭐ EXPANDABLE PRODUCT DETAILS SECTION FOR MOBILE */}
                  {expandedOrder === order.id && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-serif font-bold text-gray-800 mb-2">
                        Ordered Items ({order.cartItems?.length || 0})
                      </h4>
                      <ul className="space-y-3">
                        {order.cartItems?.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="p-3 bg-gray-100 rounded-lg shadow-inner"
                          >
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-sans font-semibold text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-sm font-sans font-bold text-gray-900">
                                ₵{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <p className="text-xs text-gray-700 mt-1">
                              {item.quantity} x ₵{item.price.toFixed(2)}
                            </p>
                            {/* Render product options */}
                            {renderItemDetails(item)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Account