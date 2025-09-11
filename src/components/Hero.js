import { Link } from 'react-router-dom';
import { BiSolidTruck, BiAward, BiHeadphone } from 'react-icons/bi';
import image1 from "../assets/iphone17.jpeg"

const Hero = () => (
  <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-gray-100" data-aos="fade-up">
    <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
      <div className="lg:w-1/2 mb-8 lg:mb-0">
        <div className="mb-8" data-aos="fade-up" data-aos-delay="100">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
            Discover the iPhone 17 Series
          </h1>
          <p className="mb-6 text-gray-600 text-base sm:text-lg lg:text-xl max-w-xl">
            Experience the power of Apple Intelligence with the thinnest iPhone ever, featuring A19 Pro chip, Ceramic Shield 2, and advanced 48MP cameras.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6" data-aos="fade-up" data-aos-delay="200">
            <Link
              to="/category"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
            >
              Shop Now
            </Link>
            <Link
              to="/category"
              className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-blue-50 hover:border-blue-700 transition-colors duration-300"
            >
              Explore Models
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 text-base sm:text-lg" data-aos="fade-up" data-aos-delay="300">
            <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200">
              <BiSolidTruck className="mr-2 text-xl" />Free Shipping
            </div>
            <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200">
              <BiAward className="mr-2 text-xl" />2-Year Warranty
            </div>
            <div className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200">
              <BiHeadphone className="mr-2 text-xl" />24/7 Support
            </div>
          </div>
        </div>
      </div>
      <div className="lg:w-1/2">
        <img
          src = {image1}
          alt="iPhone 17 Series"
          className="w-full max-h-80 sm:max-h-96 lg:max-h-[600px] object-contain rounded-lg shadow-xl transition-transform duration-300 hover:scale-105"
          data-aos="fade-up"
          data-aos-delay="400"
        />
      </div>
    </div>
  </section>
);

export default Hero;