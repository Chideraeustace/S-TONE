import React from "react";

export const ProductList = ({
  products,
  getCategoryDetails,
  handleProductEdit,
  handleProductDelete,
  formatDate,
}) => (
  <section
    className="bg-white p-6 rounded-xl shadow-lg mb-8"
    data-aos="fade-up"
  >
    <h2 className="text-2xl font-semibold text-[#4A5D23] mb-6">
      Manage Products
    </h2>
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Title
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Category
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Subcategory
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const { categoryName, subcategoryName } = getCategoryDetails(
              product.categoryId,
              product.subcategoryId
            );
            return (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="p-4 text-[#4A5D23]">{product.title}</td>
                <td className="p-4 text-[#4A5D23]">{categoryName}</td>
                <td className="p-4 text-[#4A5D23]">{subcategoryName}</td>
                <td className="p-4">
                  <button
                    onClick={() =>
                      alert(
                        `Product ID: ${product.id}\n` +
                          `Title: ${product.title}\n` +
                          `Description: ${product.description}\n` +
                          `Image URL: ${product.imageUrl || "N/A"}\n` +
                          `Category: ${categoryName}\n` +
                          `Subcategory: ${subcategoryName}\n` +
                          `Price: $${
                            product.price ? product.price.toFixed(2) : "N/A"
                          }\n` +
                          `Quantity: ${product.quantity ?? "N/A"}\n` +
                          `Colors: ${
                            product.colors ? product.colors.join(", ") : "N/A"
                          }\n` +
                          `Created At: ${formatDate(product.createdAt)}`
                      )
                    }
                    className="text-[#4A5D23] hover:underline mr-4 font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleProductEdit(product)}
                    className="text-[#4A5D23] hover:underline mr-4 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleProductDelete(product.id)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Delete
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
