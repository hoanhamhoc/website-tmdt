import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/product-card";

const FeaturedProducts = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products?featured=true"],
  });

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-heading font-bold">Sản phẩm nổi bật</h2>
          <div className="hidden md:flex items-center space-x-2">
            <button
              className="bg-white hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              onClick={scrollLeft}
              aria-label="Previous products"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              className="bg-white hover:bg-primary hover:text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              onClick={scrollRight}
              aria-label="Next products"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative">
          {isLoading ? (
            <div className="flex space-x-4 md:space-x-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="w-64 md:w-72 flex-shrink-0">
                  <div className="bg-white rounded-lg overflow-hidden shadow-md">
                    <div className="h-64 bg-neutral-200 animate-pulse" />
                    <div className="p-4">
                      <div className="h-4 bg-neutral-200 animate-pulse mb-2" />
                      <div className="h-4 w-2/3 bg-neutral-200 animate-pulse mb-2" />
                      <div className="h-6 w-1/3 bg-neutral-200 animate-pulse mt-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              ref={sliderRef}
              className="overflow-x-auto pb-4 hide-scrollbar slider-container"
            >
              <div className="flex space-x-4 md:space-x-6">
                {products.map((product) => (
                  <div key={product.id} className="w-64 md:w-72 flex-shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/products">
            <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-heading font-semibold px-6 py-6">
              Xem tất cả sản phẩm
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
