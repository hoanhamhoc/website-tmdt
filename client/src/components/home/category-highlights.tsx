import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";

const defaultCategories = [
  {
    id: 1,
    name: "Áo bóng đá",
    slug: "ao-bong-da",
    description: "Áo đấu chính hãng",
    imageUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    name: "Giày bóng đá",
    slug: "giay-bong-da",
    description: "Giày đá bóng chuyên dụng",
    imageUrl: "https://images.unsplash.com/photo-1511886929837-354d1a99fc32?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    name: "Bóng",
    slug: "bong",
    description: "Bóng thi đấu & tập luyện",
    imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: 4,
    name: "Phụ kiện",
    slug: "phu-kien",
    description: "Găng tay, băng bảo vệ & hơn thế",
    imageUrl: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=500&auto=format&fit=crop&q=60"
  }
];

const CategoryHighlights = () => {
  const { data: categories = defaultCategories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-center mb-8">Danh mục sản phẩm</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link href={`/products?category=${category.slug}`} key={category.id} className="group">
                <div className="rounded-lg overflow-hidden relative h-48 md:h-64">
                  <img 
                    src={category.imageUrl || ''} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent flex items-end">
                    <div className="p-4">
                      <h3 className="text-white font-heading font-semibold text-xl">{category.name}</h3>
                      <p className="text-white/90 text-sm mt-1">{category.description}</p>
                    </div>
                  </div>
                </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryHighlights;
