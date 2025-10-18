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

  // --- UPDATED IMAGE INPUT CHANGE HANDLER ---
  const handleMultipleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file: file, // The actual File object to be uploaded
      preview: URL.createObjectURL(file), // The temporary URL for immediate preview
    }));

    handleProductInputChange({
      target: {
        name: "imageFiles", // Key for the array of files
        value: newImages,
        files: files, // Pass files array
      },
    });

    // Clear the input value so the same file(s) can be selected again
    e.target.value = null;
  };
  // ------------------------------------------

  // ✨ NEW: Handler for Multi-Select Fields
  const handleMultiSelectChange = (e) => {
    const { name } = e.target;
    // Get an array of all selected values
    const selectedOptions = Array.from(e.target.options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    // Pass the name and the array of selected values to the parent handler
    handleProductInputChange({
      target: {
        name: name,
        // Send the array of strings as the value
        value: selectedOptions,
      },
    });
  };

  /**
   * Utility function to check if a value is selected.
   * Note: The state values for these fields (thickness, length, size, style)
   * must be stored as an array in the parent component for this to work.
   */
  const isSelected = (field, value) => {
    const currentValue = currentProduct[field];
    // Check if currentValue is an array and includes the option value
    if (Array.isArray(currentValue)) {
      return currentValue.includes(value);
    }
    // Fallback for single select, although it should be an array now
    return currentValue === value;
  };

  return (
    <section
      className="bg-white p-6 rounded-xl shadow-lg mb-8"
      data-aos="fade-up"
    >
      <h2 className="text-2xl font-semibold text-[#4A5D23] mb-6">
        {isEditing ? "Edit Product" : "Add New Product"}
      </h2>
      <form onSubmit={handleProductSubmit} className="space-y-4">
        {/* Title and Description */}
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

        {/* Image Upload Section (Remains the same) */}
        <div>
          <label
            htmlFor="imageFile"
            className="block text-sm font-medium text-[#4A5D23] mb-1"
          >
            Product Images
          </label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            accept="image/jpeg,image/png"
            multiple
            onChange={handleMultipleImageChange}
            className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#4A5D23] file:text-white hover:file:bg-[#3A4A1C] transition-colors"
            required={
              !isEditing &&
              (!currentProduct.images || currentProduct.images.length === 0)
            }
            aria-label="Upload Product Images"
          />
          {currentProduct.images && currentProduct.images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4">
              {currentProduct.images.map((image, index) => (
                <div
                  key={image.preview || index}
                  className="flex flex-col items-center"
                >
                  <img
                    src={image.preview}
                    alt={`${currentProduct.title || "Product"} preview ${
                      index + 1
                    }`}
                    className="h-24 w-24 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-600 hover:underline font-medium text-xs mt-1"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category and Subcategory sections (Remain the same) */}
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

        {/* ✨ UPDATED Lash Extension Fields for Multi-Select */}
        {isLashExtension && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="thickness"
                className="block text-sm font-medium text-[#4A5D23] mb-1"
              >
                Thickness (mm, optional) - **Hold Ctrl/Cmd to select multiple**
              </label>
              <select
                id="thickness"
                name="thickness"
                multiple // ✨ NEW: Allow multiple selections
                value={currentProduct.thickness || []} // Value must be an array for multi-select
                onChange={handleMultiSelectChange} // ✨ NEW: Use the multi-select handler
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors h-32"
                aria-label="Select Thickness"
              >
                {/* Removed the empty 'Select' option as it can interfere with multi-select logic */}
                {["0.03", "0.05", "0.07", "0.10", "0.15", "0.20"].map(
                  (value) => (
                    <option
                      key={value}
                      value={value}
                      // Use the isSelected helper for initial value
                      selected={isSelected("thickness", value)}
                    >
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
                Length (mm, optional) - **Hold Ctrl/Cmd to select multiple**
              </label>
              <select
                id="length"
                name="length"
                multiple // ✨ NEW
                value={currentProduct.length || []} // Value must be an array
                onChange={handleMultiSelectChange} // ✨ NEW
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors h-48"
                aria-label="Select Length"
              >
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
                  <option
                    key={value}
                    value={value}
                    selected={isSelected("length", value)}
                  >
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
                Size (optional) - **Hold Ctrl/Cmd to select multiple**
              </label>
              <select
                id="size"
                name="size"
                multiple // ✨ NEW
                value={currentProduct.size || []} // Value must be an array
                onChange={handleMultiSelectChange} // ✨ NEW
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors h-24"
                aria-label="Select Size"
              >
                {["Small", "Medium", "Large"].map((value) => (
                  <option
                    key={value}
                    value={value}
                    selected={isSelected("size", value)}
                  >
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
                Style (optional) - **Hold Ctrl/Cmd to select multiple**
              </label>
              <select
                id="style"
                name="style"
                multiple // ✨ NEW
                value={currentProduct.style || []} // Value must be an array
                onChange={handleMultiSelectChange} // ✨ NEW
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors h-40"
                aria-label="Select Style"
              >
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
                  <option
                    key={value}
                    value={value}
                    selected={isSelected("style", value)}
                  >
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Price, Quantity, and Colors fields (Remain the same) */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-[#4A5D23] mb-1"
          >
            Price (GHC)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={currentProduct.price}
            onChange={handleProductInputChange}
            placeholder="Enter price in GHC (e.g., 100)"
            step="0.01"
            min="0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4A5D23] focus:border-[#4A5D23] transition-colors"
            required
            aria-label="Product Price in GHC"
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
                // IMPORTANT: Revoke all Object URLs for cleanup
                currentProduct.images?.forEach((image) => {
                  if (image.preview) URL.revokeObjectURL(image.preview);
                });
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
