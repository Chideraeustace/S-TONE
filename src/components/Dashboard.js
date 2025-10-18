import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage, auth } from "../Firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
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
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Product state structure
  const [newProduct, setNewProduct] = useState({
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
  });

  const [editingProduct, setEditingProduct] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    isSubcategory: false,
    parentCategoryId: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("products");

  const setProductState = editingProduct ? setEditingProduct : setNewProduct;
  const currentProduct = editingProduct || newProduct;

  // Check admin status by email
  useEffect(() => {
    console.log(
      "[DEBUG] Dashboard: Checking auth.currentUser:",
      auth.currentUser
    );
    const checkAdminStatus = async () => {
      if (!auth.currentUser) {
        console.log(
          "[DEBUG] Dashboard: No authenticated user, redirecting to /login"
        );
        setError("Please log in to access the dashboard.");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        const userEmail = auth.currentUser.email;
        console.log("[DEBUG] Dashboard: Checking admin email:", userEmail);

        // Check Firestore s-tone-admins collection
        const adminDoc = await getDoc(doc(db, "s-tone-admin", userEmail));
        if (adminDoc.exists()) {
          console.log("[DEBUG] Dashboard: User is admin (Firestore check)");
          setIsAdmin(true);
        } else {
          console.log("[DEBUG] Dashboard: User is not admin, redirecting to /");
          setError("Access denied: Admin privileges required.");
          setLoading(false);
          navigate("/");
          return;
        }

        // Option: Hardcoded admin emails (uncomment to use instead)
        /*
        const adminEmails = ["admin1@example.com", "admin2@example.com"];
        if (adminEmails.includes(userEmail)) {
          console.log("[DEBUG] Dashboard: User is admin (hardcoded check)");
          setIsAdmin(true);
        } else {
          console.log("[DEBUG] Dashboard: User is not admin, redirecting to /");
          setError("Access denied: Admin privileges required.");
          setLoading(false);
          navigate("/");
          return;
        }
        */
      } catch (err) {
        console.error("[DEBUG] Dashboard: Error checking admin status:", err);
        setError("Failed to verify admin status. Please try again.");
        setLoading(false);
        navigate("/");
      }
    };
    checkAdminStatus();
  }, [navigate]);

  // Cleanup temporary URLs
  useEffect(() => {
    return () => {
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
  }, [newProduct.images, editingProduct?.images]);

  // Fetch data (products, categories, orders)
  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      try {
        console.log("[DEBUG] Dashboard: Fetching data");
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
        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          images: doc.data().images || [],
        }));
        setProducts(productList);

        const orderSnapshot = await getDocs(collection(db, "s-tone-orders"));
        const orderList = orderSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderList);

        console.log("[DEBUG] Dashboard: Data fetched successfully", {
          categories: categoryList.length,
          products: productList.length,
          orders: orderList.length,
        });
        setLoading(false);
      } catch (err) {
        console.error("[DEBUG] Dashboard: Error fetching data:", err);
        setError("Failed to fetch data: " + err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  // Handle product input change
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    const files = e.target.files;

    if (name === "imageFiles" && Array.isArray(value)) {
      setProductState((prev) => ({
        ...prev,
        images: [...prev.images, ...value],
      }));
      return;
    }

    if (name === "imageFile" && files) {
      return; // Deprecated, kept for compatibility
    }

    let formattedValue = value;
    if (name === "price" || name === "quantity") {
      formattedValue = value === "" ? "" : parseFloat(value) >= 0 ? value : "";
    }

    if (name === "categoryId") {
      setProductState((prev) => ({
        ...prev,
        [name]: formattedValue,
        subcategoryId: "",
      }));
      return;
    }

    setProductState((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  // Handle remove image
  const handleRemoveImage = (indexToRemove) => {
    setProductState((prev) => {
      const imageToRemove = prev.images[indexToRemove];
      if (imageToRemove?.preview) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      const updatedImages = prev.images.filter(
        (_, index) => index !== indexToRemove
      );
      return {
        ...prev,
        images: updatedImages,
      };
    });
  };

  // Handle product submit
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const product = editingProduct || newProduct;
    const isEditing = !!editingProduct;

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
        thickness: product.thickness || null,
        length: product.length || null,
        size: product.size || null,
        style: product.style || null,
        images: [],
        createdAt: new Date(),
      };

      const uploadPromises = product.images.map(async (imageObject) => {
        if (imageObject.file) {
          const file = imageObject.file;
          const fileExtension = file.name.split(".").pop();
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
            path: storageRef.fullPath,
          };
        }
        return {
          url: imageObject.url,
          path: imageObject.path,
        };
      });

      const newImageUrls = (await Promise.all(uploadPromises)).filter(
        (img) => img.url
      );
      productData.images = newImageUrls;

      if (isEditing) {
        const oldImages =
          products.find((p) => p.id === product.id)?.images || [];
        const currentUrls = newImageUrls.map((img) => img.url);
        const imagesToDelete = oldImages.filter(
          (oldImg) => !currentUrls.includes(oldImg.url) && oldImg.path
        );

        await Promise.all(
          imagesToDelete.map(async (img) => {
            try {
              const imageRef = ref(storage, img.path);
              await deleteObject(imageRef);
            } catch (err) {
              console.warn("Failed to delete old image:", err);
            }
          })
        );

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

      product.images.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });

      setNewProduct({
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
      });
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

  // Handle product delete
  const handleProductDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const product = products.find((p) => p.id === id);
        if (product.images && product.images.length > 0) {
          await Promise.all(
            product.images.map(async (image) => {
              if (image.path) {
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

  // Handle product edit
  const handleProductEdit = (product) => {
    const imagesForForm = (product.images || []).map((img) => ({
      url: img.url,
      path: img.path,
      preview: img.url,
      file: null,
    }));

    setEditingProduct({
      ...product,
      price: product.price || "",
      quantity: product.quantity || "",
      colors: product.colors ? product.colors.join(", ") : "",
      thickness: product.thickness || "",
      length: product.length || "",
      size: product.size || "",
      style: product.style || "",
      images: imagesForForm,
    });
  };

  // Handle category input change
  const handleCategoryInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("[DEBUG] Dashboard: Category input change", {
      name,
      value,
      type,
      checked,
    });

    const formattedValue = type === "checkbox" ? checked : value;

    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        [name]: formattedValue,
        url:
          name === "name"
            ? `/${value.toLowerCase().replace(/\s+/g, "-")}`
            : editingCategory.url,
        ...(name === "isSubcategory" && !checked
          ? { parentCategoryId: "" }
          : {}),
      });
    } else {
      setNewCategory({
        ...newCategory,
        [name]: formattedValue,
        url:
          name === "name"
            ? `/${value.toLowerCase().replace(/\s+/g, "-")}`
            : newCategory.url,
        ...(name === "isSubcategory" && !checked
          ? { parentCategoryId: "" }
          : {}),
      });
    }
  };

  // Handle category submit
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const categoryUrl = `/${newCategory.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`;
      console.log("[DEBUG] Dashboard: Submitting category", {
        name: newCategory.name,
        url: categoryUrl,
      });

      const existingCategory = categories
        .concat(subcategories)
        .find(
          (c) =>
            c.url === (editingCategory ? editingCategory.url : categoryUrl) &&
            c.id !== (editingCategory ? editingCategory.id : null)
        );
      if (existingCategory) {
        setError("Category URL must be unique.");
        console.log("[DEBUG] Dashboard: Category URL conflict", {
          url: categoryUrl,
        });
        setTimeout(() => setError(null), 3000);
        return;
      }

      if (editingCategory) {
        const categoryRef = doc(db, "s-tone-categories", editingCategory.id);
        await updateDoc(categoryRef, {
          name: editingCategory.name,
          url: editingCategory.url,
          isSubcategory: editingCategory.isSubcategory,
          parentCategoryId: editingCategory.isSubcategory
            ? editingCategory.parentCategoryId
            : "",
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
        console.log("[DEBUG] Dashboard: Category updated", {
          id: editingCategory.id,
        });
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
        console.log("[DEBUG] Dashboard: Category added", { id: docRef.id });
      }
      setNewCategory({ name: "", isSubcategory: false, parentCategoryId: "" });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to save category: " + err.message);
      console.error("[DEBUG] Dashboard: Error saving category:", err);
      setTimeout(() => setError(null), 3000);
    }
  };

  // Handle category delete
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
          console.log(
            "[DEBUG] Dashboard: Cannot delete category, used by products",
            { id }
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
            console.log(
              "[DEBUG] Dashboard: Cannot delete category, has subcategories",
              { id }
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
        console.log("[DEBUG] Dashboard: Category deleted", { id });
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError("Failed to delete category: " + err.message);
        console.error("[DEBUG] Dashboard: Error deleting category:", err);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  // Handle category edit
  const handleCategoryEdit = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      isSubcategory: category.isSubcategory,
      parentCategoryId: category.parentCategoryId || "",
    });
    console.log("[DEBUG] Dashboard: Editing category", { id: category.id });
  };

  // Utility functions
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-cream-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#4A5D23]"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-cream-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-sm font-sans mb-4">
            {error || "Access denied: Admin privileges required."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-[#4A5D23] text-white rounded-lg hover:bg-[#3A4A1C] transition-colors font-sans text-sm"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] to-cream-100 p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        <h1
          className="text-3xl sm:text-4xl font-serif font-bold text-gray-800 mb-8 text-center"
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
              className={`px-4 py-2 font-sans text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A5D23] ${
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
              className={`px-4 py-2 font-sans text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A5D23] ${
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
              className={`px-4 py-2 font-sans text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A5D23] ${
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
            <OrderList orders={orders} formatDate={formatDate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
