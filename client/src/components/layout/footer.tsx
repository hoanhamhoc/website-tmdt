import { Link } from "wouter";
import { Volleyball, MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Volleyball className="text-white h-6 w-6 mr-2" />
              <span className="font-heading font-bold text-xl">FOOTBALL SHOP</span>
            </div>
            <p className="text-white/80 mb-4">
              Chuyên cung cấp các sản phẩm bóng đá chính hãng với chất lượng tốt nhất, giá cả hợp lý.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="text-white hover:text-accent w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                className="text-white hover:text-accent w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-white hover:text-accent w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                aria-label="Youtube"
              >
                <FaYoutube />
              </a>
              <a
                href="#"
                className="text-white hover:text-accent w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                aria-label="TikTok"
              >
                <FaTiktok />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-white/80 hover:text-white transition-colors">Trang chủ</a>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <a className="text-white/80 hover:text-white transition-colors">Sản phẩm</a>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <a className="text-white/80 hover:text-white transition-colors">Tin tức</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-white/80 hover:text-white transition-colors">Về chúng tôi</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-white/80 hover:text-white transition-colors">Liên hệ</a>
                </Link>
              </li>
              <li>
                <Link href="/policies">
                  <a className="text-white/80 hover:text-white transition-colors">Chính sách</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Danh mục sản phẩm</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=ao-bong-da">
                  <a className="text-white/80 hover:text-white transition-colors">Áo bóng đá</a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=giay-bong-da">
                  <a className="text-white/80 hover:text-white transition-colors">Giày bóng đá</a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=bong">
                  <a className="text-white/80 hover:text-white transition-colors">Bóng</a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=gang-tay-thu-mon">
                  <a className="text-white/80 hover:text-white transition-colors">Găng tay thủ môn</a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=phu-kien-bao-ve">
                  <a className="text-white/80 hover:text-white transition-colors">Phụ kiện bảo vệ</a>
                </Link>
              </li>
              <li>
                <Link href="/products?category=tui-balo">
                  <a className="text-white/80 hover:text-white transition-colors">Túi & Balo</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Thông tin liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="text-accent h-5 w-5 mr-2 mt-1 flex-shrink-0" />
                <span className="text-white/80">123 Nguyễn Văn A, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-accent h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-white/80">+84 912 345 678</span>
              </li>
              <li className="flex items-center">
                <Mail className="text-accent h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-white/80">info@footballshop.vn</span>
              </li>
              <li className="flex items-center">
                <Clock className="text-accent h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-white/80">8:00 - 20:00, Thứ 2 - Chủ nhật</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/80 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Football Shop. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white rounded px-2 py-1">
              <img
                src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/visa.svg"
                alt="Visa"
                className="h-6 object-contain"
              />
            </div>
            <div className="bg-white rounded px-2 py-1">
              <img
                src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/mastercard.svg"
                alt="Mastercard"
                className="h-6 object-contain"
              />
            </div>
            <div className="bg-white rounded px-2 py-1">
              <img
                src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/jcb.svg"
                alt="JCB"
                className="h-6 object-contain"
              />
            </div>
            <div className="bg-white rounded px-2 py-1">
              <img
                src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/momo.svg"
                alt="MoMo"
                className="h-6 object-contain"
              />
            </div>
            <div className="bg-white rounded px-2 py-1">
              <img
                src="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/zalopay.svg"
                alt="ZaloPay"
                className="h-6 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
