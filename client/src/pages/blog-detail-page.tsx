import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { BlogPost } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, User, ArrowRight, Facebook, Twitter, Linkedin, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const BlogDetailPage = () => {
  const { slug } = useParams();
  
  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: [`/api/blog-posts/${slug}`],
  });

  const { data: relatedPosts = [] } = useQuery<BlogPost[]>({
    queryKey: [`/api/blog-posts/related/${slug}`],
    enabled: !!post,
  });

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Calculate reading time (roughly 200 words per minute)
  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s/g).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-100 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-200 w-3/4 mb-4 rounded"></div>
            <div className="h-4 bg-neutral-200 w-1/3 mb-8 rounded"></div>
            <div className="h-64 bg-neutral-200 mb-8 rounded"></div>
            <div className="space-y-2 mb-8">
              <div className="h-4 bg-neutral-200 rounded"></div>
              <div className="h-4 bg-neutral-200 rounded"></div>
              <div className="h-4 bg-neutral-200 rounded"></div>
              <div className="h-4 bg-neutral-200 rounded"></div>
              <div className="h-4 bg-neutral-200 w-4/5 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="bg-neutral-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-heading font-bold mb-4">Bài viết không tồn tại</h1>
          <p className="mb-6">Bài viết bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.</p>
          <Link href="/blog">
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Quay lại trang tin tức
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="bg-neutral-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 md:p-8">
                <div className="mb-6">
                  <Link href="/blog">
                    <a className="text-primary font-medium flex items-center hover:underline">
                      <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại danh sách bài viết
                    </a>
                  </Link>
                </div>

                <h1 className="text-3xl font-heading font-bold mb-4">{post.title}</h1>

                <div className="flex flex-wrap items-center text-sm text-neutral-800 mb-6">
                  <span className="flex items-center mr-4">
                    <Calendar className="h-4 w-4 mr-1" /> {formatDate(post.createdAt?.toString())}
                  </span>
                  <span className="flex items-center mr-4">
                    <User className="h-4 w-4 mr-1" /> Admin
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> {readingTime} phút đọc
                  </span>
                </div>

                {post.imageUrl && (
                  <div className="mb-6">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}

                <div className="prose prose-lg max-w-none">
                  <p>{post.content}</p>
                  {/* In a real app, this would be rich formatted content */}
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod 
                    eros id sapien efficitur, in gravida nisi vehicula. Morbi at justo quis 
                    leo eleifend fermentum. Donec euismod, nisl id aliquam ultrices, nunc 
                    nunc aliquam nunc, vitae aliquam nunc nunc id nunc.
                  </p>
                  <h2>Cách chọn giày đá bóng phù hợp</h2>
                  <p>
                    Pellentesque habitant morbi tristique senectus et netus et malesuada 
                    fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, 
                    ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam 
                    egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.
                  </p>
                  <ul>
                    <li>Xem xét loại mặt sân: cỏ nhân tạo, cỏ tự nhiên, sân futsal</li>
                    <li>Chọn size phù hợp, thông thường nên chọn nhỏ hơn giày thường 0.5 size</li>
                    <li>Cân nhắc chất liệu: da thật, da tổng hợp, vải</li>
                    <li>Thiết kế đinh giày: FG, AG, TF, IC</li>
                  </ul>
                  <p>
                    Nulla facilisi. Aenean nec eros. Vestibulum ante ipsum primis in 
                    faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse 
                    sollicitudin velit sed leo. Ut pharetra augue nec augue. Nam elit agna, 
                    endrerit sit amet, tincidunt ac, viverra sed, nulla.
                  </p>
                </div>

                {/* Tags */}
                <div className="mt-8">
                  <h3 className="font-heading font-semibold mb-2">Từ khóa:</h3>
                  <div className="flex flex-wrap gap-2">
                    <Link href="/blog?tag=giay-da-bong">
                      <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm hover:bg-primary hover:text-white transition-colors">
                        Giày đá bóng
                      </a>
                    </Link>
                    <Link href="/blog?tag=huong-dan">
                      <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm hover:bg-primary hover:text-white transition-colors">
                        Hướng dẫn
                      </a>
                    </Link>
                    <Link href="/blog?tag=co-nhan-tao">
                      <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm hover:bg-primary hover:text-white transition-colors">
                        Cỏ nhân tạo
                      </a>
                    </Link>
                  </div>
                </div>

                {/* Social Share */}
                <div className="mt-8">
                  <h3 className="font-heading font-semibold mb-2">Chia sẻ bài viết:</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Linkedin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Post Navigation */}
                <Separator className="my-8" />
                <div className="flex flex-col sm:flex-row justify-between">
                  <Link href="/blog/post-1">
                    <a className="group flex items-center mb-4 sm:mb-0">
                      <ChevronLeft className="h-5 w-5 mr-2 text-primary" />
                      <div>
                        <p className="text-sm text-neutral-800">Bài trước</p>
                        <p className="font-medium group-hover:text-primary transition-colors">
                          Top 10 giày đá bóng dưới 1 triệu
                        </p>
                      </div>
                    </a>
                  </Link>
                  <Link href="/blog/post-3">
                    <a className="group flex items-center justify-end">
                      <div className="text-right">
                        <p className="text-sm text-neutral-800">Bài tiếp theo</p>
                        <p className="font-medium group-hover:text-primary transition-colors">
                          Cách bảo quản áo đấu chính hãng
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 ml-2 text-primary" />
                    </a>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Recent Posts */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4">Bài viết gần đây</h3>
                <div className="space-y-4">
                  {relatedPosts.slice(0, 5).map((relatedPost) => (
                    <div key={`recent-${relatedPost.id}`} className="flex items-start">
                      <div className="w-16 h-16 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={relatedPost.imageUrl}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <Link href={`/blog/${relatedPost.slug}`}>
                          <a className="font-medium hover:text-primary transition-colors line-clamp-2">
                            {relatedPost.title}
                          </a>
                        </Link>
                        <p className="text-xs text-neutral-800 mt-1">
                          {formatDate(relatedPost.createdAt?.toString())}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4">Danh mục</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/blog?category=tin-tuc">
                      <a className="text-neutral-800 hover:text-primary transition-colors">
                        Tin tức bóng đá
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog?category=huong-dan">
                      <a className="text-neutral-800 hover:text-primary transition-colors">
                        Hướng dẫn chọn đồ
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog?category=giai-dau">
                      <a className="text-neutral-800 hover:text-primary transition-colors">
                        Giải đấu
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog?category=ky-thuat">
                      <a className="text-neutral-800 hover:text-primary transition-colors">
                        Kỹ thuật bóng đá
                      </a>
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4">Từ khóa phổ biến</h3>
                <div className="flex flex-wrap gap-2">
                  <Link href="/blog?tag=world-cup">
                    <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm hover:bg-primary hover:text-white transition-colors">
                      World Cup
                    </a>
                  </Link>
                  <Link href="/blog?tag=premier-league">
                    <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm hover:bg-primary hover:text-white transition-colors">
                      Premier League
                    </a>
                  </Link>
                  <Link href="/blog?tag=champions-league">
                    <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm hover:bg-primary hover:text-white transition-colors">
                      Champions League
                    </a>
                  </Link>
                  <Link href="/blog?tag=giay-da-bong">
                    <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm hover:bg-primary hover:text-white transition-colors">
                      Giày đá bóng
                    </a>
                  </Link>
                  <Link href="/blog?tag=ao-dau">
                    <a className="px-3 py-1 bg-neutral-100 rounded-full text-sm hover:bg-primary hover:text-white transition-colors">
                      Áo đấu
                    </a>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
