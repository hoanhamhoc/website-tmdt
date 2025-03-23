import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import MobileMenu from "./mobile-menu";
import SearchPanel from "./search-panel";
import CartSidebar from "./cart-sidebar";
import { ShoppingCart, User, Search, Menu, Volleyball } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, logoutMutation } = useAuth();
  const { items } = useCart();
  const [location] = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const isActive = (path: string) => location === path;

  return (
    <>
      <header className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Volleyball className="text-primary mr-2 h-6 w-6" />
                <span className="font-heading font-bold text-xl text-primary">FOOTBALL SHOP</span>
              </Link>
            </div>

            {/* Main Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/">
                <a className={`font-heading font-medium hover:text-primary transition-colors ${isActive("/") ? "text-primary" : ""}`}>
                  Trang chủ
                </a>
              </Link>
              <Link href="/products">
                <a className={`font-heading font-medium hover:text-primary transition-colors ${isActive("/products") ? "text-primary" : ""}`}>
                  Sản phẩm
                </a>
              </Link>
              <div className="relative group">
                <a href="#" className="font-heading font-medium hover:text-primary transition-colors flex items-center">
                  Danh mục
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-2">
                    <Link href="/products?category=ao-bong-da">
                      <a className="block px-4 py-2 text-sm hover:bg-neutral-100">Áo bóng đá</a>
                    </Link>
                    <Link href="/products?category=giay-bong-da">
                      <a className="block px-4 py-2 text-sm hover:bg-neutral-100">Giày bóng đá</a>
                    </Link>
                    <Link href="/products?category=bong">
                      <a className="block px-4 py-2 text-sm hover:bg-neutral-100">Bóng</a>
                    </Link>
                    <Link href="/products?category=phu-kien">
                      <a className="block px-4 py-2 text-sm hover:bg-neutral-100">Phụ kiện</a>
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/blog">
                <a className={`font-heading font-medium hover:text-primary transition-colors ${isActive("/blog") ? "text-primary" : ""}`}>
                  Tin tức
                </a>
              </Link>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button 
                className="text-neutral-800 hover:text-primary transition-colors relative"
                onClick={toggleSearch}
                aria-label="Tìm kiếm"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* User Account */}
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-neutral-800 hover:text-primary transition-colors" aria-label="Tài khoản">
                      <User className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {user ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/my-orders">Đơn hàng của tôi</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                          Đăng xuất
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/auth">Đăng nhập</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/auth">Đăng ký</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Shopping Cart */}
              <button
                className="text-neutral-800 hover:text-primary transition-colors relative"
                onClick={toggleCart}
                aria-label="Giỏ hàng"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-neutral-800"
                onClick={toggleMobileMenu}
                aria-label="Menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Search Panel */}
      <SearchPanel isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
