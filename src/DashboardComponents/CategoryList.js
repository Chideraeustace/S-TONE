import React from "react";
import { Link } from "react-router-dom";

export const CategoryList = ({
  categories,
  subcategories,
  handleCategoryEdit,
  handleCategoryDelete,
}) => (
  <section
    className="bg-white p-6 rounded-xl shadow-lg mb-8"
    data-aos="fade-up"
  >
    <h2 className="text-2xl font-semibold text-[#4A5D23] mb-6">
      Manage Categories
    </h2>
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Name
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Type
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Parent Category
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              URL
            </th>
            <th className="p-4 text-left text-sm font-semibold text-[#4A5D23]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.concat(subcategories).map((category) => (
            <tr key={category.id} className="border-b hover:bg-gray-50">
              <td className="p-4 text-[#4A5D23]">{category.name}</td>
              <td className="p-4 text-[#4A5D23]">
                {category.isSubcategory ? "Subcategory" : "Main Category"}
              </td>
              <td className="p-4 text-[#4A5D23]">
                {category.isSubcategory
                  ? categories.find((c) => c.id === category.parentCategoryId)
                      ?.name || "N/A"
                  : "N/A"}
              </td>
              <td className="p-4">
                <Link
                  to={category.url}
                  className="text-[#4A5D23] hover:underline"
                >
                  {category.url}
                </Link>
              </td>
              <td className="p-4">
                <button
                  onClick={() => handleCategoryEdit(category)}
                  className="text-[#4A5D23] hover:underline mr-4 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleCategoryDelete(category.id)}
                  className="text-red-600 hover:underline font-medium"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
