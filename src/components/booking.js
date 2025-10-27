import React from "react";
import { Link } from "react-router-dom";
import bookingImage from "../assets/bookingimage.webp"; // Replace with your image path
import { FaInstagram, FaFacebook, FaTiktok } from "react-icons/fa"; // Install react-icons: npm install react-icons

const Booking = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-whitesmoke to-gray-100 text-[#4A5D23]">
      {/* Full-Width Image Section */}
      <div className="w-full">
        {/* Image with Text Overlay */}
        <div
          className="relative w-full h-[24rem] sm:h-[32rem] lg:h-[40rem] overflow-hidden"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          <img
            src={bookingImage}
            alt="Book a Free Session"
            className="w-full h-full object-cover transform transition duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-[#4A5D23]/60 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            {/* Mobile: Short Title, Desktop: Full Banner Text */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white text-center font-serif lg:hidden">
              Discover Your Glam Journey with S-TONE
            </h2>
            <div className="hidden lg:flex flex-col items-center text-center max-w-2xl">
              <p className="text-xl lg:text-3xl font-black text-white font-serif mb-4">
                Book a Free 30-minute Call
              </p>
              <p className="text-base lg:text-xl font-semibold text-white mb-6">
                Schedule a FREE SESSION with one of our trainers to explore our
                training kits and how they can help you get started.
              </p>
              <Link
                to="/schedule" // Replace with your scheduling route
                className="inline-block bg-[#4A5D23] text-white px-6 py-3 rounded-lg font-semibold text-base lg:text-lg hover:bg-[#3A4A1C] transition-all duration-300 transform hover:scale-105"
              >
                Schedule Now
              </Link>
            </div>
          </div>
        </div>

        {/* Banner (Mobile/Small Screens Only) */}
        <div
          className="lg:hidden bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center max-w-4xl mx-auto mt-8"
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-duration="600"
        >
          <p className="text-lg sm:text-xl font-semibold text-[#4A5D23] mb-4 font-serif">
            Book a Free 30-minute Call
          </p>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            Schedule a FREE SESSION with one of our trainers to explore our
            training kits and how they can help you get started.
          </p>
          <Link
            to="/schedule" // Replace with your scheduling route
            className="inline-block bg-[#4A5D23] text-white px-6 py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#3A4A1C] transition-all duration-300 transform hover:scale-105"
          >
            Schedule Now
          </Link>
        </div>
      </div>

      {/* Social Media Handles */}
      <div
        className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex justify-center space-x-6 mt-8"
        data-aos="fade-up"
        data-aos-delay="400"
        data-aos-duration="600"
      >
        <a
          href="https://instagram.com/s-tone-beauty" // Replace with your Instagram URL
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4A5D23] hover:text-[#3A4A1C] transition-colors duration-300"
          aria-label="Follow S-TONE on Instagram"
        >
          <FaInstagram className="w-8 h-8 sm:w-10 sm:h-10" />
        </a>
        <a
          href="https://facebook.com/s-tone-beauty" // Replace with your Facebook URL
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4A5D23] hover:text-[#3A4A1C] transition-colors duration-300"
          aria-label="Follow S-TONE on Facebook"
        >
          <FaFacebook className="w-8 h-8 sm:w-10 sm:h-10" />
        </a>
        <a
          href="https://tiktok.com/@s-tone-beauty" // Replace with your TikTok URL
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4A5D23] hover:text-[#3A4A1C] transition-colors duration-300"
          aria-label="Follow S-TONE on TikTok"
        >
          <FaTiktok className="w-8 h-8 sm:w-10 sm:h-10" />
        </a>
      </div>
    </section>
  );
};

export default Booking;
