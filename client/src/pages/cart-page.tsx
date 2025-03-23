import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";

const CartPage = () => {
  const { items, removeItem, updateItemQuantity, totalPrice, shippingCost, clearCart } = useCart();
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
  };

  // Format price to VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price);
  };

  return (
    <div className="bg-neutral-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold mb-8">Giỏ hàng của bạn</h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="hidden md:grid grid-cols-12 gap-4 mb-4 font-semibold text-neutral-800">
                  <div className="col-span-6">Sản phẩm</div>
                  <div className="col-span-2 text-center">Giá</div>
                  <div className="col-span-2 text-center">Số lượng</div>
                  <div className="col-span-2 text-right">Tổng</div>
                </div>

                <Separator className="mb-4 md:hidden" />

                {items.map((item) => (
                  <div key={`${item.id}-${JSON.stringify(item.variant)}`}>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-4">
                      {/* Mobile: Product + Price */}
                      <div className="md:col-span-6 flex items-center">
                        <div className="w-20 h-20 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <Link href={`/products/${item.id}`}>
                            <a className="font-semibold hover:text-primary transition-colors line-clamp-2">
                              {item.name}
                            </a>
                          </Link>
                          {item.variant && (
                            <p className="text-sm text-neutral-800 mt-1">
                              {Object.entries(item.variant)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ")}
                            </p>
                          )}
                          <p className="text-primary font-semibold md:hidden mt-1">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>

                      {/* Desktop: Price */}
                      <div className="hidden md:block md:col-span-2 text-center">
                        <p className="text-primary font-semibold">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-2 flex items-center md:justify-center">
                        <div className="flex items-center border rounded-md">
                          <button
                            className="p-2 text-neutral-800 hover:text-primary transition-colors"
                            onClick={() => handleDecreaseQuantity(item.id)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4">{item.quantity}</span>
                          <button
                            className="p-2 text-neutral-800 hover:text-primary transition-colors"
                            onClick={() => handleIncreaseQuantity(item.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          className="ml-4 text-red-500 hover:text-red-600 transition-colors"
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Total */}
                      <div className="md:col-span-2 text-right font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))}

                <div className="flex justify-between items-center mt-6">
                  <Link href="/products">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                      Tiếp tục mua hàng
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                    onClick={() => clearCart()}
                  >
                    Xóa giỏ hàng
                  </Button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-heading font-semibold mb-4">Thông tin đơn hàng</h2>
                <Separator className="mb-4" />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>
                      {shippingCost === 0 
                        ? "Miễn phí" 
                        : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">
                      {formatPrice(totalPrice + shippingCost)}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-heading font-semibold py-6"
                  onClick={handleCheckout}
                >
                  Tiến hành thanh toán
                </Button>

                <div className="mt-4 text-sm text-neutral-800">
                  <p className="mb-2">Chúng tôi chấp nhận:</p>
                  <div className="flex flex-wrap gap-2">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                      alt="Visa"
                      className="h-6"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                      alt="Mastercard"
                      className="h-6"
                    />
                    <img
                      src="https://logowik.com/content/uploads/images/jcb-payment2629.jpg"
                      alt="JCB"
                      className="h-6"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/9/9e/Momo_Logo.png"
                      alt="MoMo"
                      className="h-6"
                    />
                    <img
                      src="https://upload.wikimedia.org/wikipedia/vi/f/fe/ZaloPay_Logo.png"
                      alt="ZaloPay"
                      className="h-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-neutral-800" />
            </div>
            <h2 className="text-xl font-heading font-semibold mb-2">Giỏ hàng của bạn đang trống</h2>
            <p className="text-neutral-800 mb-6">
              Chưa có sản phẩm nào trong giỏ hàng của bạn.
            </p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90 text-white font-heading font-semibold">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
