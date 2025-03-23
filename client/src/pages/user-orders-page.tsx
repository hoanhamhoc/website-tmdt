import { useQuery } from "@tanstack/react-query";
import { Order, OrderItem } from "@shared/schema";
import { Link } from "wouter";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Clock, Check, Truck, XCircle, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type StatusProps = {
  status: string;
};

const OrderStatusBadge = ({ status }: StatusProps) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
          <Clock className="mr-1 h-3 w-3" /> Chờ xác nhận
        </Badge>
      );
    case "confirmed":
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-500">
          <Check className="mr-1 h-3 w-3" /> Đã xác nhận
        </Badge>
      );
    case "shipping":
      return (
        <Badge variant="outline" className="border-primary text-primary">
          <Truck className="mr-1 h-3 w-3" /> Đang giao hàng
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="border-success text-success">
          <Check className="mr-1 h-3 w-3" /> Hoàn tất
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="outline" className="border-destructive text-destructive">
          <XCircle className="mr-1 h-3 w-3" /> Đã hủy
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );
  }
};

const PaymentStatusBadge = ({ status }: StatusProps) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
          Chưa thanh toán
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="outline" className="border-blue-500 text-blue-500">
          Đang xử lý
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="border-success text-success">
          Đã thanh toán
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="outline" className="border-destructive text-destructive">
          Thanh toán thất bại
        </Badge>
      );
    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );
  }
};

// This type combines Order with its items for easier display
type OrderWithItems = Order & { items: (OrderItem & { product: { name: string, imageUrl: string } })[] };

const UserOrdersPage = () => {
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  const { data: orders = [], isLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/user/orders"],
  });

  // Toggle order details expansion
  const toggleOrderDetails = (orderId: number) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format price to VND
  const formatPrice = (price: number | string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price));
  };

  return (
    <div className="bg-neutral-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold mb-8">Đơn hàng của tôi</h1>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
            <TabsTrigger value="confirmed">Đã xác nhận</TabsTrigger>
            <TabsTrigger value="shipping">Đang giao</TabsTrigger>
            <TabsTrigger value="completed">Hoàn tất</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="h-6 bg-neutral-200 rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-neutral-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded w-1/3 mb-4"></div>
                    <div className="h-20 bg-neutral-200 rounded mb-4"></div>
                  </div>
                ))}
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                          <h3 className="font-heading font-semibold mb-1">
                            Đơn hàng #{order.id}
                          </h3>
                          <p className="text-sm text-neutral-800">
                            Ngày đặt hàng: {formatDate(order.createdAt.toString())}
                          </p>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mt-3 md:mt-0">
                          <OrderStatusBadge status={order.status} />
                          <PaymentStatusBadge status={order.paymentStatus} />
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            Tổng tiền: <span className="text-primary">{formatPrice(order.totalAmount)}</span>
                          </p>
                          <p className="text-sm">{order.items.length} sản phẩm</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleOrderDetails(order.id)}
                          className="flex items-center text-primary"
                        >
                          {expandedOrders.has(order.id) ? (
                            <>
                              Ẩn chi tiết <ChevronUp className="ml-1 h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Xem chi tiết <ChevronDown className="ml-1 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>

                      {expandedOrders.has(order.id) && (
                        <>
                          <Separator className="my-4" />
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-start">
                                <div className="w-16 h-16 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                                  <img
                                    src={item.product?.imageUrl}
                                    alt={item.product?.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="ml-3 flex-1">
                                  <p className="font-medium">{item.product?.name}</p>
                                  {item.variantData && (
                                    <p className="text-xs text-neutral-800">
                                      {Object.entries(item.variantData as Record<string, string>)
                                        .map(([key, value]) => `${key}: ${value}`)
                                        .join(", ")}
                                    </p>
                                  )}
                                  <div className="flex justify-between mt-1">
                                    <span className="text-sm">
                                      SL: {item.quantity} x {formatPrice(item.price)}
                                    </span>
                                    <span className="font-semibold text-primary">
                                      {formatPrice(Number(item.price) * item.quantity)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}

                            <div className="mt-4 pt-4 border-t">
                              <div className="flex justify-between mb-2">
                                <span>Địa chỉ giao hàng:</span>
                                <span className="text-right">{order.shippingAddress}</span>
                              </div>
                              <div className="flex justify-between mb-2">
                                <span>Phương thức thanh toán:</span>
                                <span>
                                  {order.paymentMethod === "cod"
                                    ? "Thanh toán khi nhận hàng"
                                    : order.paymentMethod}
                                </span>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                              {order.status === "pending" && (
                                <Button variant="destructive">Hủy đơn hàng</Button>
                              )}
                              <Link href={`/products`}>
                                <Button variant="outline">Mua lại</Button>
                              </Link>
                              <Link href={`/order/${order.id}`}>
                                <Button className="bg-primary text-white">
                                  Chi tiết <ArrowRight className="ml-1 h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-neutral-800" />
                </div>
                <h2 className="text-xl font-heading font-semibold mb-2">
                  Bạn chưa có đơn hàng nào
                </h2>
                <p className="text-neutral-800 mb-6">
                  Hãy mua sắm và quay lại đây để theo dõi đơn hàng của bạn
                </p>
                <Link href="/products">
                  <Button className="bg-primary hover:bg-primary/90 text-white font-heading font-semibold">
                    Mua sắm ngay
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Other tab contents would follow the same pattern but filter orders by status */}
          <TabsContent value="pending">
            {/* Similar content but filtered for pending orders */}
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p>Không có đơn hàng chờ xác nhận</p>
            </div>
          </TabsContent>

          <TabsContent value="confirmed">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p>Không có đơn hàng đã xác nhận</p>
            </div>
          </TabsContent>

          <TabsContent value="shipping">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p>Không có đơn hàng đang giao</p>
            </div>
          </TabsContent>

          <TabsContent value="completed">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p>Không có đơn hàng hoàn tất</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserOrdersPage;
