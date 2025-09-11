import { Link } from 'react-router-dom';

const CallToAction = () => (
  <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
    <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight" data-aos="fade-up">
        Ready to Upgrade?
      </h2>
      <p className="mb-8 text-lg sm:text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
        Pre-order the iPhone 17 or MacBook Air M4 today and get exclusive trade-in offers over GHS 780!
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4" data-aos="zoom-in" data-aos-delay="200">
        <Link
          to="/category"
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          Shop Now
        </Link>
        <Link
          to="/trade-in"
          className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 hover:border-blue-700 transition-colors duration-300"
        >
          Explore Trade-In
        </Link>
      </div>
    </div>
  </section>
);

export default CallToAction;