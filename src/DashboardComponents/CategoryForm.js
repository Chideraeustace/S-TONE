import React from "react";

export const CategoryForm = ({
  editingCategory,
  newCategory,
  categories,
  handleCategoryInputChange,
  handleCategorySubmit,
  setEditingCategory,
  setNewCategory,
}) => (
  <section
    className="bg-white p-6 rounded-xl shadow-lg mb-8"
    data-aos="fade-up"
  >
    <h2 className="text-2xl font-semibold text-[#4A5D23] mb-6">
      {editingCategory ? "Edit Category" : "Add New Category"}
    </h2>
    <form onSubmit={handleCategorySubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-[#4A5D23] mb-1"
        >
          Category Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={editingCategory ? editingCategory.name : newCategory.name}
          onChange={handleCategoryInputChange}
          placeholder="Enter category name (e.g., Lashes)"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors"
          required
          aria-label="Category Name"
        />
      </div>
      <div>
        <label
          htmlFor="isSubcategory"
          className="flex items-center text-sm font-medium text-[#4A5D23] mb-1"
        >
          <input
            type="checkbox"
            id="isSubcategory"
            name="isSubcategory"
            checked={
              editingCategory
                ? editingCategory.isSubcategory
                : newCategory.isSubcategory
            }
            onChange={handleCategoryInputChange}
            className="mr-2"
            aria-label="Is Subcategory"
          />
          Is Subcategory
        </label>
      </div>
      {(editingCategory
        ? editingCategory.isSubcategory
        : newCategory.isSubcategory) && (
        <div>
          <label
            htmlFor="parentCategoryId"
            className="block text-sm font-medium text-[#4A5D23] mb-1"
          >
            Parent Category
          </label>
          <select
            id="parentCategoryId"
            name="parentCategoryId"
            value={
              editingCategory
                ? editingCategory.parentCategoryId
                : newCategory.parentCategoryId
            }
            onChange={handleCategoryInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors"
            required
            aria-label="Select Parent Category"
          >
            <option value="" disabled>
              Select Parent Category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex space-x-4">
        <button
          type="submit"
          className="flex-1 bg-[#4A5D23] text-white px-4 py-2 rounded-lg hover:bg-[#3A4A1C] transition-colors font-medium"
        >
          {editingCategory ? "Update Category" : "Add Category"}
        </button>
        {editingCategory && (
          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setNewCategory({
                name: "",
                isSubcategory: false,
                parentCategoryId: "",
              });
            }}
            className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors font-medium"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  </section>
);
