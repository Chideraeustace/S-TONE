import React from "react";

export const OrderList = ({ orders, formatDate }) => (
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
              Details
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Amount (USD)
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Shipping Fee
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Status
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Order Date
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              More Info
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
            const firstCartItem =
              cartItems && cartItems.length > 0 ? cartItems[0] : null;

            // Determine Product Details string
            let productDetails = [];
            if (firstCartItem && firstCartItem.style)
              productDetails.push(firstCartItem.style);
            if (firstCartItem && firstCartItem.thickness)
              productDetails.push(firstCartItem.thickness);
            if (firstCartItem && firstCartItem.length)
              productDetails.push(firstCartItem.length);
            if (firstCartItem && firstCartItem.size)
              productDetails.push(firstCartItem.size);
            const productDetailsString =
              productDetails.length > 0 ? productDetails.join(" / ") : "N/A";

            return (
              <tr
                key={order.id || order.transactionRef || order.chargeId}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-4 text-[#4A5D23]">
                  {order.chargeId || order.transactionRef || order.id}
                </td>
                <td className="p-4 text-[#4A5D23]">
                  {customer && customer.name ? customer.name : "N/A"}
                </td>
                <td className="p-4 text-[#4A5D23]">
                  {firstCartItem && firstCartItem.name
                    ? firstCartItem.name
                    : "N/A"}
                  {firstCartItem && firstCartItem.selectedColor && (
                    <span className="text-gray-600">
                      {" (" + firstCartItem.selectedColor + ")"}
                    </span>
                  )}
                </td>
                <td className="p-4 text-[#4A5D23] text-xs max-w-[150px]">
                  {productDetailsString}
                </td>
                <td className="p-4 text-[#4A5D23]">
                  $
                  {order.amount || order.totalAmount
                    ? parseFloat(order.amount || order.totalAmount).toFixed(2)
                    : "N/A"}
                </td>
                <td className="p-4 text-[#4A5D23]">
                  $
                  {order.shippingFee !== undefined && order.shippingFee !== null
                    ? parseFloat(order.shippingFee).toFixed(2)
                    : "0.00"}
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
                          `Status: ${order.status || "N/A"}\n` +
                          `Order Date: ${formatDate(order.createdAt)}\n` +
                          "---------------------------\n" +
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
                          `Pickup Option: ${
                            customer && customer.pickupOption
                              ? customer.pickupOption
                              : "N/A"
                          }\n` +
                          (order.selectedPickupLocation
                            ? `Pickup Location: ${order.selectedPickupLocation.name} (${order.selectedPickupLocation.address})\n`
                            : "") +
                          "---------------------------\n" +
                          `Product: ${
                            firstCartItem && firstCartItem.name
                              ? firstCartItem.name
                              : "N/A"
                          }\n` +
                          `Product ID: ${
                            firstCartItem && firstCartItem.id
                              ? firstCartItem.id
                              : "N/A"
                          }\n` +
                          `Quantity: ${
                            firstCartItem && firstCartItem.quantity
                              ? firstCartItem.quantity
                              : "N/A"
                          }\n` +
                          `Color: ${
                            firstCartItem && firstCartItem.selectedColor
                              ? firstCartItem.selectedColor
                              : firstCartItem && firstCartItem.color
                              ? firstCartItem.color
                              : "N/A"
                          }\n` +
                          `Length: ${
                            firstCartItem && firstCartItem.length
                              ? firstCartItem.length
                              : "N/A"
                          }\n` +
                          `Size: ${
                            firstCartItem && firstCartItem.size
                              ? firstCartItem.size
                              : "N/A"
                          }\n` +
                          `Style: ${
                            firstCartItem && firstCartItem.style
                              ? firstCartItem.style
                              : "N/A"
                          }\n` +
                          `Thickness: ${
                            firstCartItem && firstCartItem.thickness
                              ? firstCartItem.thickness
                              : "N/A"
                          }\n` +
                          `Product Price: $${
                            firstCartItem && firstCartItem.price
                              ? firstCartItem.price.toFixed(2)
                              : "N/A"
                          }\n` +
                          "---------------------------\n" +
                          `Subtotal: $${
                            order.subtotal ? order.subtotal.toFixed(2) : "N/A"
                          }\n` +
                          `Shipping Fee: $${
                            order.shippingFee !== undefined &&
                            order.shippingFee !== null
                              ? parseFloat(order.shippingFee).toFixed(2)
                              : "0.00"
                          }\n` +
                          `Total Amount: $${
                            order.amount || order.totalAmount
                              ? parseFloat(
                                  order.amount || order.totalAmount
                                ).toFixed(2)
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
