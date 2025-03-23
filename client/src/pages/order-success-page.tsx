import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { CheckCircle, ArrowRight, ShoppingBag, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";

const OrderSuccessPage = () => {
  const [location, navigate] = useLocation();
  const { items } = useCart();

  // Redirect if no items were in cart (user might have navigated directly to this page)
  useEffect(() => {
    if (items.length > 0) {
      // In a real app we would check if there was an actual order
      return;
    }

    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [items, navigate]);

  return (
    <div className="bg-neutral-100 py-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="mb-6 flex justify-center">
              <CheckCircle className="h-16 w-16 text-success" />
            </div>
            <h1 className="text-2xl font-heading font-bold mb-2">Đặt hàng thành công!</h1>
            <p className="text-neutral-800 mb-6">
              Cảm ơn bạn đã mua hàng tại Football Shop. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.
            </p>

            <div className="bg-success/10 p-4 rounded-lg mb-6">
              <p className="text-success">
                Email xác nhận đơn hàng sẽ được gửi đến địa chỉ email của bạn.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div className="bg-neutral-100 p-4 rounded-lg">
                <div className="font-semibold mb-1">Mã đơn hàng</div>
                <div className="text-primary text-lg">#FS123456</div>
              </div>
              <div className="bg-neutral-100 p-4 rounded-lg">
                <div className="font-semibold mb-1">Trạng thái đơn hàng</div>
                <div className="text-success">Đã xác nhận</div>
              </div>
            </div>

            <div className="space-y-3 text-left mb-8">
              <div className="flex justify-between pb-2 border-b border-neutral-200">
                <span className="font-semibold">Phương thức thanh toán:</span>
                <span>Thanh toán qua Ví MoMo</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-200">
                <span className="font-semibold">Trạng thái thanh toán:</span>
                <span className="text-success">Đã thanh toán</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-200">
                <span className="font-semibold">Ngày đặt hàng:</span>
                <span>{new Date().toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-200">
                <span className="font-semibold">Dự kiến giao hàng:</span>
                <span>3-5 ngày làm việc</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/my-orders">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-heading font-semibold">
                  <ShoppingBag className="mr-2 h-4 w-4" /> Xem đơn hàng của tôi
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <Home className="mr-2 h-4 w-4" /> Về trang chủ
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
