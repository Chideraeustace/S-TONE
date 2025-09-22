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

  // Simulate fetching user email from localStorage (replace with Firebase Auth in production)
  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      setError("No user email found. Please complete a purchase first.");
      setLoading(false);
      return;
    }
    setUserEmail(email);
  }, []);

  // Fetch user's orders from Firestore
  useEffect(() => {
    if (!userEmail) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, "lumixing-orders"),
          where("customer.email", "==", userEmail),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
        setLoading(false);
      } catch (err) {
        console.error("Exact error fetching orders:", err); // Log exact error for debugging
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

    // Set up real-time listener after initial fetch
    const q = query(
      collection(db, "lumixing-orders"),
      where("customer.email", "==", userEmail),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersData);
        if (error) setError(null); // Clear error on successful snapshot
      },
      (err) => {
        console.error("Snapshot error:", err);
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

    return () => unsubscribe();
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
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.transactionRef}
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
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${order.totalAmount?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.cartItems?.length || 0} items
                      </td>
                    </tr>
                  ))}
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
