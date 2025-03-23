import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { X, Search } from "lucide-react";
import { Product } from "@shared/schema";
import { Input } from "@/components/ui/input";

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const popularSearches = [
  { text: "Áo đấu Manchester United", link: "/products?q=manchester+united" },
  { text: "Giày Nike Phantom", link: "/products?q=nike+phantom" },
  { text: "Bóng đá World Cup", link: "/products?q=world+cup" },
  { text: "Găng tay thủ môn", link: "/products?q=găng+tay+thủ+môn" },
];

const SearchPanel = ({ isOpen, onClose }: SearchPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Search products when search query changes
  const { data: searchResults, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/search", searchQuery],
    enabled: searchQuery.length > 2, // Only search when query is at least 3 chars
    queryFn: () => Promise.resolve([]), // This will be replaced with actual API call
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`;
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center overflow-y-auto">
      <div className="bg-white p-4 md:p-6 max-w-3xl mx-auto mt-24 rounded-lg animate-in fade-in w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-heading text-xl font-bold">Tìm kiếm</h2>
          <button
            className="text-neutral-800 hover:text-primary"
            onClick={onClose}
            aria-label="Đóng tìm kiếm"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="Nhập từ khóa tìm kiếm..."
            className="w-full border border-neutral-200 rounded-lg p-3 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-800" />
        </form>

        {searchResults && searchResults.length > 0 ? (
          <div className="mt-4">
            <h3 className="font-heading font-semibold mb-2">Kết quả tìm kiếm</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((product) => (
                <Link
                  href={`/products/${product.slug}`}
                  key={product.id}
                  onClick={onClose}
                >
                  <a className="flex items-center p-2 hover:bg-neutral-100 rounded-lg">
                    <img 
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md mr-3"
                    />
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-neutral-800">
                        {product.discountPrice ? (
                          <>
                            <span className="text-primary font-semibold">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.discountPrice))}
                            </span>
                            <span className="line-through ml-2">
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))}
                            </span>
                          </>
                        ) : (
                          <span className="text-primary font-semibold">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))}
                          </span>
                        )}
                      </p>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        ) : searchQuery.length > 2 && !isLoading ? (
          <div className="mt-4 text-center py-6">
            <p className="text-neutral-800">Không tìm thấy sản phẩm phù hợp với từ khóa "{searchQuery}"</p>
          </div>
        ) : (
          <div className="mt-4">
            <h3 className="font-heading font-semibold mb-2">Tìm kiếm phổ biến</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <Link href={search.link} key={index} onClick={onClose}>
                  <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm hover:bg-primary hover:text-white transition-colors">
                    {search.text}
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPanel;
