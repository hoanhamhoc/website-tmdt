import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const newsletterSchema = z.object({
  email: z.string().email("Vui lòng nhập một email hợp lệ")
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

const Newsletter = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema)
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    setIsSubmitting(true);
    try {
      // In a real app, we would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Đăng ký thành công!",
        description: "Cảm ơn bạn đã đăng ký nhận thông tin từ Football Shop",
      });
      reset();
    } catch (error) {
      toast({
        title: "Đăng ký thất bại",
        description: "Có lỗi xảy ra, vui lòng thử lại sau",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Đăng ký nhận thông tin</h2>
          <p className="text-white/90 mb-6">
            Nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt và những bài viết hữu ích về bóng đá.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Nhập email của bạn"
                className="px-4 py-3 rounded-lg focus:outline-none w-full"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-white text-sm mt-1 text-left">{errors.email.message}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="bg-accent hover:bg-accent/90 text-white font-heading font-semibold px-6 py-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
