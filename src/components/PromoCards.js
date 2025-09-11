import { Link } from 'react-router-dom';

const PromoCards = () => (
  <section className="py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          data-aos="fade-up"
        >
          <img
            src="/assets/img/iphone-17-promo.jpg"
            alt="iPhone 17"
            className="w-full h-56 sm:h-64 object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="p-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">iPhone 17 & 17 Air</h3>
            <p className="text-gray-600 text-base mb-4">
              Ultra-thin design with A19 chip and 48MP Fusion camera.
            </p>
            <Link
              to="/category"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-medium text-base hover:bg-blue-700 transition-colors duration-200"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div
          className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <img
            src="/assets/img/macbook-air-m4-promo.jpg"
            alt="MacBook Air M4"
            className="w-full h-56 sm:h-64 object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="p-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">MacBook Air M4</h3>
            <p className="text-gray-600 text-base mb-4">
              Stunning Retina display with M4 chip for unmatched performance.
            </p>
            <Link
              to="/category"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-medium text-base hover:bg-blue-700 transition-colors duration-200"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div
          className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <img
            src="/assets/img/airpods-pro-3-promo.jpg"
            alt="AirPods Pro 3"
            className="w-full h-56 sm:h-64 object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="p-6">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">AirPods Pro 3</h3>
            <p className="text-gray-600 text-base mb-4">
              World’s best in-ear Active Noise Cancellation.
            </p>
            <Link
              to="/category"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-medium text-base hover:bg-blue-700 transition-colors duration-200"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default PromoCards;