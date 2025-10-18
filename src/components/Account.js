import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../Firebase";

const Account = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userType, setUserType] = useState("regular"); // Default to regular
  const navigate = useNavigate();

  // Fetch user email and userType from Firebase Auth and Firestore
  useEffect(() => {
    console.log(
      "[DEBUG] Account: Checking auth.currentUser:",
      auth.currentUser
    );
    const fetchUserDetails = async () => {
      if (!auth.currentUser) {
        console.log(
          "[DEBUG] Account: No authenticated user, redirecting to /login"
        );
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
          console.log("[DEBUG] Account: Fetched user data:", userData);
          setUserType(userData.userType || "regular");
        } else {
          console.log("[DEBUG] Account: No user data found in Firestore");
          setUserType("regular"); // Fallback
        }
      } catch (err) {
        console.error("[DEBUG] Account: Error fetching user data:", err);
        setError("Failed to load user details. Please try again.");
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [navigate]);

  // Check minimum order amount for a single order
  const checkMinimumAmount = (order) => {
    const minimumAmountGHS = userType === "business" ? 7000 : 4000;
    const orderTotal = order.totalAmount || 0;

    if (orderTotal < minimumAmountGHS) {
      return `For delivery of product, you have to order item(s) that is equal to or greater than ₵${minimumAmountGHS} for ${userType} users.`;
    }
    return null;
  };

  // Fetch user's orders from Firestore
  useEffect(() => {
    if (!userEmail) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        console.log("[DEBUG] Account: Fetching orders for email:", userEmail);
        const ordersQuery = query(
          collection(db, "s-tone-orders"),
          where("customer.email", "==", userEmail),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(ordersQuery);
        const fetchedOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("[DEBUG] Account: Fetched orders:", fetchedOrders);
        setOrders(fetchedOrders);
        setLoading(false);
      } catch (err) {
        console.error("[DEBUG] Account: Error fetching orders:", err);
        setError(
          `Failed to fetch orders: ${
            err.code === "failed-precondition"
              ? "Missing index. Please create a composite index for 'customer.email' and 'createdAt' in Firebase Console."
              : err.message || "Please try again later."
          }`
        );
        setLoading(false);
      }
    };

    fetchOrders();

    // Set up real-time listener
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
        console.log("[DEBUG] Account: Real-time orders update:", updatedOrders);
        setOrders(updatedOrders);
        if (error) setError(null);
      },
      (err) => {
        console.error("[DEBUG] Account: Snapshot error:", err);
        if (!error) {
          setError(
            `Real-time update failed: ${
              err.code === "failed-precondition"
                ? "Missing index. Please create a composite index for 'customer.email' and 'createdAt' in Firebase Console."
                : err.message || "Please try again later."
            }`
          );
        }
      }
    );

    return () => {
      console.log("[DEBUG] Account: Unsubscribing from orders snapshot");
      unsubscribe();
    };
  }, [userEmail, error]);

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

  return (
    <section className="py-12 bg-gradient-to-b from-[#F5F5F5] to-cream-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-800 mb-8 tracking-tight">
          My Orders
        </h2>
        <p className="text-gray-600 text-sm font-sans mb-8">
          Manage your orders
        </p>
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
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#F5F5F5]">
                  <tr>
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
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-sans font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => {
                    const minimumAmountMessage = checkMinimumAmount(order);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-sans font-medium text-gray-900">
                          #{order.transactionRef || order.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-sans text-gray-500">
                          {order.createdAt
                            ? order.createdAt.toDate().toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-sans font-semibold rounded-full ${
                              order.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : order.status === "created"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-sans text-gray-900">
                          ₵
                          {order.totalAmount
                            ? order.totalAmount.toFixed(2)
                            : "0.00"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-sans text-gray-500">
                          {order.cartItems?.length || 0} items
                        </td>
                        <td className="px-4 py-3 text-sm font-sans text-gray-500">
                          {minimumAmountMessage ? (
                            <span className="text-red-600">
                              {minimumAmountMessage}
                            </span>
                          ) : (
                            "Eligible for delivery"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Account;
