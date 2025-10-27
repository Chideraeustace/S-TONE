import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Firebase";

// Define the expected structure of the fetched product
const initialProductState = {
  title: "Lash Care Kit",
  price: 0,
  imageUrl: "https://via.placeholder.com/600x400?text=S-TONE+Product",
};

const Kit = () => {
  const [product, setProduct] = useState(initialProductState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLLECTION_NAME = "s-tone-products";
  const DOCUMENT_ID = "PpXhnCes1sVz7Rzfmguj";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          const fetchedProduct = {
            id: docSnap.id,
            title: data.title || "Lash Care Kit",
            price: data.price || 0,
            imageUrl:
              data.images && data.images.length > 0 && data.images[0].url
                ? data.images[0].url
                : initialProductState.imageUrl,
          };

          setProduct(fetchedProduct);
        } else {
          setError(`Error: Product ID "${DOCUMENT_ID}" not found.`);
          setProduct({
            ...initialProductState,
            title: "Kit Not Found",
          });
        }
      } catch (err) {
        console.error("Firestore Fetch Error:", err);
        setError("Network/Database Error. Check connection and Firebase logs.");
        setProduct({
          ...initialProductState,
          title: "Error Loading Data",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [DOCUMENT_ID]);

  // --- RENDERING LOGIC ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50">
        <p className="text-xl text-[#4A5D23]">Loading Kit Details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-red-50 shadow-md rounded-xl my-10 border border-red-300 text-center">
        <h2 className="text-2xl font-bold text-red-700 mb-2">
          Failed to Load Product
        </h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="my-12">
      {/* Image Container with Zoom Effect */}
      <div className="relative overflow-hidden rounded-lg shadow-xl">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-[24rem] lg:h-[40rem] object-cover transform transition duration-300 hover:scale-110"
        />
        {/* Add to Cart Button */}
        <button
          onClick={() => alert(`Adding ${product.title} to cart!`)}
          className="absolute bottom-4 right-4 bg-[#4A5D23] text-white text-2xl font-bold w-12 h-12 flex items-center justify-center rounded-full shadow-lg hover:bg-[#3A4A1C] transition duration-300"
          aria-label={`Add ${product.title} to cart`}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Kit;
