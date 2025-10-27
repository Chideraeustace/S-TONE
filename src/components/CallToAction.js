import { Link } from "react-router-dom";
import Slider from "react-slick"; // Install: npm install react-slick slick-carousel
import "slick-carousel/slick/slick.css"; // Required CSS
import "slick-carousel/slick/slick-theme.css"; // Required theme CSS
import blogImage1 from "../assets/lashesblog.webp";
import blogImage2 from "../assets/nails2blog.webp";
import blogImage3 from "../assets/makeupblog.webp";
import blogImage4 from "../assets/nailblog.webp";

const GlamGuide = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Mastering Lash Application: Tips for a Flawless Look",
      description:
        "Learn expert techniques for applying strip and individual lashes to elevate your makeup game. Free shipping to Ghana on lash orders over $100 with free brow mapping tools!",
      image: blogImage1,
      link: "/blog/lash-application-tips",
    },
    {
      id: 2,
      title: "Nail Care 101: Keeping Your Press-Ons Perfect",
      description:
        "Discover how to maintain vibrant, long-lasting nails with our care tips for polishes and press-ons. Shop now for free shipping to Ghana on orders over $100!",
      image: blogImage2,
      link: "/blog/nail-care-tips",
    },
    {
      id: 3,
      title: "Semi-Permanent Makeup: Your Guide to Effortless Beauty",
      description:
        "Explore the benefits of semi-permanent makeup for brows, eyeliner, and lips. Get flawless results with S-TONE’s premium products and free brow mapping tools.",
      image: blogImage3,
      link: "/blog/semi-permanent-makeup-guide",
    },
    {
      id: 4,
      title: "Top Makeup Trends for 2025",
      description:
        "Stay ahead with the latest beauty trends, from bold lashes to vibrant nails. Find inspiration and shop S-TONE’s collection for a glamorous look!",
      image: blogImage4,
      link: "/blog/makeup-trends-2025",
    },
  ];

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-whitesmoke to-gray-100 text-[#4A5D23]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-12 text-center tracking-tight"
          data-aos="fade-up"
          data-aos-duration="800"
        >
          Glam Guide
        </h2>
        <Slider {...sliderSettings}>
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="px-2" // Padding for slide spacing
              data-aos="fade-up"
              data-aos-delay={post.id * 100}
              data-aos-duration="600"
            >
              <div className="group bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:shadow-2xl hover:-translate-y-1">
                <Link to={post.link} className="relative block">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 sm:h-56 lg:h-64 object-cover transform transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#4A5D23]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-white text-lg font-semibold text-center px-4">
                      {post.title}
                    </p>
                  </div>
                </Link>
                <div className="p-6 sm:p-5">
                  <h3 className="text-xl lg:text-2xl font-bold text-[#4A5D23] mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm lg:text-base mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <Link
                    to={post.link}
                    className="inline-block bg-[#4A5D23] text-white px-4 py-2 rounded-lg font-semibold text-base hover:bg-[#3A4A1C] transition-all duration-300 transform hover:scale-105"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default GlamGuide;
