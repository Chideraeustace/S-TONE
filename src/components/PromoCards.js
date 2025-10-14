import { Link } from "react-router-dom";
import { FaTag } from "react-icons/fa";
import product1Image from "../assets/p1.webp";
import product2Image from "../assets/p2.webp";
import product3Image from "../assets/p3.webp";
import product4Image from "../assets/p4.webp";
import product5Image from "../assets/p1.webp";
import product6Image from "../assets/p2.webp";
import product7Image from "../assets/p3.webp";
import product8Image from "../assets/p4.webp";
import product9Image from "../assets/p1.webp";
import product10Image from "../assets/p2.webp";

const PromoCards = () => {
  const products = [
    {
      id: "lash-adhesive",
      title: "Lash Adhesive",
      category: "Lashes",
      imageUrl: product1Image,
      price: 12.99,
      description:
        "Long-lasting adhesive for secure lash application. Free shipping to Ghana on orders over $100!",
      link: "/product-details/lash-adhesive",
    },
    {
      id: "nail-polish-set",
      title: "Nail Polish Set",
      category: "Nails",
      imageUrl: product2Image,
      price: 19.99,
      description:
        "Vibrant colors for stunning nails. Free shipping to Ghana on orders over $100!",
      link: "/product-details/nail-polish-set",
    },
    {
      id: "brow-pencil",
      title: "Brow Pencil",
      category: "Makeup",
      imageUrl: product3Image,
      price: 15.99,
      description:
        "Define your brows with precision. Free shipping to Ghana on orders over $100 plus free brow mapping tools!",
      link: "/product-details/brow-pencil",
    },
    {
      id: "lash-curler",
      title: "Lash Curler",
      category: "Tools",
      imageUrl: product4Image,
      price: 9.99,
      description:
        "Enhance your lashes with ease. Free shipping to Ghana on orders over $100!",
      link: "/product-details/lash-curler",
    },
    {
      id: "gel-nail-kit",
      title: "Gel Nail Kit",
      category: "Nails",
      imageUrl: product5Image,
      price: 34.99,
      description:
        "Complete kit for professional nails at home. Free shipping to Ghana on orders over $100!",
      link: "/product-details/gel-nail-kit",
    },
    {
      id: "lip-gloss",
      title: "Hydrating Lip Gloss",
      category: "Makeup",
      imageUrl: product6Image,
      price: 14.99,
      description:
        "Glossy, moisturizing shine for your lips. Free shipping to Ghana on orders over $100!",
      link: "/product-details/lip-gloss",
    },
    {
      id: "mink-lashes",
      title: "Mink Lashes",
      category: "Lashes",
      imageUrl: product7Image,
      price: 29.99,
      description:
        "Luxurious lashes for a glamorous look. Free shipping to Ghana on orders over $100!",
      link: "/product-details/mink-lashes",
    },
    {
      id: "nail-art-brushes",
      title: "Nail Art Brushes",
      category: "Tools",
      imageUrl: product8Image,
      price: 17.99,
      description:
        "Create intricate nail designs. Free shipping to Ghana on orders over $100!",
      link: "/product-details/nail-art-brushes",
    },
    {
      id: "eyeliner-pen",
      title: "Precision Eyeliner Pen",
      category: "Makeup",
      imageUrl: product9Image,
      price: 16.99,
      description:
        "Bold, sharp lines for stunning eyes. Free shipping to Ghana on orders over $100!",
      link: "/product-details/eyeliner-pen",
    },
    {
      id: "lash-serum",
      title: "Lash Growth Serum",
      category: "Lashes",
      imageUrl: product10Image,
      price: 24.99,
      description:
        "Promote longer, fuller lashes. Free shipping to Ghana on orders over $100!",
      link: "/product-details/lash-serum",
    },
  ];

  return (
    <section className="py-12 lg:py-16 bg-whitesmoke">
      <div className="container mx-auto px-4 sm:px-6">
        <h2
          className="text-3xl sm:text-4xl font-bold text-[#4A5D23] mb-8 text-center"
          data-aos="fade-up"
        >
          Our Products
        </h2>
        {/* Changed to grid-cols-2 to show two columns on mobile and small screens */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {products.map((product, index) => (
            <Link
              key={product.id}
              to={product.link}
              // Card size adjusted for better responsiveness: w-full makes it fill the grid cell, and max-w-none is used to ensure the grid can size it freely, overriding any default fixed max-width.
              className="bg-white rounded-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg w-full max-w-none mx-auto"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="w-full h-32 sm:h-40 flex items-center justify-center bg-whitesmoke">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-bold text-[#4A5D23] mb-1 flex items-center">
                  <FaTag className="text-[#4A5D23] mr-1.5 w-4 h-4" />
                  <span>{product.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-2 font-medium tracking-wide">
                  {product.category}
                </p>
                <p className="text-[#4A5D23] text-xs sm:text-sm font-semibold mb-2">
                  Price: <span>${product.price.toFixed(2)}</span>
                </p>
                <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoCards;
