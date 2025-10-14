import { Link } from "react-router-dom";
import classicLashesImage from "../assets/classic.webp";
import hybridLashesImage from "../assets/hybrid.webp";
import volumeLashesImage from "../assets/volume.webp";
import megaVolumeLashesImage from "../assets/megavolume.webp";
import softGelImage from "../assets/softgel.webp";
import acrylicPowderImage from "../assets/acrylic.webp";
import builderJarImage from "../assets/builder.webp";
import lipBlushImage from "../assets/lipblush.webp";
import microbladingImage from "../assets/microblading.webp";
import powderBrowsImage from "../assets/powderbrows.webp";

const Categories = () => {
  const categoryGroups = [
    {
      title: "Lash Styling System",
      subcategories: [
        {
          id: "classic-lashes",
          title: "Classic Lashes",
          image: classicLashesImage,
          link: "/category/lashes/classic",
        },
        {
          id: "hybrid-lashes",
          title: "Hybrid Lashes",
          image: hybridLashesImage,
          link: "/category/lashes/hybrid",
        },
        {
          id: "volume-lashes",
          title: "Volume Lashes",
          image: volumeLashesImage,
          link: "/category/lashes/volume",
        },
        {
          id: "mega-volume-lashes",
          title: "Mega Volume Lashes",
          image: megaVolumeLashesImage,
          link: "/category/lashes/mega-volume",
        },
      ],
    },
    {
      title: "Advanced Nail Enhancement",
      subcategories: [
        {
          id: "soft-gel",
          title: "Soft Gel",
          image: softGelImage,
          link: "/category/nails/soft-gel",
        },
        {
          id: "acrylic-powder",
          title: "Acrylic Powder",
          image: acrylicPowderImage,
          link: "/category/nails/acrylic-powder",
        },
        {
          id: "builder-jar",
          title: "Builder in a Jar",
          image: builderJarImage,
          link: "/category/nails/builder-jar",
        },
      ],
    },
    {
      title: "Semi-Permanent Beauty Techniques",
      subcategories: [
        {
          id: "lip-blush",
          title: "Lip Blush",
          image: lipBlushImage,
          link: "/category/semi-permanent/lip-blush",
        },
        {
          id: "microblading",
          title: "Microblading",
          image: microbladingImage,
          link: "/category/semi-permanent/microblading",
        },
        {
          id: "powder-brows",
          title: "Powder Brows",
          image: powderBrowsImage,
          link: "/category/semi-permanent/powder-brows",
        },
      ],
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-whitesmoke">
      <div className="container mx-auto px-4 sm:px-6">
        <h2
          className="text-3xl sm:text-4xl font-bold text-[#4A5D23] mb-4 text-center"
          data-aos="fade-up"
        >
          Explore Our Collections
        </h2>
        <p
          className="text-gray-600 text-base sm:text-lg mb-12 text-center max-w-3xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Discover premium lashes, nails, and semi-permanent makeup. Enjoy free
          shipping to Ghana on orders over $100 plus free brow mapping tools!
        </p>
        {categoryGroups.map((group, groupIndex) => (
          <div key={group.title} className="mb-12">
            <h3
              className="text-2xl sm:text-3xl font-semibold text-[#4A5D23] mb-6 text-center"
              data-aos="fade-up"
              data-aos-delay={groupIndex * 100}
            >
              {group.title}
            </h3>
            <div className="flex flex-row overflow-x-auto gap-6 sm:gap-8 max-w-6xl mx-auto scrollbar-hide">
              {group.subcategories.map((category, index) => (
                <div
                  key={category.id}
                  className="flex flex-col items-center text-center flex-shrink-0"
                  data-aos="fade-up"
                  data-aos-delay={groupIndex * 100 + index * 100}
                >
                  <Link
                    to={category.link}
                    className="group relative w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#4A5D23]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                  <h4 className="text-lg sm:text-xl font-semibold text-[#4A5D23] mt-4 mb-2">
                    {category.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
