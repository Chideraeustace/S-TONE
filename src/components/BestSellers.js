import { Link } from 'react-router-dom';

const BestSellers = () => (
  <section className="py-12 bg-gray-50">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-8" data-aos="fade-up">
        Best Sellers
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="product-card bg-white rounded-lg shadow overflow-hidden" data-aos="fade-up">
          <img
            src="/assets/img/iphone-17-pro.jpg"
            alt="iPhone 17 Pro"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h5 className="font-bold">iPhone 17 Pro</h5>
            <p className="text-gray-600">$999.00</p>
            <Link to="/product-details" className="text-blue-600 hover:underline">
              View Details
            </Link>
          </div>
        </div>
        <div
          className="product-card bg-white rounded-lg shadow overflow-hidden"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <img
            src="/assets/img/macbook-pro-m4.jpg"
            alt="MacBook Pro M4"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h5 className="font-bold">MacBook Pro M4</h5>
            <p className="text-gray-600">$1599.00</p>
            <Link to="/product-details" className="text-blue-600 hover:underline">
              View Details
            </Link>
          </div>
        </div>
        <div
          className="product-card bg-white rounded-lg shadow overflow-hidden"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <img
            src="/assets/img/iphone-16e.jpg"
            alt="iPhone 16e"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h5 className="font-bold">iPhone 16e</h5>
            <p className="text-gray-600">$599.00</p>
            <Link to="/product-details" className="text-blue-600 hover:underline">
              View Details
            </Link>
          </div>
        </div>
        <div
          className="product-card bg-white rounded-lg shadow overflow-hidden"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <img
            src="/assets/img/airpods-pro-3.jpg"
            alt="AirPods Pro 3"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h5 className="font-bold">AirPods Pro 3</h5>
            <p className="text-gray-600">$249.00</p>
            <Link to="/product-details" className="text-blue-600 hover:underline">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default BestSellers;