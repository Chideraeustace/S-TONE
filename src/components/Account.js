import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../Firebase";

const Account = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [userType, setUserType] = useState("");

  // Simulate fetching user email and user type from localStorage (replace with Firebase Auth in production)
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const type = localStorage.getItem("userType") || "regular"; // Default to regular if not set
    if (!email) {
      setError("No user email found. Please complete a purchase first.");
      setLoading(false);
      return;
    }
    setUserEmail(email);
    setUserType(type);
  }, []);

  // Check minimum order amount for a single order
  const checkMinimumAmount = (order) => {
    const exchangeRate = 15.625; // 1 USD = 15.625 GHS
    const minimumAmountGHS = userType === "business" ? 7000 : 4000;
    const minimumAmountUSD = minimumAmountGHS / exchangeRate;
    const orderTotal = order.totalAmount
      ? order.totalAmount
      : order.amount
      ? parseFloat(order.amount)
      : 0;

    if (orderTotal < minimumAmountUSD) {
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
        // Query for regular orders with customer.email
        const regularQuery = query(
          collection(db, "lumixing-orders"),
          where("customer.email", "==", userEmail),
          orderBy("createdAt", "desc")
        );
        // Query for crypto orders with metadata.customer.email
        const cryptoQuery = query(
          collection(db, "lumixing-orders"),
          where("metadata.customer.email", "==", userEmail),
          orderBy("createdAt", "desc")
        );

        // Fetch both regular and crypto orders
        const [regularSnapshot, cryptoSnapshot] = await Promise.all([
          getDocs(regularQuery),
          getDocs(cryptoQuery),
        ]);

        const regularOrders = regularSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const cryptoOrders = cryptoSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Combine and sort orders by createdAt
        const allOrders = [...regularOrders, ...cryptoOrders].sort(
          (a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0)
        );

        setOrders(allOrders);
        setLoading(false);
      } catch (err) {
        console.error("Exact error fetching orders:", err);
        setError(
          `Failed to fetch orders: ${
            err.code === "failed-precondition"
              ? "Missing index. Please create composite indexes for 'customer.email' and 'createdAt', and 'metadata.customer.email' and 'createdAt' in Firebase Console."
              : err.message || "Please try again later."
          }`
        );
        setLoading(false);
      }
    };

    fetchOrders();

    // Set up real-time listeners for both regular and crypto orders
    const regularQuery = query(
      collection(db, "lumixing-orders"),
      where("customer.email", "==", userEmail),
      orderBy("createdAt", "desc")
    );
    const cryptoQuery = query(
      collection(db, "lumixing-orders"),
      where("metadata.customer.email", "==", userEmail),
      orderBy("createdAt", "desc")
    );

    const unsubscribeRegular = onSnapshot(
      regularQuery,
      (querySnapshot) => {
        const regularOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders((prevOrders) => {
          const cryptoOrders = prevOrders.filter((order) => order.chargeId);
          const updatedOrders = [...regularOrders, ...cryptoOrders].sort(
            (a, b) =>
              (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0)
          );
          return updatedOrders;
        });
        if (error) setError(null);
      },
      (err) => {
        console.error("Snapshot error (regular):", err);
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

    const unsubscribeCrypto = onSnapshot(
      cryptoQuery,
      (querySnapshot) => {
        const cryptoOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders((prevOrders) => {
          const regularOrders = prevOrders.filter((order) => !order.chargeId);
          const updatedOrders = [...regularOrders, ...cryptoOrders].sort(
            (a, b) =>
              (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0)
          );
          return updatedOrders;
        });
        if (error) setError(null);
      },
      (err) => {
        console.error("Snapshot error (crypto):", err);
        if (!error) {
          setError(
            `Real-time update failed: ${
              err.code === "failed-precondition"
                ? "Missing index. Please create a composite index for 'metadata.customer.email' and 'createdAt' in Firebase Console."
                : err.message || "Please try again later."
            }`
          );
        }
      }
    );

    return () => {
      unsubscribeRegular();
      unsubscribeCrypto();
    };
  }, [userEmail]);

  if (loading) {
    return (
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">My Orders</h2>
          <p className="text-gray-600 mb-8">Loading your orders...</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">My Orders</h2>
          <p className="text-red-600 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">My Orders</h2>
        <p className="text-gray-600 mb-8">Manage your orders</p>
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-lg text-gray-700 mb-4">No orders found.</p>
            <Link
              to="/category"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => {
                    const minimumAmountMessage = checkMinimumAmount(order);
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.transactionRef || order.chargeId || order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.createdAt
                            ? order.createdAt.toDate().toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          $
                          {order.totalAmount
                            ? order.totalAmount.toFixed(2)
                            : order.amount
                            ? parseFloat(order.amount).toFixed(2)
                            : "0.00"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.cartItems?.length ||
                            order.metadata?.cartItems?.length ||
                            0}{" "}
                          items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.chargeId ? "Crypto" : "Regular"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
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
