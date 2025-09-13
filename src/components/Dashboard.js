import { useState, useEffect } from "react";
import { db, storage } from "../Firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    imageFile: null,
    imagePreview: "",
    categoryId: "",
    price: "",
    quantity: "",
    colors: "",
    storage: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  // Fetch products, orders, and categories from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categorySnapshot = await getDocs(
          collection(db, "lumixing-categories")
        );
        const categoryList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryList);

        // Fetch products
        const productSnapshot = await getDocs(
          collection(db, "lumixing-product")
        );
        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);

        // Fetch orders
        const orderSnapshot = await getDocs(collection(db, "lumixing-orders"));
        const orderList = orderSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderList);

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle product form input changes
  const handleProductInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      const file = files[0];
      if (file) {
        // Validate file type and size
        const validTypes = ["image/jpeg", "image/png"];
        if (!validTypes.includes(file.type)) {
          setError("Please upload a JPEG or PNG image");
          setTimeout(() => setError(null), 3000);
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError("Image size must be less than 5MB");
          setTimeout(() => setError(null), 3000);
          return;
        }
        const previewUrl = URL.createObjectURL(file);
        if (editingProduct) {
          setEditingProduct({
            ...editingProduct,
            imageFile: file,
            imagePreview: previewUrl,
          });
        } else {
          setNewProduct({
            ...newProduct,
            imageFile: file,
            imagePreview: previewUrl,
          });
        }
      }
    } else {
      let formattedValue = value;
      if (name === "price" || name === "quantity") {
        formattedValue =
          value === "" ? "" : parseFloat(value) >= 0 ? value : "";
      }
      if (editingProduct) {
        setEditingProduct({ ...editingProduct, [name]: formattedValue });
      } else {
        setNewProduct({ ...newProduct, [name]: formattedValue });
      }
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        imageFile: null,
        imagePreview: editingProduct.imageUrl || "",
      });
    } else {
      setNewProduct({ ...newProduct, imageFile: null, imagePreview: "" });
    }
  };

  // Handle category form input changes
  const handleCategoryInputChange = (e) => {
    const { value } = e.target;
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        name: value,
        url: `/${value.toLowerCase().replace(/\s+/g, "-")}`,
      });
    } else {
      setNewCategoryName(value);
    }
  };

  // Add or update product
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate price and quantity
      const price = parseFloat(
        editingProduct ? editingProduct.price : newProduct.price
      );
      const quantity = parseInt(
        editingProduct ? editingProduct.quantity : newProduct.quantity,
        10
      );
      if (price < 0 || isNaN(price)) {
        setError("Price must be a non-negative number");
        setTimeout(() => setError(null), 3000);
        return;
      }
      if (quantity < 0 || isNaN(quantity)) {
        setError("Quantity must be a non-negative integer");
        setTimeout(() => setError(null), 3000);
        return;
      }

      // Prepare product data
      const productData = {
        title: editingProduct ? editingProduct.title : newProduct.title,
        description: editingProduct
          ? editingProduct.description
          : newProduct.description,
        categoryId: editingProduct
          ? editingProduct.categoryId
          : newProduct.categoryId,
        price,
        quantity,
        colors: (editingProduct ? editingProduct.colors : newProduct.colors)
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c),
        storage:
          (editingProduct ? editingProduct.storage : newProduct.storage) || "",
        createdAt: new Date(),
      };

      // Handle image upload
      let imageUrl = editingProduct ? editingProduct.imageUrl : "";
      const imageFile = editingProduct
        ? editingProduct.imageFile
        : newProduct.imageFile;
      if (imageFile) {
        const storageRef = ref(
          storage,
          `products/${
            editingProduct ? editingProduct.id : Date.now()
          }.${imageFile.name.split(".").pop()}`
        );
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);

        // Delete old image if editing and new image is uploaded
        if (
          editingProduct &&
          editingProduct.imageUrl &&
          editingProduct.imageUrl !== imageUrl
        ) {
          try {
            const oldImageRef = ref(storage, editingProduct.imageUrl);
            await deleteObject(oldImageRef);
          } catch (err) {
            console.warn("Failed to delete old image:", err);
          }
        }
      } else if (!imageUrl && editingProduct) {
        // Keep existing imageUrl if no new file is selected
        imageUrl = editingProduct.imageUrl;
      } else if (!imageUrl) {
        setError("Please upload an image");
        setTimeout(() => setError(null), 3000);
        return;
      }

      productData.imageUrl = imageUrl;

      if (editingProduct) {
        const productRef = doc(db, "lumixing-product", editingProduct.id);
        await updateDoc(productRef, productData);
        setProducts(
          products.map((p) =>
            p.id === editingProduct.id ? { id: p.id, ...productData } : p
          )
        );
        setEditingProduct(null);
        setSuccess("Product updated successfully");
      } else {
        const docRef = await addDoc(
          collection(db, "lumixing-product"),
          productData
        );
        setProducts([...products, { id: docRef.id, ...productData }]);
        setSuccess("Product added successfully");
      }
      setNewProduct({
        title: "",
        description: "",
        imageFile: null,
        imagePreview: "",
        categoryId: "",
        price: "",
        quantity: "",
        colors: "",
        storage: "",
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to save product");
      console.error(err);
      setTimeout(() => setError(null), 3000);
    }
  };

  // Delete product
  const handleProductDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const product = products.find((p) => p.id === id);
        if (product.imageUrl) {
          try {
            const imageRef = ref(storage, product.imageUrl);
            await deleteObject(imageRef);
          } catch (err) {
            console.warn("Failed to delete image:", err);
          }
        }
        await deleteDoc(doc(db, "lumixing-product", id));
        setProducts(products.filter((p) => p.id !== id));
        setSuccess("Product deleted successfully");
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError("Failed to delete product");
        console.error(err);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  // Start editing a product
  const handleProductEdit = (product) => {
    setEditingProduct({
      ...product,
      price: product.price || "",
      quantity: product.quantity || "",
      colors: product.colors ? product.colors.join(", ") : "",
      storage: product.storage || "",
      imageFile: null,
      imagePreview: product.imageUrl || "",
    });
  };

  // Add or update category
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryUrl = `/${newCategoryName
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
      // Validate URL uniqueness
      const existingCategory = categories.find(
        (c) =>
          c.url === (editingCategory ? editingCategory.url : categoryUrl) &&
          c.id !== (editingCategory ? editingCategory.id : null)
      );
      if (existingCategory) {
        setError("Category URL must be unique");
        setTimeout(() => setError(null), 3000);
        return;
      }

      if (editingCategory) {
        const categoryRef = doc(db, "lumixing-categories", editingCategory.id);
        await updateDoc(categoryRef, {
          name: editingCategory.name,
          url: editingCategory.url,
        });
        setCategories(
          categories.map((c) =>
            c.id === editingCategory.id ? editingCategory : c
          )
        );
        setEditingCategory(null);
        setSuccess("Category updated successfully");
      } else {
        const docRef = await addDoc(collection(db, "lumixing-categories"), {
          name: newCategoryName,
          url: categoryUrl,
        });
        setCategories([
          ...categories,
          { id: docRef.id, name: newCategoryName, url: categoryUrl },
        ]);
        setSuccess("Category added successfully");
      }
      setNewCategoryName("");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to save category");
      console.error(err);
      setTimeout(() => setError(null), 3000);
    }
  };

  // Delete category
  const handleCategoryDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const productsUsingCategory = products.filter(
          (p) => p.categoryId === id
        );
        if (productsUsingCategory.length > 0) {
          setError(
            "Cannot delete category: It is used by one or more products"
          );
          setTimeout(() => setError(null), 3000);
          return;
        }
        await deleteDoc(doc(db, "lumixing-categories", id));
        setCategories(categories.filter((c) => c.id !== id));
        setSuccess("Category deleted successfully");
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError("Failed to delete category");
        console.error(err);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  // Start editing a category
  const handleCategoryEdit = (category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
  };

  // Get category details by ID
  const getCategoryDetails = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category
      ? { name: category.name, url: category.url }
      : { name: "Unknown", url: "#" };
  };

  // Check if selected category is "Smartphones"
  const isSmartphoneCategory = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category && category.name.toLowerCase().includes("smartphones");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Admin Dashboard
        </h1>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg shadow-md flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg shadow-md flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Category Management Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h2>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={editingCategory ? editingCategory.name : newCategoryName}
                onChange={handleCategoryInputChange}
                placeholder="Enter category name (e.g., Smartphones)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                aria-label="Category Name"
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {editingCategory ? "Update Category" : "Add Category"}
              </button>
              {editingCategory && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setNewCategoryName("");
                  }}
                  className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors font-medium"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Category List Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Manage Categories
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    URL
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-800">{category.name}</td>
                    <td className="p-4">
                      <Link
                        to={category.url}
                        className="text-blue-600 hover:underline"
                      >
                        {category.url}
                      </Link>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleCategoryEdit(category)}
                        className="text-blue-600 hover:underline mr-4 font-medium"
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

        {/* Product Management Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={editingProduct ? editingProduct.title : newProduct.title}
                onChange={handleProductInputChange}
                placeholder="Enter product title"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                aria-label="Product Title"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Description
              </label>
              <textarea
                id="description"
                name="description"
                value={
                  editingProduct
                    ? editingProduct.description
                    : newProduct.description
                }
                onChange={handleProductInputChange}
                placeholder="Enter product description"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows="4"
                required
                aria-label="Product Description"
              />
            </div>
            <div>
              <label
                htmlFor="imageFile"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Product Image
              </label>
              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/jpeg,image/png"
                onChange={handleProductInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-colors"
                required={!editingProduct}
                aria-label="Upload Product Image"
              />
              {(editingProduct
                ? editingProduct.imagePreview
                : newProduct.imagePreview) && (
                <div className="mt-4 flex items-center space-x-4">
                  <img
                    src={
                      editingProduct
                        ? editingProduct.imagePreview
                        : newProduct.imagePreview
                    }
                    alt="Image Preview"
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={
                  editingProduct
                    ? editingProduct.categoryId
                    : newProduct.categoryId
                }
                onChange={handleProductInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                aria-label="Select Category"
              >
                <option value="" disabled>
                  Select Category
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
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={editingProduct ? editingProduct.price : newProduct.price}
                onChange={handleProductInputChange}
                placeholder="Enter price (e.g., 999.99)"
                step="0.01"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                aria-label="Product Price"
              />
            </div>
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={
                  editingProduct ? editingProduct.quantity : newProduct.quantity
                }
                onChange={handleProductInputChange}
                placeholder="Enter quantity (e.g., 100)"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                aria-label="Product Quantity"
              />
            </div>
            <div>
              <label
                htmlFor="colors"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Colors (comma-separated)
              </label>
              <input
                type="text"
                id="colors"
                name="colors"
                value={
                  editingProduct ? editingProduct.colors : newProduct.colors
                }
                onChange={handleProductInputChange}
                placeholder="Enter colors (e.g., Black, Silver, Blue)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-label="Product Colors"
              />
            </div>
            {isSmartphoneCategory(
              editingProduct ? editingProduct.categoryId : newProduct.categoryId
            ) && (
              <div>
                <label
                  htmlFor="storage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Storage (e.g., 128GB, 256GB)
                </label>
                <input
                  type="text"
                  id="storage"
                  name="storage"
                  value={
                    editingProduct ? editingProduct.storage : newProduct.storage
                  }
                  onChange={handleProductInputChange}
                  placeholder="Enter storage (e.g., 128GB, 256GB)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  aria-label="Product Storage"
                />
              </div>
            )}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
              {editingProduct && (
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors font-medium"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Product List Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Manage Products
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Image
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Price ($)
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Colors
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Storage
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const { name, url } = getCategoryDetails(product.categoryId);
                  return (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 text-gray-800">{product.title}</td>
                      <td className="p-4 text-gray-800">
                        {product.description}
                      </td>
                      <td className="p-4">
                        <a
                          href={product.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Image
                        </a>
                      </td>
                      <td className="p-4">
                        <Link
                          to={url}
                          className="text-blue-600 hover:underline"
                        >
                          {name}
                        </Link>
                      </td>
                      <td className="p-4 text-gray-800">
                        {product.price ? `$${product.price.toFixed(2)}` : "N/A"}
                      </td>
                      <td className="p-4 text-gray-800">
                        {product.quantity ?? "N/A"}
                      </td>
                      <td className="p-4 text-gray-800">
                        {product.colors ? product.colors.join(", ") : "N/A"}
                      </td>
                      <td className="p-4 text-gray-800">
                        {product.storage || "N/A"}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleProductEdit(product)}
                          className="text-blue-600 hover:underline mr-4 font-medium"
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

        {/* Order Tracking Section */}
        <section className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Customer Orders
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Order ID
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Customer Name
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-800">{order.id}</td>
                    <td className="p-4 text-gray-800">{order.customerName}</td>
                    <td className="p-4 text-gray-800">{order.product}</td>
                    <td className="p-4 text-gray-800">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
