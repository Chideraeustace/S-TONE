import { Link } from "react-router-dom";
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

  return (
    <section className="py-16 lg:py-24 bg-whitesmoke text-[#4A5D23]">
      <div className="container mx-auto px-4 sm:px-6">
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-12 text-center"
          data-aos="fade-up"
        >
          Glam Guide
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={post.id * 100}
            >
              <Link to={post.link}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#4A5D23] mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-base mb-4">
                  {post.description}
                </p>
                <Link
                  to={post.link}
                  className="inline-block bg-[#4A5D23] text-white px-4 py-2 rounded-lg font-semibold text-base hover:bg-[#3A4A1C] transition-colors duration-300"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GlamGuide;
