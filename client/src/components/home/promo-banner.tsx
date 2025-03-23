import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const PromoBanner = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-primary rounded-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
                Giảm giá lên đến 30% cho đơn hàng đầu tiên
              </h2>
              <p className="text-white/90 mb-6 md:text-lg">
                Sử dụng mã <span className="font-bold bg-white/20 px-2 py-1 rounded">WELCOME30</span> khi thanh toán để nhận ưu đãi đặc biệt cho đơn hàng đầu tiên của bạn.
              </p>
              <div>
                <Link href="/products">
                  <Button className="bg-accent hover:bg-accent/90 text-white font-heading font-semibold px-6 py-3">
                    Mua ngay
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative h-64 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=80"
                alt="Promotion banner"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
