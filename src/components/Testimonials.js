import React, { useState, useEffect } from "react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Ama Kwarteng",
      quote:
        "The lashes from S-TONE are stunning! So easy to apply, and the free shipping to Ghana with brow mapping tools was a bonus!",
      role: "Verified Buyer",
      rating: 5,
    },
    {
      id: 2,
      name: "Nana Yaa",
      quote:
        "I love the vibrant nail polishes and press-ons. Fast delivery to Ghana and amazing quality. Highly recommend!",
      role: "Verified Buyer",
      rating: 4,
    },
    {
      id: 3,
      name: "Efua Mensah",
      quote:
        "The semi-permanent makeup transformed my brows! Free shipping on my order over $100 made it even better.",
      role: "Verified Buyer",
      rating: 5,
    },
    {
      id: 4,
      name: "Akosua Boateng",
      quote:
        "S-TONE’s products are top-notch, and the customer service is fantastic. The brow mapping tools were a game-changer!",
      role: "Verified Buyer",
      rating: 5,
    },
    {
      id: 5,
      name: "Adwoa Sarpong",
      quote:
        "Great variety of cosmetics and super easy checkout. My order arrived quickly with free shipping to Ghana!",
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
        className={index < rating ? "text-[#4A5D23]" : "text-gray-300"}
      >
        ★
      </span>
    ));
  };

  return (
    <section className="py-10 px-5 bg-whitesmoke text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-[#4A5D23] mb-8">
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
                  <h3 className="text-lg font-semibold text-[#4A5D23] mb-1">
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
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#4A5D23] text-whitesmoke p-2 rounded-full hover:bg-[#3A4A1C]"
        >
          &lt;
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#4A5D23] text-whitesmoke p-2 rounded-full hover:bg-[#3A4A1C]"
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
                index === currentIndex ? "bg-[#4A5D23]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
