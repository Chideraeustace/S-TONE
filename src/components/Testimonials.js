import React, { useState, useEffect } from "react";

const Testimonials = () => {
  // Static data for 10 customer reviews with star ratings (can be replaced with API data)
  const testimonials = [
    {
      id: 1,
      name: "Emily Carter",
      quote:
        "Absolutely love the quality of the products! Fast shipping and great customer service.",
      role: "Verified Buyer",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Lee",
      quote:
        "Best online shopping experience. The deals are unbeatable, and everything arrived on time.",
      role: "Verified Buyer",
      rating: 4,
    },
    {
      id: 3,
      name: "Sophia Nguyen",
      quote:
        "High-quality items at affordable prices. Will definitely shop here again!",
      role: "Verified Buyer",
      rating: 5,
    },
    {
      id: 4,
      name: "James Patel",
      quote:
        "The website is user-friendly, and the product descriptions are accurate. Highly recommend.",
      role: "Verified Buyer",
      rating: 4,
    },
    {
      id: 5,
      name: "Olivia Ramirez",
      quote:
        "Excellent variety of products. Customer support was quick to resolve my query.",
      role: "Verified Buyer",
      rating: 5,
    },
    {
      id: 6,
      name: "Daniel Kim",
      quote:
        "Super fast delivery and well-packaged items. Five stars all the way!",
      role: "Verified Buyer",
      rating: 5,
    },
    {
      id: 7,
      name: "Isabella Rossi",
      quote:
        "Found exactly what I was looking for. The return process was hassle-free.",
      role: "Verified Buyer",
      rating: 4,
    },
    {
      id: 8,
      name: "Ethan Wong",
      quote:
        "Great discounts and reliable service. My go-to e-commerce site now.",
      role: "Verified Buyer",
      rating: 5,
    },
    {
      id: 9,
      name: "Ava Thompson",
      quote:
        "Products exceeded my expectations. Easy navigation and secure checkout.",
      role: "Verified Buyer",
      rating: 5,
    },
    {
      id: 10,
      name: "Noah Garcia",
      quote:
        "Fantastic selection and competitive prices. Highly satisfied with my purchase.",
      role: "Verified Buyer",
      rating: 4,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Autoplay functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Render star icons based on rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={index < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    ));
  };

  return (
    <section className="py-10 px-5 bg-gray-100 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
        Customer Reviews
      </h2>
      <div className="relative max-w-4xl mx-auto">
        {/* Slider Content */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="min-w-full">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex justify-center mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="italic text-gray-600 mb-4 text-base">
                    "{testimonial.quote}"
                  </p>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
        >
          &lt;
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
        >
          &gt;
        </button>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-4 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-gray-800" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
