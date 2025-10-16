import React from "react";

export const OrderList = ({ orders, getPaymentType, formatDate }) => (
  <section className="bg-white p-6 rounded-xl shadow-lg" data-aos="fade-up">
    <h2 className="text-2xl font-semibold text-[#4A5D23] mb-6">
      Customer Orders
    </h2>
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Order ID
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Customer
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Product
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Amount (USD)
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Payment Type
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Status
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Order Date
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Details
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isCrypto = order.chargeId && order.hostedUrl;
            const customer = isCrypto
              ? order.metadata?.customer
              : order.customer;
            const cartItems = isCrypto
              ? order.metadata?.cartItems
              : order.cartItems;
            return (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-[#4A5D23]">
                  {order.chargeId || order.transactionRef || order.id}
                </td>
                <td className="p-4 text-[#4A5D23]">
                  {customer && customer.name ? customer.name : "N/A"}
                </td>
                <td className="p-4 text-[#4A5D23]">
                  {cartItems && cartItems.length > 0 && cartItems[0].name
                    ? cartItems[0].name
                    : "N/A"}
                  {cartItems &&
                    cartItems.length > 0 &&
                    cartItems[0].selectedColor && (
                      <span className="text-gray-600">
                        {" (" + cartItems[0].selectedColor + ")"}
                      </span>
                    )}
                </td>
                <td className="p-4 text-[#4A5D23]">
                  $
                  {order.amount || order.totalAmount
                    ? parseFloat(order.amount || order.totalAmount).toFixed(2)
                    : "N/A"}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      getPaymentType(order) === "Crypto"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-[#4A5D23] text-white"
                    }`}
                  >
                    {getPaymentType(order)}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === "created"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-[#4A5D23]"
                    }`}
                  >
                    {order.status || "N/A"}
                  </span>
                </td>
                <td className="p-4 text-[#4A5D23]">
                  {formatDate(order.createdAt)}
                </td>
                <td className="p-4">
                  <button
                    onClick={() =>
                      alert(
                        `Order ID: ${
                          order.chargeId || order.transactionRef || order.id
                        }\n` +
                          `Customer Name: ${
                            customer && customer.name ? customer.name : "N/A"
                          }\n` +
                          `Email: ${
                            customer && customer.email ? customer.email : "N/A"
                          }\n` +
                          `Phone: ${
                            customer && customer.phone ? customer.phone : "N/A"
                          }\n` +
                          `Location: ${
                            customer && customer.location
                              ? customer.location
                              : "N/A"
                          }\n` +
                          `Product: ${
                            cartItems &&
                            cartItems.length > 0 &&
                            cartItems[0].name
                              ? cartItems[0].name
                              : "N/A"
                          }\n` +
                          `Product ID: ${
                            cartItems && cartItems.length > 0 && cartItems[0].id
                              ? cartItems[0].id
                              : "N/A"
                          }\n` +
                          `Quantity: ${
                            cartItems &&
                            cartItems.length > 0 &&
                            cartItems[0].quantity
                              ? cartItems[0].quantity
                              : "N/A"
                          }\n` +
                          `Color: ${
                            cartItems &&
                            cartItems.length > 0 &&
                            cartItems[0].selectedColor
                              ? cartItems[0].selectedColor
                              : "N/A"
                          }\n` +
                          `Product Price: $${
                            cartItems &&
                            cartItems.length > 0 &&
                            cartItems[0].price
                              ? cartItems[0].price.toFixed(2)
                              : "N/A"
                          }\n` +
                          `Subtotal: $${
                            order.subtotal ? order.subtotal.toFixed(2) : "N/A"
                          }\n` +
                          `Shipping Fee: $${
                            order.shippingFee
                              ? order.shippingFee.toFixed(2)
                              : "N/A"
                          }\n` +
                          `Total Amount: $${
                            order.amount || order.totalAmount
                              ? parseFloat(
                                  order.amount || order.totalAmount
                                ).toFixed(2)
                              : "N/A"
                          }\n` +
                          `Order Date: ${formatDate(order.createdAt)}\n` +
                          `Webhook Received: ${
                            formatDate(order.webhookReceivedAt) || "N/A"
                          }\n` +
                          `Webhook Event: ${order.webhookEvent || "N/A"}\n` +
                          `Charge ID: ${order.chargeId || "N/A"}\n` +
                          `Crypto Payment URL: ${order.hostedUrl || "N/A"}\n` +
                          `Transaction Reference: ${
                            order.transactionRef || "N/A"
                          }\n` +
                          `Metadata: ${
                            order.metadata
                              ? JSON.stringify(order.metadata, null, 2)
                              : "N/A"
                          }`
                      )
                    }
                    className="text-[#4A5D23] hover:underline font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </section>
);
