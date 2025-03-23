import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Product, Review } from "@shared/schema";
import { 
  Star, 
  StarHalf, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Plus, 
  Minus, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductDetailProps {
  product: Product;
}

const ProductDetail = ({ product }: ProductDetailProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: [`/api/products/${product.id}/reviews`],
  });

  // Initialize selected variants with default values if available
  useEffect(() => {
    if (product.variants) {
      const initialVariants: Record<string, string> = {};
      const variants = product.variants as Record<string, string[]>;
      
      // Select first value for each variant type
      Object.keys(variants).forEach(variantType => {
        if (variants[variantType] && variants[variantType].length > 0) {
          initialVariants[variantType] = variants[variantType][0];
        }
      });
      
      setSelectedVariants(initialVariants);
    }
  }, [product.variants]);

  const handleVariantChange = (type: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discountPrice ? Number(product.discountPrice) : Number(product.price),
      imageUrl: product.imageUrl,
      quantity,
      variant: Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined
    });

    toast({
      title: "Thêm vào giỏ hàng thành công",
      description: `Đã thêm ${quantity} ${product.name} vào giỏ hàng`,
    });
  };

  // Format price to VND
  const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price));
  };

  // Calculate discount percentage
  const discountPercentage = product.discountPrice 
    ? Math.round(100 - (Number(product.discountPrice) * 100 / Number(product.price)))
    : 0;

  // Product images (main image + additional images)
  const productImages = [product.imageUrl, ...(product.imageUrls || [])];

  // Navigate through product images
  const navigateImages = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setActiveImageIndex(prev => (prev === 0 ? productImages.length - 1 : prev - 1));
    } else {
      setActiveImageIndex(prev => (prev === productImages.length - 1 ? 0 : prev + 1));
    }
  };

  // Render rating stars
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="fill-current text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="fill-current text-yellow-400" />);
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative bg-white rounded-lg overflow-hidden h-[400px] md:h-[500px] flex items-center justify-center">
            <img 
              src={productImages[activeImageIndex]} 
              alt={product.name} 
              className="max-h-full max-w-full object-contain"
            />
            
            {/* Image navigation arrows */}
            {productImages.length > 1 && (
              <>
                <button 
                  className="absolute left-2 bg-white/80 hover:bg-white rounded-full p-2 text-primary"
                  onClick={() => navigateImages('prev')}
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  className="absolute right-2 bg-white/80 hover:bg-white rounded-full p-2 text-primary"
                  onClick={() => navigateImages('next')}
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
            
            {/* Discount label */}
            {product.discountPrice && (
              <div className="absolute top-2 left-2">
                <span className="bg-accent text-white text-sm font-semibold px-2 py-1 rounded">
                  -{discountPercentage}%
                </span>
              </div>
            )}
          </div>
          
          {/* Thumbnail images */}
          {productImages.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={`w-20 h-20 flex-shrink-0 border-2 rounded-md overflow-hidden ${
                    index === activeImageIndex ? 'border-primary' : 'border-transparent'
                  }`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} - view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Information */}
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">{product.name}</h1>
          
          {/* Rating & Brand */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="flex">
                {renderRatingStars(Number(product.averageRating))}
              </div>
              <span className="ml-2 text-sm">({product.reviewCount} đánh giá)</span>
            </div>
            {product.brand && (
              <div className="text-sm">
                Thương hiệu: <span className="font-medium">{product.brand}</span>
              </div>
            )}
          </div>
          
          {/* Price */}
          <div className="mb-6">
            {product.discountPrice ? (
              <div className="flex items-center">
                <span className="text-primary text-3xl font-accent font-bold">
                  {formatPrice(product.discountPrice)}
                </span>
                <span className="ml-3 text-neutral-800 line-through">
                  {formatPrice(product.price)}
                </span>
              </div>
            ) : (
              <span className="text-primary text-3xl font-accent font-bold">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <p className="text-neutral-800">{product.description}</p>
          </div>
          
          {/* Variants */}
          {product.variants && Object.keys(product.variants).length > 0 && (
            <div className="space-y-4 mb-6">
              {Object.entries(product.variants as Record<string, string[]>).map(([type, options]) => (
                <div key={type}>
                  <h3 className="font-medium mb-2 capitalize">{type}:</h3>
                  <RadioGroup 
                    value={selectedVariants[type]} 
                    onValueChange={(value) => handleVariantChange(type, value)}
                    className="flex flex-wrap gap-2"
                  >
                    {options.map(option => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem 
                          value={option} 
                          id={`${type}-${option}`} 
                          className="hidden peer"
                        />
                        <Label 
                          htmlFor={`${type}-${option}`} 
                          className="px-3 py-1 border rounded-md cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-white peer-data-[state=checked]:border-primary"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
            </div>
          )}
          
          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Số lượng:</h3>
            <div className="flex items-center space-x-2">
              <button 
                className="bg-neutral-100 hover:bg-neutral-200 p-2 rounded-md"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center">{quantity}</span>
              <button 
                className="bg-neutral-100 hover:bg-neutral-200 p-2 rounded-md"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Stock status */}
          <div className="mb-6">
            <p className={`${product.inStock ? 'text-success' : 'text-error'}`}>
              {product.inStock ? 'Còn hàng' : 'Hết hàng'}
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <Button 
              className="bg-primary hover:bg-primary/90 text-white py-6 px-8 flex-1"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Thêm vào giỏ hàng
            </Button>
            <Button variant="outline" className="border-2 border-neutral-200 py-6">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" className="border-2 border-neutral-200 py-6">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Product Details & Reviews Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full border-b">
            <TabsTrigger value="description" className="flex-1 font-heading">Mô tả chi tiết</TabsTrigger>
            <TabsTrigger value="reviews" className="flex-1 font-heading">Đánh giá ({product.reviewCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="p-4">
            <div className="prose max-w-none">
              <p>{product.description}</p>
              {/* Additional description content would go here */}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="p-4">
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="flex">
                          {renderRatingStars(review.rating)}
                        </div>
                        <span className="ml-2 font-medium">User #{review.userId}</span>
                      </div>
                      <span className="text-sm text-neutral-800">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6">Chưa có đánh giá nào cho sản phẩm này.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetail;
