import { Link } from 'react-router-dom';

const Cards = () => (
  <section className="py-12 bg-white">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8" data-aos="fade-up">
        Explore More
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-100 rounded-lg overflow-hidden" data-aos="fade-up">
          <img
            src="/assets/img/magsafe-charger.jpg"
            alt="MagSafe Charger"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">MagSafe Charger</h3>
            <p className="text-gray-600 mb-4">
              Fast wireless charging for your iPhone.
            </p>
            <Link to="/category" className="text-blue-600 hover:underline">
              Shop Now
            </Link>
          </div>
        </div>
        <div
          className="bg-gray-100 rounded-lg overflow-hidden"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <img
            src="/assets/img/apple-watch-ultra-3.jpg"
            alt="Apple Watch Ultra 3"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">Apple Watch Ultra 3</h3>
            <p className="text-gray-600 mb-4">
              Advanced health features with S11 chip.
            </p>
            <Link to="/category" className="text-blue-600 hover:underline">
              Shop Now
            </Link>
          </div>
        </div>
        <div
          className="bg-gray-100 rounded-lg overflow-hidden"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <img
            src="/assets/img/macbook-air-m4.jpg"
            alt="MacBook Air M4"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">MacBook Air M4</h3>
            <p className="text-gray-600 mb-4">
              Lightweight power with up to 18 hours of battery life.
            </p>
            <Link to="/category" className="text-blue-600 hover:underline">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Cards;