import React from "react";

export const ProductForm = ({
  editingProduct,
  newProduct,
  categories,
  subcategories,
  handleProductInputChange,
  handleRemoveImage,
  handleProductSubmit,
  setEditingProduct,
  loading,
}) => {
  const isEditing = !!editingProduct;
  const currentProduct = isEditing ? editingProduct : newProduct;

  // Check if main category is "Lashes" and subcategory is "Eyelash Extension"
  const isLashExtension =
    currentProduct.categoryId &&
    categories.find((cat) => cat.id === currentProduct.categoryId)?.name ===
      "Lashes" &&
    currentProduct.subcategoryId &&
    subcategories.find((sub) => sub.id === currentProduct.subcategoryId)
      ?.name === "EyeLash Extensions";

  return (
    <section
      className="bg-white p-6 rounded-xl shadow-lg mb-8"
      data-aos="fade-up"
    >
      <h2 className="text-2xl font-semibold text-[#4A5D23] mb-6">
        {isEditing ? "Edit Product" : "Add New Product"}
      </h2>
      <form onSubmit={handleProductSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-[#4A5D23] mb-1"
          >
            Product Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={currentProduct.title}
            onChange={handleProductInputChange}
            placeholder="Enter product title"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors"
            required
            aria-label="Product Title"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-[#4A5D23] mb-1"
          >
            Product Description
          </label>
          <textarea
            id="description"
            name="description"
            value={currentProduct.description}
            onChange={handleProductInputChange}
            placeholder="Enter product description"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors"
            rows="4"
            required
            aria-label="Product Description"
          />
        </div>
        <div>
          <label
            htmlFor="imageFile"
            className="block text-sm font-medium text-[#4A5D23] mb-1"
          >
            Product Image
          </label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            accept="image/jpeg,image/png"
            onChange={handleProductInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#4A5D23] file:text-white hover:file:bg-[#3A4A1C] transition-colors"
            required={!isEditing}
            aria-label="Upload Product Image"
          />
          {currentProduct.imagePreview && (
            <div className="mt-4 flex items-center space-x-4">
              <img
                src={currentProduct.imagePreview}
                alt={`${currentProduct.title || "Product"} preview`}
                className="h-24 w-24 object-cover rounded-lg shadow-md"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-red-600 hover:underline font-medium"
              >
                Remove Image
              </button>
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-[#4A5D23] mb-1"
          >
            Main Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={currentProduct.categoryId}
            onChange={handleProductInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors"
            required
            aria-label="Select Main Category"
          >
            <option value="" disabled>
              Select Main Category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="subcategoryId"
            className="block text-sm font-medium text-[#4A5D23] mb-1"
          >
            Subcategory
          </label>
          <select
            id="subcategoryId"
            name="subcategoryId"
            value={currentProduct.subcategoryId}
            onChange={handleProductInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors"
            required
            aria-label="Select Subcategory"
          >
            <option value="" disabled>
              Select Subcategory
            </option>
            {subcategories
              .filter(
                (sub) => sub.parentCategoryId === currentProduct.categoryId
              )
              .map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
          </select>
        </div>
        {isLashExtension && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="thickness"
                className="block text-sm font-medium text-[#4A5D23] mb-1"
              >
                Thickness (mm, optional)
              </label>
              <select
                id="thickness"
                name="thickness"
                value={currentProduct.thickness || ""}
                onChange={handleProductInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors"
                aria-label="Select Thickness"
              >
                <option value="">Select Thickness (optional)</option>
                {["0.03", "0.05", "0.07", "0.10", "0.15", "0.20"].map(
                  (value) => (
                    <option key={value} value={value}>
                      {value} mm
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label
                htmlFor="length"
                className="block text-sm font-medium text-[#4A5D23] mb-1"
              >
                Length (mm, optional)
              </label>
              <select
                id="length"
                name="length"
                value={currentProduct.length || ""}
                onChange={handleProductInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors"
                aria-label="Select Length"
              >
                <option value="">Select Length (optional)</option>
                {[
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12",
                  "13",
                  "14",
                  "15",
                  "16",
                  "17",
                  "18",
                ].map((value) => (
                  <option key={value} value={value}>
                    {value} mm
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="size"
                className="block text-sm font-medium text-[#4A5D23] mb-1"
              >
                Size (optional)
              </label>
              <select
                id="size"
                name="size"
                value={currentProduct.size || ""}
                onChange={handleProductInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors"
                aria-label="Select Size"
              >
                <option value="">Select Size (optional)</option>
                {["Small", "Medium", "Large"].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="style"
                className="block text-sm font-medium text-[#4A5D23] mb-1"
              >
                Style (optional)
              </label>
              <select
                id="style"
                name="style"
                value={currentProduct.style || ""}
                onChange={handleProductInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors"
                aria-label="Select Style"
              >
                <option value="">Select Style (optional)</option>
                {[
                  "1D",
                  "2D",
                  "3D",
                  "4D",
                  "5D",
                  "6D",
                  "7D",
                  "8D",
                  "9D",
                  "10D",
                ].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-[#4A5D23] mb-1"
          >
            Price (USD)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={currentProduct.price}
            onChange={handleProductInputChange}
            placeholder="Enter price in USD (e.g., 29.99)"
            step="0.01"
            min="0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors"
            required
            aria-label="Product Price in USD"
          />
        </div>
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-medium text-[#4A5D23] mb-1"
          >
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={currentProduct.quantity}
            onChange={handleProductInputChange}
            placeholder="Enter quantity (e.g., 100)"
            min="0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors"
            required
            aria-label="Product Quantity"
          />
        </div>
        <div>
          <label
            htmlFor="colors"
            className="block text-sm font-medium text-[#4A5D23] mb-1"
          >
            Colors (comma-separated)
          </label>
          <input
            type="text"
            id="colors"
            name="colors"
            value={currentProduct.colors}
            onChange={handleProductInputChange}
            placeholder="Enter colors (e.g., Black, Red, Nude)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors"
            aria-label="Product Colors"
          />
        </div>
        <div className="flex space-x-4">
          <button
            type="submit"
            className="flex-1 bg-[#4A5D23] text-white px-4 py-2 rounded-lg hover:bg-[#3A4A1C] transition-colors font-medium"
            disabled={loading}
          >
            {isEditing ? "Update Product" : "Add Product"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                if (currentProduct.imagePreview) {
                  URL.revokeObjectURL(currentProduct.imagePreview);
                }
                setEditingProduct(null);
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
};
