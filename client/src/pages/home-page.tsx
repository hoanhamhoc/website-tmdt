import HeroSlider from "@/components/home/hero-slider";
import CategoryHighlights from "@/components/home/category-highlights";
import FeaturedProducts from "@/components/home/featured-products";
import PromoBanner from "@/components/home/promo-banner";
import NewArrivals from "@/components/home/new-arrivals";
import PaymentMethods from "@/components/home/payment-methods";
import BlogPreview from "@/components/home/blog-preview";
import Newsletter from "@/components/home/newsletter";

const HomePage = () => {
  return (
    <div>
      <HeroSlider />
      <CategoryHighlights />
      <FeaturedProducts />
      <PromoBanner />
      <NewArrivals />
      <PaymentMethods />
      <BlogPreview />
      <Newsletter />
    </div>
  );
};

export default HomePage;
