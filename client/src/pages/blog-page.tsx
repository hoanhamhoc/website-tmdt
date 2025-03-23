import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { BlogPost } from "@shared/schema";
import { Calendar, User, ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
  });

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would filter posts or make a search request
    console.log("Search for:", searchQuery);
  };

  // Get featured posts (first 3)
  const featuredPosts = posts.slice(0, 3);
  
  // Get remaining posts
  const regularPosts = posts.slice(3);

  return (
    <div className="bg-neutral-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold mb-8">Tin tức bóng đá</h1>

        {/* Featured Posts */}
        {!isLoading && featuredPosts.length > 0 && (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center text-sm text-neutral-800 mb-2">
                      <span className="flex items-center mr-4">
                        <Calendar className="h-4 w-4 mr-1" /> {formatDate(post.createdAt.toString())}
                      </span>
                      <span className="flex items-center">
                        <User className="h-4 w-4 mr-1" /> Admin
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-lg mb-2">{post.title}</h3>
                    <p className="text-neutral-800 text-sm mb-4">
                      {post.content.substring(0, 100)}...
                    </p>
                    <Link href={`/blog/${post.slug}`}>
                      <a className="text-primary font-semibold hover:underline flex items-center">
                        Đọc thêm <ArrowRight className="ml-1 h-4 w-4" />
                      </a>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Blog Posts */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(4)].map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-0">
                      <div className="h-48 bg-neutral-200 animate-pulse" />
                      <div className="p-4">
                        <div className="h-4 bg-neutral-200 animate-pulse mb-2 w-1/2" />
                        <div className="h-6 bg-neutral-200 animate-pulse mb-2" />
                        <div className="h-4 bg-neutral-200 animate-pulse mb-2" />
                        <div className="h-4 bg-neutral-200 animate-pulse mb-2" />
                        <div className="h-4 bg-neutral-200 animate-pulse w-1/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : regularPosts.length > 0 ? (
              <div className="space-y-6">
                {regularPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="md:flex">
                        <div className="md:w-1/3 h-48 md:h-auto">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6 md:w-2/3">
                          <div className="flex items-center text-sm text-neutral-800 mb-2">
                            <span className="flex items-center mr-4">
                              <Calendar className="h-4 w-4 mr-1" /> {formatDate(post.createdAt.toString())}
                            </span>
                            <span className="flex items-center">
                              <User className="h-4 w-4 mr-1" /> Admin
                            </span>
                          </div>
                          <h3 className="font-heading font-semibold text-xl mb-2">{post.title}</h3>
                          <p className="text-neutral-800 mb-4">
                            {post.content.substring(0, 150)}...
                          </p>
                          <Link href={`/blog/${post.slug}`}>
                            <a className="text-primary font-semibold hover:underline flex items-center">
                              Đọc thêm <ArrowRight className="ml-1 h-4 w-4" />
                            </a>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Pagination */}
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-1">
                    <Button variant="outline" className="w-10 h-10 p-0">
                      &lt;
                    </Button>
                    <Button variant="outline" className="w-10 h-10 p-0 bg-primary text-white">
                      1
                    </Button>
                    <Button variant="outline" className="w-10 h-10 p-0">
                      2
                    </Button>
                    <Button variant="outline" className="w-10 h-10 p-0">
                      3
                    </Button>
                    <Button variant="outline" className="w-10 h-10 p-0">
                      &gt;
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>Không có bài viết nào.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Search */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4">Tìm kiếm</h3>
                <form onSubmit={handleSearch} className="flex">
                  <Input
                    type="text"
                    placeholder="Tìm bài viết..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-r-none"
                  />
                  <Button type="submit" className="rounded-l-none">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
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

            {/* Recent Posts */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4">Bài viết gần đây</h3>
                <div className="space-y-4">
                  {posts.slice(0, 5).map((post) => (
                    <div key={`recent-${post.id}`} className="flex items-start">
                      <div className="w-16 h-16 bg-neutral-100 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <Link href={`/blog/${post.slug}`}>
                          <a className="font-medium hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </a>
                        </Link>
                        <p className="text-xs text-neutral-800 mt-1">
                          {formatDate(post.createdAt.toString())}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-heading font-semibold mb-4">Từ khóa</h3>
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

export default BlogPage;
