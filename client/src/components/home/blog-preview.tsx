import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { BlogPost } from "@shared/schema";
import { Calendar, User, ArrowRight } from "lucide-react";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const BlogPreview = () => {
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts?limit=3"],
  });

  return (
    <section className="py-12 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-heading font-bold">Tin tức bóng đá</h2>
          <Link href="/blog">
            <a className="text-primary font-heading font-semibold hover:underline">Xem tất cả</a>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-48 bg-neutral-200 animate-pulse" />
                <div className="p-4">
                  <div className="h-4 bg-neutral-200 animate-pulse mb-2 w-1/2" />
                  <div className="h-6 bg-neutral-200 animate-pulse mb-2" />
                  <div className="h-4 bg-neutral-200 animate-pulse mb-2" />
                  <div className="h-4 bg-neutral-200 animate-pulse mb-2" />
                  <div className="h-4 bg-neutral-200 animate-pulse w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
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
        )}
      </div>
    </section>
  );
};

export default BlogPreview;
