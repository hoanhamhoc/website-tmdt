import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Slide {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const slides: Slide[] = [
  {
    image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?w=1200&auto=format&fit=crop&q=80",
    title: "Bộ sưu tập áo đấu mới nhất 2023",
    description: "Trải nghiệm phong cách của các đội bóng hàng đầu với bộ sưu tập áo đấu chính hãng mới nhất",
    buttonText: "Khám phá ngay",
    buttonLink: "/products?category=ao-bong-da"
  },
  {
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&auto=format&fit=crop&q=80",
    title: "Giày đá bóng chính hãng",
    description: "Chuẩn xác trong từng đường chuyền, mạnh mẽ trong từng cú sút với giày đá bóng chính hãng",
    buttonText: "Mua ngay",
    buttonLink: "/products?category=giay-bong-da"
  },
  {
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&auto=format&fit=crop&q=80",
    title: "Phụ kiện bóng đá cao cấp",
    description: "Nâng cao hiệu suất thi đấu với các phụ kiện bóng đá chuyên nghiệp, từ găng tay đến băng bảo vệ",
    buttonText: "Xem thêm",
    buttonLink: "/products?category=phu-kien"
  }
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative">
      <div className="relative overflow-hidden h-[300px] md:h-[500px]">
        <div 
          className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-transparent flex items-center">
                <div className="container mx-auto px-4 md:px-8">
                  <div className="max-w-lg">
                    <h1 className="text-white font-heading font-bold text-3xl md:text-5xl mb-4">{slide.title}</h1>
                    <p className="text-white mb-6 md:text-lg">{slide.description}</p>
                    <Link href={slide.buttonLink}>
                      <Button className="bg-accent hover:bg-accent/90 text-white font-heading font-semibold px-6 py-3">
                        {slide.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Slider Controls */}
        <button 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary/80 hover:bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          onClick={goToPrevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/80 hover:bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          onClick={goToNextSlide}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        
        {/* Slider Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button 
              key={index}
              className={`w-3 h-3 rounded-full transition-opacity ${index === currentSlide ? 'bg-white opacity-100' : 'bg-white opacity-50'}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
