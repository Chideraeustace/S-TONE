import { Link } from "react-router-dom";
import { BiSolidTruck, BiAward, BiHeadphone } from "react-icons/bi";

const Hero = () => {
  const content = {
    title: "Discover S-TONE Cosmetics",
    description:
      "Transform your beauty routine with our premium lashes, nails, and semi-permanent makeup. Free shipping to Ghana on orders over $100 plus free brow mapping tools!",
    primaryButton: { text: "Shop Now", link: "/category" },
    secondaryButton: { text: "Explore Products", link: "/category" },
  };

  return (
    <section className="bg-whitesmoke" data-aos="fade-up">
      {/* MODIFIED: Increased height classes for all screen sizes */}
      <div className="relative w-full **h-[70vh] sm:h-[90vh] lg:h-[90vh]** overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
        >
          <source
            src="https://cdn.shopify.com/videos/c/o/v/9e729308a02c442d91fd5e61ec1156b0.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="container mx-auto px-6 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div
            className="lg:w-1/2 mb-8 lg:mb-0"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 text-[#4A5D23] leading-tight">
              {content.title}
            </h1>
            <p className="mb-6 text-gray-600 text-base sm:text-lg lg:text-xl max-w-xl">
              {content.description}
            </p>
            <div
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <Link
                to={content.primaryButton.link}
                className="bg-[#4A5D23] text-white px-6 py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#3A4A1C] transition-colors duration-300 shadow-md"
              >
                {content.primaryButton.text}
              </Link>
              <Link
                to={content.secondaryButton.link}
                className="border-2 border-[#4A5D23] text-[#4A5D23] px-6 py-3 rounded-lg font-semibold text-base sm:text-lg hover:bg-[#4A5D23]/10 hover:border-[#3A4A1C] transition-colors duration-300"
              >
                {content.secondaryButton.text}
              </Link>
            </div>
            <div
              className="flex flex-wrap gap-6 text-base sm:text-lg"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="flex items-center text-[#4A5D23] hover:text-[#3A4A1C] transition-colors duration-200">
                <BiSolidTruck className="mr-2 text-xl" />
                Free Shipping to Ghana
              </div>
              <div className="flex items-center text-[#4A5D23] hover:text-[#3A4A1C] transition-colors duration-200">
                <BiAward className="mr-2 text-xl" />
                Quality Guaranteed
              </div>
              <div className="flex items-center text-[#4A5D23] hover:text-[#3A4A1C] transition-colors duration-200">
                <BiHeadphone className="mr-2 text-xl" />
                24/7 Support
              </div>
            </div>
          </div>
          <div className="lg:w-1/2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
