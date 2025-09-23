import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { BiSolidTruck, BiAward, BiHeadphone } from "react-icons/bi";
import image1 from "../assets/i7series.jpg";
import image2 from "../assets/24.jpg";
import image3 from "../assets/macbook.jpg";

const Hero = () => {
  const slides = [
    {
      image: image1,
      title: "Discover the iPhone 17 Series",
      description:
        "Experience the power of Apple Intelligence with the thinnest iPhone ever, featuring A19 Pro chip, Ceramic Shield 2, and advanced 48MP cameras.",
      primaryButton: { text: "Shop iPhone 17", link: "/category" },
      secondaryButton: { text: "Explore Models", link: "/category" },
    },
    {
      image: image2,
      title: "Galaxy S24: Unleash Epic Performance",
      description:
        "Capture every moment with AI-powered cameras and enjoy seamless performance with the Snapdragon 8 Gen 3.",
      primaryButton: { text: "Shop Galaxy S24", link: "/category" },
      secondaryButton: { text: "Discover Features", link: "/category" },
    },
    {
      image: image3,
      title: "MacBook Air M4: Powerfully Thin",
      description:
        "Redefine productivity with the M4 chip in the sleekest MacBook Air yet, with up to 18 hours of battery life.",
      primaryButton: { text: "Shop MacBook Air", link: "/category" },
      secondaryButton: { text: "Learn More", link: "/category" },
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white" data-aos="fade-up">
      <div className="container mx-auto px-6">
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div
                  className="lg:w-1/2 mb-8 lg:mb-0"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="mb-6 text-gray-600 text-base sm:text-lg lg:text-xl max-w-xl">
                    {slide.description}
                  </p>
                  <div
                    className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6"
                    data-aos="fade-up"
                    data-aos-delay="200"
                  >
                    <Link
                      to={slide.primaryButton.link}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
                    >
                      {slide.primaryButton.text}
                    </Link>
                    <Link
                      to={slide.secondaryButton.link}
                      className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-50 hover:border-blue-700 transition-colors duration-300"
                    >
                      {slide.secondaryButton.text}
                    </Link>
                  </div>
                  <div
                    className="flex flex-wrap gap-6 text-base sm:text-lg"
                    data-aos="fade-up"
                    data-aos-delay="300"
                  >
                    <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200">
                      <BiSolidTruck className="mr-2 text-xl" />
                      Flat Shipping Rate 
                    </div>
                    <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200">
                      <BiAward className="mr-2 text-xl" />
                      2-Year Warranty
                    </div>
                    <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200">
                      <BiHeadphone className="mr-2 text-xl" />
                      24/7 Support
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full max-h-80 sm:max-h-96 lg:max-h-[600px] object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                    data-aos="fade-up"
                    data-aos-delay="400"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Hero;
