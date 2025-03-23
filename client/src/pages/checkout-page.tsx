import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Wallet, CreditCard, QrCode, Banknote, Shield, ChevronLeft } from "lucide-react";
import { FaPaypal } from "react-icons/fa";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  city: z.string().min(2, "Thành phố không được để trống"),
  district: z.string().min(2, "Quận/Huyện không được để trống"),
  ward: z.string().min(2, "Phường/Xã không được để trống"),
  paymentMethod: z.enum(["cod", "momo", "zalopay", "visa", "qr"]),
  note: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const paymentMethods = [
  {
    id: "cod",
    name: "Thanh toán khi nhận hàng",
    description: "Thanh toán bằng tiền mặt khi nhận hàng",
    icon: <Banknote className="h-5 w-5 text-primary" />,
  },
  {
    id: "momo",
    name: "Ví MoMo",
    description: "Thanh toán qua ví điện tử MoMo",
    icon: <Wallet className="h-5 w-5 text-[#A50064]" />,
  },
  {
    id: "zalopay",
    name: "ZaloPay",
    description: "Thanh toán qua ví điện tử ZaloPay",
    icon: <Wallet className="h-5 w-5 text-[#0068FF]" />,
  },
  {
    id: "visa",
    name: "Thẻ tín dụng/ghi nợ",
    description: "Thanh toán bằng thẻ Visa, Mastercard, JCB",
    icon: <CreditCard className="h-5 w-5 text-primary" />,
  },
  {
    id: "qr",
    name: "Quét mã QR",
    description: "Quét mã QR để thanh toán",
    icon: <QrCode className="h-5 w-5 text-primary" />,
  },
];

const CheckoutPage = () => {
  const { user } = useAuth();
  const { items, totalPrice, shippingCost, clearCart } = useCart();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("cod");

  // Initialize form with user data if available
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      email: user?.email || "",
      address: user?.address || "",
      city: "",
      district: "",
      ward: "",
      paymentMethod: "cod",
      note: "",
    },
  });

  // Format price to VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) {
      toast({
        title: "Giỏ hàng trống",
        description: "Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order request
      const orderData = {
        userId: user?.id,
        status: "pending",
        totalAmount: totalPrice + shippingCost,
        shippingAddress: `${data.address}, ${data.ward}, ${data.district}, ${data.city}`,
        paymentMethod: data.paymentMethod,
        paymentStatus: data.paymentMethod === "cod" ? "pending" : "processing",
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          variantData: item.variant,
        })),
      };

      const res = await apiRequest("POST", "/api/orders", orderData);
      const order = await res.json();

      // Handle payment method specific actions
      if (data.paymentMethod !== "cod") {
        // In a real app, we would redirect to payment gateway
        // Simulate payment process
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
          clearCart();
          navigate("/order-success");
        }, 1000);
      } else {
        // For COD, directly go to success page
        queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
        clearCart();
        navigate("/order-success");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Đặt hàng thất bại",
        description: "Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold mb-8">Thanh toán</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Shipping Information */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-heading font-semibold mb-4">Thông tin giao hàng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Họ và tên</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập họ và tên" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số điện thoại</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập số điện thoại" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập địa chỉ email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Địa chỉ</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập địa chỉ nhận hàng" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tỉnh/Thành phố</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập tỉnh/thành phố" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quận/Huyện</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập quận/huyện" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="ward"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phường/Xã</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập phường/xã" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Ghi chú (tùy chọn)</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Nhập ghi chú cho đơn hàng"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-heading font-semibold mb-4">Phương thức thanh toán</h2>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedPayment(value);
                              }}
                              value={field.value}
                              className="space-y-3"
                            >
                              {paymentMethods.map((method) => (
                                <div
                                  key={method.id}
                                  className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                                    field.value === method.id
                                      ? "border-primary bg-primary/5"
                                      : "border-neutral-200 hover:border-primary/50"
                                  }`}
                                >
                                  <RadioGroupItem
                                    value={method.id}
                                    id={method.id}
                                    className="sr-only"
                                  />
                                  <Label
                                    htmlFor={method.id}
                                    className="flex items-center cursor-pointer flex-1"
                                  >
                                    <div className="mr-3">{method.icon}</div>
                                    <div>
                                      <p className="font-medium">{method.name}</p>
                                      <p className="text-sm text-neutral-800">
                                        {method.description}
                                      </p>
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Display QR code if QR selected */}
                    {selectedPayment === "qr" && (
                      <div className="mt-4 p-4 border border-dashed border-primary rounded-lg flex flex-col items-center">
                        <p className="text-center mb-2">Quét mã QR để thanh toán</p>
                        <div className="bg-white p-2 rounded">
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                            alt="Payment QR Code"
                            className="w-48 h-48"
                          />
                        </div>
                        <p className="text-sm text-neutral-800 mt-2">
                          Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã QR
                        </p>
                      </div>
                    )}

                    {/* Display wallet options if wallet selected */}
                    {(selectedPayment === "momo" || selectedPayment === "zalopay") && (
                      <div className="mt-4 p-4 border border-dashed border-primary rounded-lg">
                        <p className="mb-2">
                          Bạn sẽ được chuyển đến trang thanh toán sau khi xác nhận đơn hàng
                        </p>
                        <div className="flex items-center">
                          <Shield className="text-success h-5 w-5 mr-2" />
                          <span className="text-sm">Thanh toán an toàn & bảo mật</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-between items-center">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center"
                    onClick={() => navigate("/cart")}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại giỏ hàng
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-white font-heading font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang xử lý..." : "Hoàn tất đơn hàng"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-heading font-semibold mb-4">Đơn hàng của bạn</h2>
                <Separator className="mb-4" />

                <div className="max-h-80 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${JSON.stringify(item.variant)}`}
                      className="flex items-start py-3 border-b last:border-b-0"
                    >
                      <div className="w-16 h-16 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="font-medium line-clamp-1">{item.name}</p>
                        {item.variant && (
                          <p className="text-xs text-neutral-800">
                            {Object.entries(item.variant)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")}
                          </p>
                        )}
                        <div className="flex justify-between mt-1">
                          <span className="text-sm">
                            SL: {item.quantity} x {formatPrice(item.price)}
                          </span>
                          <span className="font-semibold text-primary">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>
                      {shippingCost === 0 ? "Miễn phí" : formatPrice(shippingCost)}
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

                <div className="mt-6 p-3 bg-neutral-100 rounded-lg text-sm">
                  <p className="flex items-center">
                    <Shield className="h-4 w-4 text-success mr-2" />
                    Thông tin thanh toán của bạn được bảo mật an toàn
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
