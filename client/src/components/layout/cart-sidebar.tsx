import { useState } from "react";
import { Link, useLocation } from "wouter";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const { items, removeItem, updateItemQuantity, totalPrice, shippingCost } = useCart();
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const handleIncreaseQuantity = (id: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      updateItemQuantity(id, item.quantity + 1);
    }
  };

  const handleDecreaseQuantity = (id: number) => {
    const item = items.find(item => item.id === id);
    if (item && item.quantity > 1) {
      updateItemQuantity(id, item.quantity - 1);
    }
  };

  const handleRemoveItem = (id: number) => {
    removeItem(id);
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth?redirect=checkout');
    } else {
      navigate('/checkout');
    }
    onClose();
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-lg transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
          <h2 className="font-heading font-bold text-lg">Giỏ hàng của bạn</h2>
          <button
            className="text-neutral-800 hover:text-primary"
            onClick={onClose}
            aria-label="Đóng giỏ hàng"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={`${item.id}-${JSON.stringify(item.variant)}`} className="flex items-center border-b border-neutral-200 py-4">
                <img 
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-neutral-800">
                    {item.variant && `${Object.entries(item.variant).map(([key, value]) => `${key}: ${value}`).join(' | ')}`}
                  </p>
                  <div className="flex items-center mt-2">
                    <button 
                      className="text-neutral-800 hover:text-primary"
                      onClick={() => handleDecreaseQuantity(item.id)}
                      aria-label="Giảm số lượng"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="mx-2 w-8 text-center">{item.quantity}</span>
                    <button 
                      className="text-neutral-800 hover:text-primary"
                      onClick={() => handleIncreaseQuantity(item.id)}
                      aria-label="Tăng số lượng"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-accent font-semibold text-primary">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price * item.quantity)}
                  </p>
                  <button 
                    className="text-red-500 hover:text-red-600 mt-2"
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label="Xóa sản phẩm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <p className="text-neutral-800 mb-4">Giỏ hàng của bạn đang trống</p>
              <Link href="/products">
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={onClose}
                >
                  Mua sắm ngay
                </Button>
              </Link>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-neutral-200">
            <div className="flex justify-between mb-2">
              <span>Tạm tính:</span>
              <span className="font-accent font-semibold">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
              </span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Phí vận chuyển:</span>
              <span className="font-accent font-semibold">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between mb-6 text-lg font-bold">
              <span>Tổng cộng:</span>
              <span className="font-accent text-primary">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice + shippingCost)}
              </span>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white py-6 font-heading font-semibold mb-3"
              onClick={handleCheckout}
            >
              Tiến hành thanh toán
            </Button>

            <Button
              variant="outline"
              className="w-full border border-primary text-primary hover:bg-primary/10 py-6 font-heading font-semibold"
              onClick={onClose}
            >
              Tiếp tục mua hàng
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
