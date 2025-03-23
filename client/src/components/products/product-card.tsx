import { useState } from "react";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Star, ShoppingCart, Heart, Search, StarHalf } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  showAddToCartButton?: boolean;
  className?: string;
}

const ProductCard = ({ product, showAddToCartButton = false, className = "" }: ProductCardProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.discountPrice ? Number(product.discountPrice) : Number(product.price),
      imageUrl: product.imageUrl,
      quantity: 1
    });

    toast({
      title: "Thêm vào giỏ hàng thành công",
      description: `Đã thêm ${product.name} vào giỏ hàng`,
    });
  };

  // Calculate discount percentage
  const discountPercentage = product.discountPrice 
    ? Math.round(100 - (Number(product.discountPrice) * 100 / Number(product.price)))
    : 0;

  // Format price to VND
  const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price));
  };

  // Render rating stars
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-current text-warning" />);
    }

    // Half star
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-current text-warning" />);
    }

    // Empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-warning" />);
    }

    return (
      <div className="flex text-yellow-400">
        {stars}
      </div>
    );
  };

  return (
    <div 
      className={`product-card ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full">
        <Link href={`/products/${product.slug}`}>
          <a className="block">
            <div className="relative h-64 overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}
              />

              {/* Labels (discount or new) */}
              {product.discountPrice && (
                <div className="absolute top-0 left-0 m-2">
                  <span className="bg-accent text-white text-sm font-semibold px-2 py-1 rounded">
                    -{discountPercentage}%
                  </span>
                </div>
              )}
              {product.isNew && !product.discountPrice && (
                <div className="absolute top-0 left-0 m-2">
                  <span className="bg-success text-white text-sm font-semibold px-2 py-1 rounded">
                    Mới
                  </span>
                </div>
              )}

              {/* Quick Actions */}
              <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <button
                  className="bg-white text-primary w-10 h-10 rounded-full flex items-center justify-center mx-1 hover:bg-primary hover:text-white transition-colors"
                  onClick={handleAddToCart}
                  aria-label="Thêm vào giỏ hàng"
                >
                  <ShoppingCart className="h-5 w-5" />
                </button>
                <button
                  className="bg-white text-primary w-10 h-10 rounded-full flex items-center justify-center mx-1 hover:bg-primary hover:text-white transition-colors"
                  aria-label="Thêm vào yêu thích"
                >
                  <Heart className="h-5 w-5" />
                </button>
                <Link href={`/products/${product.slug}`}>
                  <a className="bg-white text-primary w-10 h-10 rounded-full flex items-center justify-center mx-1 hover:bg-primary hover:text-white transition-colors">
                    <Search className="h-5 w-5" />
                  </a>
                </Link>
              </div>
            </div>
            <div className="p-4">
              {/* Rating */}
              <div className="flex items-center mb-1">
                <div className="flex">
                  {renderRatingStars(Number(product.averageRating))}
                </div>
                <span className="text-sm ml-1">({product.reviewCount})</span>
              </div>
              
              {/* Product details */}
              <h3 className="font-heading font-semibold mb-1">{product.name}</h3>
              <p className="text-sm text-neutral-800 mb-2">
                {product.description?.substring(0, 50)}
                {product.description && product.description.length > 50 ? '...' : ''}
              </p>
              
              {/* Pricing */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-accent font-semibold text-primary text-lg">
                    {formatPrice(product.discountPrice || product.price)}
                  </span>
                  {product.discountPrice && (
                    <span className="text-sm text-neutral-800 line-through ml-2">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                
                {/* Add to cart button (optional) */}
                {showAddToCartButton && (
                  <button
                    className="bg-primary hover:bg-primary/90 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    onClick={handleAddToCart}
                    aria-label="Thêm vào giỏ hàng"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
