import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volleyball } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

const AuthPage = () => {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [location, navigate] = useLocation();
  
  // Get redirect URL from query parameters
  const params = new URLSearchParams(window.location.search);
  const redirectTo = params.get("redirect") || "/";

  // If user is already logged in, redirect to home page or redirectTo
  useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      fullName: "",
      phone: "",
      address: "",
    },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  const onRegisterSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-neutral-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Auth Forms */}
            <div className="p-8 md:p-12">
              <div className="mb-8 text-center">
                <div className="flex justify-center mb-4">
                  <Volleyball className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-2xl font-heading font-bold">
                  {activeTab === "login" ? "Đăng nhập tài khoản" : "Đăng ký tài khoản mới"}
                </h1>
                <p className="text-neutral-600 mt-2">
                  {activeTab === "login"
                    ? "Đăng nhập để tiếp tục mua sắm và quản lý đơn hàng"
                    : "Tạo tài khoản để trải nghiệm mua sắm tốt hơn"}
                </p>
              </div>

              <Tabs
                defaultValue="login"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-8">
                  <TabsTrigger value="login" className="font-heading">
                    Đăng nhập
                  </TabsTrigger>
                  <TabsTrigger value="register" className="font-heading">
                    Đăng ký
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên đăng nhập</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập tên đăng nhập" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mật khẩu</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Nhập mật khẩu" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white py-6 font-heading font-semibold mt-6"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tên đăng nhập</FormLabel>
                              <FormControl>
                                <Input placeholder="Nhập tên đăng nhập" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
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
                      </div>

                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập địa chỉ email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mật khẩu</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="Nhập mật khẩu" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
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
                      </div>

                      <FormField
                        control={registerForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Địa chỉ</FormLabel>
                            <FormControl>
                              <Input placeholder="Nhập địa chỉ" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-white py-6 font-heading font-semibold mt-6"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </div>

            {/* Hero Section */}
            <div className="hidden md:block relative overflow-hidden">
              <div className="absolute inset-0 bg-primary">
                <img
                  src="https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=1200&auto=format&fit=crop&q=80"
                  alt="Football players"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/50 flex items-center justify-center">
                  <div className="text-center p-8">
                    <h2 className="text-white text-3xl md:text-4xl font-heading font-bold mb-4">
                      Football Shop
                    </h2>
                    <p className="text-white/90 text-lg mb-4">
                      Cửa hàng bóng đá chính hãng với đầy đủ sản phẩm cao cấp từ các thương hiệu hàng đầu thế giới.
                    </p>
                    <ul className="text-white/90 space-y-2 text-left max-w-sm mx-auto">
                      <li className="flex items-center">
                        <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
                        <span>Sản phẩm chính hãng 100%</span>
                      </li>
                      <li className="flex items-center">
                        <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
                        <span>Đa dạng phương thức thanh toán</span>
                      </li>
                      <li className="flex items-center">
                        <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
                        <span>Giao hàng nhanh chóng</span>
                      </li>
                      <li className="flex items-center">
                        <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
                        <span>Đổi trả trong vòng 30 ngày</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
