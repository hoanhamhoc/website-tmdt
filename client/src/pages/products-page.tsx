import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Product, Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProductCard from "@/components/products/product-card";
import {
  Filter,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const sortOptions = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá: Thấp đến cao" },
  { value: "price-desc", label: "Giá: Cao đến thấp" },
  { value: "rating", label: "Đánh giá cao nhất" },
];

const brands = [
  "Nike",
  "Adidas",
  "Puma",
  "New Balance",
  "Mizuno",
  "Under Armour",
];

const ProductsPage = () => {
  // Get query parameters
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategorySlug = searchParams.get("category") || "";
  const initialQuery = searchParams.get("q") || "";
  const initialIsNew = searchParams.get("isNew") === "true";
  
  // State for filters
  const [categoryFilter, setCategoryFilter] = useState<string>(initialCategorySlug);
  const [brandFilters, setBrandFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000000]); // VND
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [showNewOnly, setShowNewOnly] = useState<boolean>(initialIsNew);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch products with filters
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: [
      "/api/products",
      categoryFilter,
      brandFilters,
      priceRange,
      sortBy,
      searchQuery,
      showNewOnly,
    ],
  });

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the URL and refetch products
  };

  // Clear all filters
  const clearFilters = () => {
    setCategoryFilter("");
    setBrandFilters([]);
    setPriceRange([0, 5000000]);
    setSortBy("newest");
    setSearchQuery("");
    setShowNewOnly(false);
  };

  // Toggle brand filter
  const toggleBrandFilter = (brand: string) => {
    if (brandFilters.includes(brand)) {
      setBrandFilters(brandFilters.filter((b) => b !== brand));
    } else {
      setBrandFilters([...brandFilters, brand]);
    }
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Extract categoryName from slug if available
  const selectedCategory = categories.find((cat) => cat.slug === categoryFilter);
  const categoryName = selectedCategory ? selectedCategory.name : "Tất cả sản phẩm";

  return (
    <div className="bg-neutral-100 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">{categoryName}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span>
              {products.length} sản phẩm{searchQuery ? ` cho "${searchQuery}"` : ""}
            </span>
            {(categoryFilter || brandFilters.length > 0 || showNewOnly || searchQuery) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="ml-2 text-sm"
              >
                <X className="h-4 w-4 mr-1" /> Xóa bộ lọc
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden md:block w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mb-6">
                <h3 className="font-heading font-semibold mb-3">Tìm kiếm</h3>
                <form onSubmit={handleSearch} className="flex">
                  <Input
                    type="text"
                    placeholder="Tìm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-r-none"
                  />
                  <Button type="submit" className="rounded-l-none">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>

              <div className="mb-6">
                <h3 className="font-heading font-semibold mb-3">Danh mục</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox
                      id="all-categories"
                      checked={categoryFilter === ""}
                      onCheckedChange={() => setCategoryFilter("")}
                    />
                    <Label
                      htmlFor="all-categories"
                      className="ml-2 text-sm font-medium cursor-pointer"
                    >
                      Tất cả
                    </Label>
                  </div>
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={categoryFilter === category.slug}
                        onCheckedChange={() => setCategoryFilter(category.slug)}
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="ml-2 text-sm font-medium cursor-pointer"
                      >
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-heading font-semibold mb-3">Thương hiệu</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={brandFilters.includes(brand)}
                        onCheckedChange={() => toggleBrandFilter(brand)}
                      />
                      <Label
                        htmlFor={`brand-${brand}`}
                        className="ml-2 text-sm font-medium cursor-pointer"
                      >
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-heading font-semibold mb-3">Giá</h3>
                <div className="pt-6 px-2">
                  <Slider
                    value={priceRange}
                    min={0}
                    max={5000000}
                    step={100000}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex justify-between mt-2 text-sm">
                    <span>{formatPrice(priceRange[0])}</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center">
                  <Checkbox
                    id="new-only"
                    checked={showNewOnly}
                    onCheckedChange={(checked) => setShowNewOnly(!!checked)}
                  />
                  <Label
                    htmlFor="new-only"
                    className="ml-2 text-sm font-medium cursor-pointer"
                  >
                    Chỉ hiện sản phẩm mới
                  </Label>
                </div>
              </div>

              <Button
                onClick={clearFilters}
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>

          {/* Mobile filters button */}
          <div className="md:hidden flex justify-between items-center mb-4 w-full">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  Bộ lọc
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Bộ lọc</SheetTitle>
                </SheetHeader>
                <div className="py-4">
                  <div className="mb-6">
                    <h3 className="font-heading font-semibold mb-3">Tìm kiếm</h3>
                    <form onSubmit={handleSearch} className="flex">
                      <Input
                        type="text"
                        placeholder="Tìm sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="rounded-r-none"
                      />
                      <Button type="submit" className="rounded-l-none">
                        <Search className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-heading font-semibold mb-3">Danh mục</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox
                          id="mobile-all-categories"
                          checked={categoryFilter === ""}
                          onCheckedChange={() => setCategoryFilter("")}
                        />
                        <Label
                          htmlFor="mobile-all-categories"
                          className="ml-2 text-sm font-medium cursor-pointer"
                        >
                          Tất cả
                        </Label>
                      </div>
                      {categories.map((category) => (
                        <div key={`mobile-${category.id}`} className="flex items-center">
                          <Checkbox
                            id={`mobile-category-${category.id}`}
                            checked={categoryFilter === category.slug}
                            onCheckedChange={() => setCategoryFilter(category.slug)}
                          />
                          <Label
                            htmlFor={`mobile-category-${category.id}`}
                            className="ml-2 text-sm font-medium cursor-pointer"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-heading font-semibold mb-3">Thương hiệu</h3>
                    <div className="space-y-2">
                      {brands.map((brand) => (
                        <div key={`mobile-${brand}`} className="flex items-center">
                          <Checkbox
                            id={`mobile-brand-${brand}`}
                            checked={brandFilters.includes(brand)}
                            onCheckedChange={() => toggleBrandFilter(brand)}
                          />
                          <Label
                            htmlFor={`mobile-brand-${brand}`}
                            className="ml-2 text-sm font-medium cursor-pointer"
                          >
                            {brand}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-heading font-semibold mb-3">Giá</h3>
                    <div className="pt-6 px-2">
                      <Slider
                        value={priceRange}
                        min={0}
                        max={5000000}
                        step={100000}
                        onValueChange={setPriceRange}
                      />
                      <div className="flex justify-between mt-2 text-sm">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center">
                      <Checkbox
                        id="mobile-new-only"
                        checked={showNewOnly}
                        onCheckedChange={(checked) => setShowNewOnly(!!checked)}
                      />
                      <Label
                        htmlFor="mobile-new-only"
                        className="ml-2 text-sm font-medium cursor-pointer"
                      >
                        Chỉ hiện sản phẩm mới
                      </Label>
                    </div>
                  </div>

                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Xóa bộ lọc
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="hidden md:flex justify-end mb-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sắp xếp theo" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg overflow-hidden shadow-md"
                  >
                    <div className="h-64 bg-neutral-200 animate-pulse" />
                    <div className="p-4">
                      <div className="h-4 bg-neutral-200 animate-pulse mb-2" />
                      <div className="h-4 w-2/3 bg-neutral-200 animate-pulse mb-2" />
                      <div className="h-6 w-1/3 bg-neutral-200 animate-pulse mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showAddToCartButton
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-lg mb-4">
                  Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.
                </p>
                <Button onClick={clearFilters}>Xóa bộ lọc</Button>
              </div>
            )}

            {/* Pagination */}
            {products.length > 0 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-1">
                  <Button variant="outline" className="w-10 h-10 p-0">
                    &lt;
                  </Button>
                  <Button variant="outline" className="w-10 h-10 p-0 bg-primary text-white">
                    1
                  </Button>
                  <Button variant="outline" className="w-10 h-10 p-0">
                    2
                  </Button>
                  <Button variant="outline" className="w-10 h-10 p-0">
                    3
                  </Button>
                  <Button variant="outline" className="w-10 h-10 p-0">
                    &gt;
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
