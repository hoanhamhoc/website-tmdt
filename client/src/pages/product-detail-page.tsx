import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Product } from "@shared/schema";
import ProductDetail from "@/components/products/product-detail";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Home, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [location] = useLocation();
  
  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${slug}`],
  });

  const { data: relatedProducts = [] } = useQuery<Product[]>({
    queryKey: [`/api/products/related/${slug}`],
    enabled: !!product,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[500px] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-red-500">Có lỗi xảy ra khi tải thông tin sản phẩm.</p>
        <p className="text-neutral-800">Vui lòng thử lại sau hoặc quay lại trang trước.</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg">Không tìm thấy sản phẩm.</p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 py-8">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 mb-6">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="h-4 w-4 mr-1" />
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">
              Sản phẩm
            </BreadcrumbLink>
          </BreadcrumbItem>
          {product.categoryId && (
            <BreadcrumbItem>
              <BreadcrumbLink href={`/products?category=${product.categoryId}`}>
                Danh mục
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>
              {product.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </div>

      {/* Product Detail */}
      <ProductDetail product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 mt-12">
          <h2 className="text-2xl font-heading font-bold mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <a href={`/products/${relatedProduct.slug}`}>
                  <div className="h-48 overflow-hidden">
                    <img
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-semibold mb-1 truncate">
                      {relatedProduct.name}
                    </h3>
                    <p className="font-accent font-semibold text-primary">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(Number(relatedProduct.discountPrice || relatedProduct.price))}
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
