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
import { AlertMessages } from "../DashboardComponents/AlertMessage"; // Fixed import path (AlertMessages, not AlertMessage)
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
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    imageFile: null,
    imagePreview: "",
    categoryId: "",
    subcategoryId: "",
    price: "",
    quantity: "",
    colors: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    isSubcategory: false,
    parentCategoryId: "",
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    return () => {
      if (newProduct.imagePreview) {
        URL.revokeObjectURL(newProduct.imagePreview);
      }
      if (editingProduct?.imagePreview) {
        URL.revokeObjectURL(editingProduct.imagePreview);
      }
    };
  }, [newProduct.imagePreview, editingProduct?.imagePreview]);

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
        const productList = productSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
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

  const handleProductInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      const file = files[0];
      if (file) {
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
        if (editingProduct?.imagePreview) {
          URL.revokeObjectURL(editingProduct.imagePreview);
        }
        if (newProduct.imagePreview) {
          URL.revokeObjectURL(newProduct.imagePreview);
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

  const handleRemoveImage = () => {
    if (editingProduct) {
      if (editingProduct.imagePreview) {
        URL.revokeObjectURL(editingProduct.imagePreview);
      }
      setEditingProduct({
        ...editingProduct,
        imageFile: null,
        imagePreview: editingProduct.imageUrl || "",
      });
    } else {
      if (newProduct.imagePreview) {
        URL.revokeObjectURL(newProduct.imagePreview);
      }
      setNewProduct({ ...newProduct, imageFile: null, imagePreview: "" });
    }
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

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const product = editingProduct || newProduct;
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
    if (
      !editingProduct &&
      (!product.imageFile || !(product.imageFile instanceof File))
    ) {
      setError("Please select a valid image file.");
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
        createdAt: new Date(),
      };

      let imageUrl = editingProduct ? editingProduct.imageUrl : "";
      if (product.imageFile) {
        const fileExtension = product.imageFile.name.split(".").pop();
        const fileName = `${
          editingProduct ? editingProduct.id : Date.now()
        }.${fileExtension}`;
        const storageRef = ref(
          storage,
          `products/${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`
        );
        const snapshot = await uploadBytes(storageRef, product.imageFile);
        if (!snapshot) {
          throw new Error("Failed to upload image: Snapshot is undefined.");
        }
        imageUrl = await getDownloadURL(snapshot.ref);
        if (!imageUrl) {
          throw new Error("Failed to retrieve image URL.");
        }

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
      } else if (editingProduct && imageUrl) {
        imageUrl = editingProduct.imageUrl;
      } else {
        setError("Please upload an image.");
        setTimeout(() => setError(null), 3000);
        return;
      }

      productData.imageUrl = imageUrl;

      if (editingProduct) {
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

      if (product.imagePreview) {
        URL.revokeObjectURL(product.imagePreview);
      }
      setNewProduct({
        title: "",
        description: "",
        imageFile: null,
        imagePreview: "",
        categoryId: "",
        subcategoryId: "",
        price: "",
        quantity: "",
        colors: "",
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

  const handleProductEdit = (product) => {
    setEditingProduct({
      ...product,
      price: product.price || "",
      quantity: product.quantity || "",
      colors: product.colors ? product.colors.join(", ") : "",
      imageFile: null,
      imagePreview: product.imageUrl || "",
    });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const categoryUrl = `/${newCategory.name
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
