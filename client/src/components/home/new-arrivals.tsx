import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/product-card";

const NewArrivals = () => {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products?isNew=true&limit=3"],
  });

  return (
    <section className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-8">Sản phẩm mới về</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-72 bg-neutral-200 animate-pulse" />
                <div className="p-4">
                  <div className="h-4 bg-neutral-200 animate-pulse mb-2" />
                  <div className="h-4 w-2/3 bg-neutral-200 animate-pulse mb-2" />
                  <div className="h-6 w-1/3 bg-neutral-200 animate-pulse mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                showAddToCartButton 
                className="h-full"
              />
            ))}
          </div>
        )}
        
        <div className="text-center mt-8">
          <Link href="/products?isNew=true">
            <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-heading font-semibold px-6 py-6">
              Xem thêm sản phẩm mới
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
