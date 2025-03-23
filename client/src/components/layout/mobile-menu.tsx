import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { X, ChevronDown, ChevronUp, Volleyball } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const { user, logoutMutation } = useAuth();

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
      <div className="bg-white h-full w-4/5 max-w-sm transform transition-transform duration-300 overflow-y-auto">
        <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
          <div className="flex items-center">
            <Volleyball className="text-primary h-6 w-6 mr-2" />
            <span className="font-heading font-bold text-lg text-primary">FOOTBALL SHOP</span>
          </div>
          <button
            className="text-neutral-800"
            onClick={onClose}
            aria-label="Đóng menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4">
          <Link href="/">
            <a className="block py-3 border-b border-neutral-200 font-heading font-medium" onClick={onClose}>
              Trang chủ
            </a>
          </Link>
          <Link href="/products">
            <a className="block py-3 border-b border-neutral-200 font-heading font-medium" onClick={onClose}>
              Sản phẩm
            </a>
          </Link>

          <div className="py-3 border-b border-neutral-200">
            <div
              className="flex items-center justify-between font-heading font-medium"
              onClick={toggleSubmenu}
            >
              <span>Danh mục</span>
              {isSubmenuOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </div>
            <div className={`pl-4 mt-2 ${isSubmenuOpen ? "block" : "hidden"}`}>
              <Link href="/products?category=ao-bong-da">
                <a className="block py-2 text-sm" onClick={onClose}>
                  Áo bóng đá
                </a>
              </Link>
              <Link href="/products?category=giay-bong-da">
                <a className="block py-2 text-sm" onClick={onClose}>
                  Giày bóng đá
                </a>
              </Link>
              <Link href="/products?category=bong">
                <a className="block py-2 text-sm" onClick={onClose}>
                  Bóng
                </a>
              </Link>
              <Link href="/products?category=phu-kien">
                <a className="block py-2 text-sm" onClick={onClose}>
                  Phụ kiện
                </a>
              </Link>
            </div>
          </div>

          <Link href="/blog">
            <a className="block py-3 border-b border-neutral-200 font-heading font-medium" onClick={onClose}>
              Tin tức
            </a>
          </Link>
          <Link href="/contact">
            <a className="block py-3 border-b border-neutral-200 font-heading font-medium" onClick={onClose}>
              Liên hệ
            </a>
          </Link>
          
          <div className="mt-6">
            {user ? (
              <>
                <Link href="/my-orders">
                  <a 
                    className="block bg-primary text-white text-center py-3 rounded-lg font-heading font-semibold mb-3"
                    onClick={onClose}
                  >
                    Đơn hàng của tôi
                  </a>
                </Link>
                <button
                  className="w-full block border border-primary text-primary text-center py-3 rounded-lg font-heading font-semibold"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <a 
                    className="block bg-primary text-white text-center py-3 rounded-lg font-heading font-semibold mb-3"
                    onClick={onClose}
                  >
                    Đăng nhập
                  </a>
                </Link>
                <Link href="/auth">
                  <a 
                    className="block border border-primary text-primary text-center py-3 rounded-lg font-heading font-semibold"
                    onClick={onClose}
                  >
                    Đăng ký
                  </a>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
