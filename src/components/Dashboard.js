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
import { AlertMessages } from "../DashboardComponents/AlertMessage";
import { ProductForm } from "../DashboardComponents/ProductForm";
import { ProductList } from "../DashboardComponents/ProductList";
import { CategoryForm } from "../DashboardComponents/CategoryForm";
import { CategoryList } from "../DashboardComponents/CategoryList";
import { OrderList } from "../DashboardComponents/OrderList";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // 💥 MAJOR UPDATE 1: Product State Structure
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    // Changed from singular imageFile/imagePreview to an array of images
    images: [], // Array of { file: File, preview: URL, imageUrl: string (for existing) }
    categoryId: "",
    subcategoryId: "",
    price: "",
    quantity: "",
    colors: "",
    thickness: "", // Add optional fields to state
    length: "",
    size: "",
    style: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    isSubcategory: false,
    parentCategoryId: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("products");

  // Determine which state object to use for updates
  const setProductState = editingProduct ? setEditingProduct : setNewProduct;
  const currentProduct = editingProduct || newProduct;

  // 💥 UPDATE 2: Cleanup temporary URLs in useEffect
  useEffect(() => {
    return () => {
      // Clean up ALL temporary image URLs when component unmounts
      const allImages = [
        ...newProduct.images,
        ...(editingProduct?.images || []),
      ];
      allImages.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    };
  }, [newProduct.images, editingProduct?.images]); // Depend on the image arrays

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categorySnapshot = await getDocs(
          collection(db, "s-tone-categories")
        );
        const categoryList = categorySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoryList.filter((c) => !c.isSubcategory));
        setSubcategories(categoryList.filter((c) => c.isSubcategory));

        const productSnapshot = await getDocs(
          collection(db, "s-tone-products")
        );
        // Ensure products loaded from Firestore have an 'images' array (even if empty)
        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          images: doc.data().images || [], // Ensure it's an array for consistency
        }));
        setProducts(productList);

        const orderSnapshot = await getDocs(collection(db, "s-tone-orders"));
        const orderList = orderSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderList);

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data: " + err.message);
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 💥 UPDATE 3: handleProductInputChange (Handles both normal fields AND new image array)
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    const files = e.target.files;

    // 1. Handle Multiple Image Files (from custom handler in ProductForm)
    if (name === "imageFiles" && Array.isArray(value)) {
      // 'value' is an array of { file: File, preview: URL } objects passed from the form
      // Basic file validation could go here, but it's easier to do it per file upon selection in ProductForm
      setProductState((prev) => ({
        ...prev,
        images: [...prev.images, ...value], // Append new images to the array
      }));
      return;
    }

    // Original imageFile logic is no longer needed but kept for other checks
    if (name === "imageFile" && files) {
      // This block is only if you want to fall back to singular image upload or for validation before the custom handler
      // Since we're using a custom handler in ProductForm, this block can typically be removed or simplified.
      // If the custom handler calls this function, the logic below is obsolete.
      // The previous logic for a single file is now irrelevant for multi-upload.
      return;
    }

    // 2. Handle All Other Non-File Inputs
    let formattedValue = value;
    if (name === "price" || name === "quantity") {
      formattedValue = value === "" ? "" : parseFloat(value) >= 0 ? value : "";
    }

    // 3. Handle Category Change (Reset Subcategory if Main Category changes)
    if (name === "categoryId") {
      setProductState((prev) => ({
        ...prev,
        [name]: formattedValue,
        subcategoryId: "", // Reset subcategory when main category changes
      }));
      return;
    }

    setProductState((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  // 💥 UPDATE 4: handleRemoveImage (Removes image by index and revokes URL)
  const handleRemoveImage = (indexToRemove) => {
    setProductState((prev) => {
      const imageToRemove = prev.images[indexToRemove];

      // Revoke the temporary URL to free up memory
      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      // Filter out the image at the specified index
      const updatedImages = prev.images.filter(
        (_, index) => index !== indexToRemove
      );

      return {
        ...prev,
        images: updatedImages,
      };
    });
  };

  const handleCategoryInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const formattedValue = type === "checkbox" ? checked : value;
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        [name]: formattedValue,
        url:
          name === "name"
            ? `/${value.toLowerCase().replace(/\s+/g, "-")}`
            : editingCategory.url,
      });
    } else {
      setNewCategory({
        ...newCategory,
        [name]: formattedValue,
        url:
          name === "name"
            ? `/${value.toLowerCase().replace(/\s+/g, "-")}`
            : newCategory.url,
      });
    }
  };

  // 💥 UPDATE 5: handleProductSubmit (Handles multiple file uploads)
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const product = editingProduct || newProduct;
    const isEditing = !!editingProduct;

    // Basic Required Field Validation
    if (
      !product.title ||
      !product.description ||
      !product.categoryId ||
      !product.subcategoryId ||
      !product.price ||
      !product.quantity
    ) {
      setError("Please fill in all required fields.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Multi-Image Validation
    if (!product.images || product.images.length === 0) {
      setError("Please select at least one image file.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const price = parseFloat(product.price);
    const quantity = parseInt(product.quantity, 10);
    if (isNaN(price) || price < 0) {
      setError("Price must be a non-negative number.");
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (isNaN(quantity) || quantity < 0) {
      setError("Quantity must be a non-negative number.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    try {
      const productData = {
        title: product.title,
        description: product.description,
        categoryId: product.categoryId,
        subcategoryId: product.subcategoryId,
        price,
        quantity,
        colors: product.colors
          ? product.colors
              .split(",")
              .map((c) => c.trim())
              .filter((c) => c)
          : [],
        thickness: product.thickness || null, // Include optional fields
        length: product.length || null,
        size: product.size || null,
        style: product.style || null,
        // The array to hold the FINAL public image URLs
        images: [],
        createdAt: new Date(),
      };

      const uploadPromises = product.images.map(async (imageObject) => {
        // Only upload file objects (newly added files or files being replaced)
        if (imageObject.file) {
          const file = imageObject.file;
          const fileExtension = file.name.split(".").pop();
          // Generate a unique file name for each image, using the product ID if editing
          const uniqueFileName = `${
            isEditing ? product.id : Date.now()
          }_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 9)}.${fileExtension}`;

          const storageRef = ref(
            storage,
            `products/${uniqueFileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`
          );

          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          return {
            url: downloadURL,
            path: storageRef.fullPath, // Store path for easier deletion later
          };
        }
        // Keep existing image URLs if no new file was uploaded for this slot
        return {
          url: imageObject.url,
          path: imageObject.path,
        };
      });

      // Resolve all upload promises
      const newImageUrls = (await Promise.all(uploadPromises)).filter(
        (img) => img.url
      );

      // Handle old image deletion (complex for multi-upload, generally done by tracking diffs)
      // For simplicity here, we will *only* delete old images if a product is being edited
      // and we are replacing the entire image set, which is not the case here.
      // We assume images are only added/removed, and the old image URLs in the DB are handled below.

      productData.images = newImageUrls;

      // 🚨 Deleting Old Images (Simplified Logic for multi-upload)
      if (isEditing) {
        const oldImages =
          products.find((p) => p.id === product.id)?.images || [];
        const currentUrls = newImageUrls.map((img) => img.url);

        const imagesToDelete = oldImages.filter(
          (oldImg) => !currentUrls.includes(oldImg.url) && oldImg.path // Find images in DB that aren't in the new list
        );

        await Promise.all(
          imagesToDelete.map(async (img) => {
            try {
              const imageRef = ref(storage, img.path);
              await deleteObject(imageRef);
            } catch (err) {
              // Suppress error if file doesn't exist (e.g., if path was just the URL)
              console.warn("Failed to delete old image:", err);
            }
          })
        );
      }

      if (isEditing) {
        const productRef = doc(db, "s-tone-products", editingProduct.id);
        await updateDoc(productRef, productData);
        setProducts(
          products.map((p) =>
            p.id === editingProduct.id ? { id: p.id, ...productData } : p
          )
        );
        setEditingProduct(null);
        setSuccess("Product updated successfully!");
      } else {
        const docRef = await addDoc(
          collection(db, "s-tone-products"),
          productData
        );
        setProducts([...products, { id: docRef.id, ...productData }]);
        setSuccess("Product added successfully!");
      }

      // Cleanup local preview URLs for the submitted product
      product.images.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });

      // Reset new product form state
      setNewProduct(initialNewProductState); // Use a cleaner initial state definition
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(
        err.code === "storage/unauthorized"
          ? "Unauthorized: Please log in to upload images."
          : `Failed to save product: ${err.message}`
      );
      console.error(err);
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Define a cleaner initial state object for reset
  const initialNewProductState = {
    title: "",
    description: "",
    images: [],
    categoryId: "",
    subcategoryId: "",
    price: "",
    quantity: "",
    colors: "",
    thickness: "",
    length: "",
    size: "",
    style: "",
  };

  // 💥 UPDATE 6: handleProductDelete (Handles deleting all associated images)
  const handleProductDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const product = products.find((p) => p.id === id);

        // Delete all associated images
        if (product.images && product.images.length > 0) {
          await Promise.all(
            product.images.map(async (image) => {
              if (image.path) {
                // Only attempt to delete if a storage path exists
                try {
                  const imageRef = ref(storage, image.path);
                  await deleteObject(imageRef);
                } catch (err) {
                  console.warn(
                    `Failed to delete image at path ${image.path}:`,
                    err
                  );
                }
              }
            })
          );
        }

        await deleteDoc(doc(db, "s-tone-products", id));
        setProducts(products.filter((p) => p.id !== id));
        setSuccess("Product deleted successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError("Failed to delete product: " + err.message);
        console.error(err);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  // 💥 UPDATE 7: handleProductEdit (Formats existing product data for the form)
  const handleProductEdit = (product) => {
    // Transform the Firestore images array for the form
    const imagesForForm = (product.images || []).map((img) => ({
      url: img.url, // The permanent download URL
      path: img.path, // The permanent storage path
      preview: img.url, // Use the permanent URL for preview
      file: null, // No new file yet
    }));

    setEditingProduct({
      ...product,
      price: product.price || "",
      quantity: product.quantity || "",
      colors: product.colors ? product.colors.join(", ") : "",
      images: imagesForForm, // Set the formatted image array
      // Include optional fields for editing
      thickness: product.thickness || "",
      length: product.length || "",
      size: product.size || "",
      style: product.style || "",
    });
  };

  // ... (Category handlers remain the same)
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const categoryUrl = `/${currentProduct.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
      const existingCategory = categories
        .concat(subcategories)
        .find(
          (c) =>
            c.url === (editingCategory ? editingCategory.url : categoryUrl) &&
            c.id !== (editingCategory ? editingCategory.id : null)
        );
      if (existingCategory) {
        setError("Category URL must be unique.");
        setTimeout(() => setError(null), 3000);
        return;
      }

      if (editingCategory) {
        const categoryRef = doc(db, "s-tone-categories", editingCategory.id);
        await updateDoc(categoryRef, {
          name: editingCategory.name,
          url: editingCategory.url,
          isSubcategory: editingCategory.isSubcategory,
          parentCategoryId: editingCategory.parentCategoryId,
        });
        if (editingCategory.isSubcategory) {
          setSubcategories(
            subcategories.map((c) =>
              c.id === editingCategory.id ? editingCategory : c
            )
          );
        } else {
          setCategories(
            categories.map((c) =>
              c.id === editingCategory.id ? editingCategory : c
            )
          );
        }
        setEditingCategory(null);
        setSuccess("Category updated successfully!");
      } else {
        const docRef = await addDoc(collection(db, "s-tone-categories"), {
          name: newCategory.name,
          url: categoryUrl,
          isSubcategory: newCategory.isSubcategory,
          parentCategoryId: newCategory.isSubcategory
            ? newCategory.parentCategoryId
            : "",
        });
        const newCategoryData = {
          id: docRef.id,
          name: newCategory.name,
          url: categoryUrl,
          isSubcategory: newCategory.isSubcategory,
          parentCategoryId: newCategory.isSubcategory
            ? newCategory.parentCategoryId
            : "",
        };
        if (newCategory.isSubcategory) {
          setSubcategories([...subcategories, newCategoryData]);
        } else {
          setCategories([...categories, newCategoryData]);
        }
        setSuccess("Category added successfully!");
      }
      setNewCategory({ name: "", isSubcategory: false, parentCategoryId: "" });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to save category: " + err.message);
      console.error(err);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleCategoryDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const isSubcategory = subcategories.find((c) => c.id === id);
        const productsUsingCategory = products.filter(
          (p) => p.categoryId === id || p.subcategoryId === id
        );
        if (productsUsingCategory.length > 0) {
          setError(
            "Cannot delete category: It is used by one or more products."
          );
          setTimeout(() => setError(null), 3000);
          return;
        }
        if (!isSubcategory) {
          const subcategoriesUsingCategory = subcategories.filter(
            (s) => s.parentCategoryId === id
          );
          if (subcategoriesUsingCategory.length > 0) {
            setError(
              "Cannot delete main category: It has associated subcategories."
            );
            setTimeout(() => setError(null), 3000);
            return;
          }
        }
        await deleteDoc(doc(db, "s-tone-categories", id));
        if (isSubcategory) {
          setSubcategories(subcategories.filter((c) => c.id !== id));
        } else {
          setCategories(categories.filter((c) => c.id !== id));
        }
        setSuccess("Category deleted successfully!");
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError("Failed to delete category: " + err.message);
        console.error(err);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleCategoryEdit = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      isSubcategory: category.isSubcategory,
      parentCategoryId: category.parentCategoryId || "",
    });
  };

  // ... (Utility functions remain the same)
  const getCategoryDetails = (categoryId, subcategoryId) => {
    const category = categories.find((cat) => cat.id === categoryId) || {
      name: "Unknown",
      url: "#",
    };
    const subcategory = subcategories.find(
      (sub) => sub.id === subcategoryId
    ) || { name: "Unknown" };
    return {
      categoryName: category.name,
      categoryUrl: category.url,
      subcategoryName: subcategory.name,
    };
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getPaymentType = (order) => {
    return order.chargeId && order.hostedUrl ? "Crypto" : "Regular";
  };
  // ... (Loader and JSX rendering remain the same)

  if (loading) {
    return (
      <div className="min-h-screen bg-whitesmoke flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#4A5D23]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-whitesmoke p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        <h1
          className="text-4xl font-bold text-[#4A5D23] mb-8 text-center"
          data-aos="fade-up"
        >
          Admin Dashboard
        </h1>

        <AlertMessages success={success} error={error} />

        <div className="mb-8">
          <div
            className="flex space-x-4 overflow-x-auto sm:justify-center"
            role="tablist"
            data-aos="fade-up"
          >
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A5D23] ${
                activeTab === "products"
                  ? "bg-[#4A5D23] text-white"
                  : "bg-gray-200 text-[#4A5D23] hover:bg-gray-300"
              }`}
              role="tab"
              aria-selected={activeTab === "products"}
              aria-controls="products-panel"
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab("categories")}
              className={`px-4 py-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A5D23] ${
                activeTab === "categories"
                  ? "bg-[#4A5D23] text-white"
                  : "bg-gray-200 text-[#4A5D23] hover:bg-gray-300"
              }`}
              role="tab"
              aria-selected={activeTab === "categories"}
              aria-controls="categories-panel"
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A5D23] ${
                activeTab === "orders"
                  ? "bg-[#4A5D23] text-white"
                  : "bg-gray-200 text-[#4A5D23] hover:bg-gray-300"
              }`}
              role="tab"
              aria-selected={activeTab === "orders"}
              aria-controls="orders-panel"
            >
              Orders
            </button>
          </div>
        </div>

        <div className="sm:block">
          <div
            id="products-panel"
            role="tabpanel"
            className={`${
              activeTab === "products" ? "block" : "hidden sm:block"
            }`}
          >
            <ProductForm
              editingProduct={editingProduct}
              newProduct={newProduct}
              categories={categories}
              subcategories={subcategories}
              handleProductInputChange={handleProductInputChange}
              handleRemoveImage={handleRemoveImage}
              handleProductSubmit={handleProductSubmit}
              setEditingProduct={setEditingProduct}
              loading={loading}
            />
            <ProductList
              products={products}
              getCategoryDetails={getCategoryDetails}
              handleProductEdit={handleProductEdit}
              handleProductDelete={handleProductDelete}
              formatDate={formatDate}
            />
          </div>

          <div
            id="categories-panel"
            role="tabpanel"
            className={`${
              activeTab === "categories" ? "block" : "hidden sm:block"
            }`}
          >
            <CategoryForm
              editingCategory={editingCategory}
              newCategory={newCategory}
              categories={categories}
              handleCategoryInputChange={handleCategoryInputChange}
              handleCategorySubmit={handleCategorySubmit}
              setEditingCategory={setEditingCategory}
              setNewCategory={setNewCategory}
            />
            <CategoryList
              categories={categories}
              subcategories={subcategories}
              handleCategoryEdit={handleCategoryEdit}
              handleCategoryDelete={handleCategoryDelete}
            />
          </div>

          <div
            id="orders-panel"
            role="tabpanel"
            className={`${
              activeTab === "orders" ? "block" : "hidden sm:block"
            }`}
          >
            <OrderList
              orders={orders}
              getPaymentType={getPaymentType}
              formatDate={formatDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
