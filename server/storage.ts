import { users, User, InsertUser, categories, Category, InsertCategory,
         products, Product, InsertProduct, reviews, Review, InsertReview,
         blogPosts, BlogPost, InsertBlogPost, orders, Order, InsertOrder,
         orderItems, OrderItem, InsertOrderItem } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { z } from "zod";

const MemoryStore = createMemoryStore(session);

export interface ProductFilters {
  categorySlug?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  searchQuery?: string;
  featured?: boolean;
  isNew?: boolean;
  limit?: number;
}

export interface BlogPostFilters {
  category?: string;
  tag?: string;
  limit?: number;
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product methods
  getProducts(filters?: ProductFilters): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  getRelatedProducts(productId: number, categoryId: number): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  updateProductRating(productId: number): Promise<void>;
  
  // Review methods
  getProductReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Blog post methods
  getBlogPosts(filters?: BlogPostFilters): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getRelatedBlogPosts(postId: number): Promise<BlogPost[]>;
  
  // Order methods
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getUserOrders(userId: number): Promise<Order[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;
  
  // Additional methods
  seedDatabase(): Promise<void>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private usersData: Map<number, User>;
  private categoriesData: Map<number, Category>;
  private productsData: Map<number, Product>;
  private reviewsData: Map<number, Review>;
  private blogPostsData: Map<number, BlogPost>;
  private ordersData: Map<number, Order>;
  private orderItemsData: Map<number, OrderItem>;
  
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private productIdCounter: number;
  private reviewIdCounter: number;
  private blogPostIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;

  constructor() {
    this.usersData = new Map();
    this.categoriesData = new Map();
    this.productsData = new Map();
    this.reviewsData = new Map();
    this.blogPostsData = new Map();
    this.ordersData = new Map();
    this.orderItemsData = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.productIdCounter = 1;
    this.reviewIdCounter = 1;
    this.blogPostIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersData.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersData.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id, role: "customer" };
    this.usersData.set(id, user);
    return user;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categoriesData.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categoriesData.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categoriesData.values()).find(
      (category) => category.slug === slug,
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categoriesData.set(id, category);
    return category;
  }

  // Product methods
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    let products = Array.from(this.productsData.values());
    
    if (filters) {
      if (filters.categorySlug) {
        const category = await this.getCategoryBySlug(filters.categorySlug);
        if (category) {
          products = products.filter(product => product.categoryId === category.id);
        }
      }
      
      if (filters.brands && filters.brands.length > 0) {
        products = products.filter(product => 
          product.brand && filters.brands!.includes(product.brand)
        );
      }
      
      if (filters.minPrice !== undefined) {
        products = products.filter(product => 
          Number(product.discountPrice || product.price) >= filters.minPrice!
        );
      }
      
      if (filters.maxPrice !== undefined) {
        products = products.filter(product => 
          Number(product.discountPrice || product.price) <= filters.maxPrice!
        );
      }
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        products = products.filter(product => 
          product.name.toLowerCase().includes(query) || 
          (product.description && product.description.toLowerCase().includes(query))
        );
      }
      
      if (filters.featured) {
        products = products.filter(product => product.featured);
      }
      
      if (filters.isNew) {
        products = products.filter(product => product.isNew);
      }
      
      // Sort products
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price-asc':
            products.sort((a, b) => 
              Number(a.discountPrice || a.price) - Number(b.discountPrice || b.price)
            );
            break;
          case 'price-desc':
            products.sort((a, b) => 
              Number(b.discountPrice || b.price) - Number(a.discountPrice || a.price)
            );
            break;
          case 'rating':
            products.sort((a, b) => 
              Number(b.averageRating) - Number(a.averageRating)
            );
            break;
          case 'newest':
          default:
            // Sort by createdAt (newest first)
            products.sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            break;
        }
      }
      
      // Apply limit if specified
      if (filters.limit) {
        products = products.slice(0, filters.limit);
      }
    }
    
    return products;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.productsData.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.productsData.values()).find(
      (product) => product.slug === slug,
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const createdAt = new Date();
    const product: Product = { 
      ...insertProduct, 
      id, 
      createdAt,
      averageRating: 0,
      reviewCount: 0
    };
    this.productsData.set(id, product);
    return product;
  }

  async getRelatedProducts(productId: number, categoryId: number): Promise<Product[]> {
    return Array.from(this.productsData.values())
      .filter(product => product.id !== productId && product.categoryId === categoryId)
      .slice(0, 4); // Limit to 4 related products
  }

  async searchProducts(query: string): Promise<Product[]> {
    const searchQuery = query.toLowerCase();
    return Array.from(this.productsData.values())
      .filter(product => 
        product.name.toLowerCase().includes(searchQuery) || 
        (product.description && product.description.toLowerCase().includes(searchQuery))
      )
      .slice(0, 10); // Limit to 10 search results
  }

  async updateProductRating(productId: number): Promise<void> {
    const product = await this.getProduct(productId);
    if (!product) return;
    
    const reviews = await this.getProductReviews(productId);
    
    if (reviews.length === 0) {
      product.averageRating = 0;
      product.reviewCount = 0;
    } else {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      product.averageRating = parseFloat((totalRating / reviews.length).toFixed(1));
      product.reviewCount = reviews.length;
    }
    
    this.productsData.set(productId, product);
  }

  // Review methods
  async getProductReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviewsData.values())
      .filter(review => review.productId === productId);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const createdAt = new Date();
    const review: Review = { ...insertReview, id, createdAt };
    this.reviewsData.set(id, review);
    return review;
  }

  // Blog post methods
  async getBlogPosts(filters?: BlogPostFilters): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPostsData.values());
    
    // Apply filters if specified
    if (filters) {
      // Apply category filter
      if (filters.category) {
        // This is a simplification - in a real app you'd have a category field
        posts = posts.filter(post => 
          post.content.toLowerCase().includes(filters.category!.toLowerCase())
        );
      }
      
      // Apply tag filter
      if (filters.tag) {
        // This is a simplification - in a real app you'd have a tags field
        posts = posts.filter(post => 
          post.content.toLowerCase().includes(filters.tag!.toLowerCase())
        );
      }
      
      // Apply limit
      if (filters.limit) {
        posts = posts.slice(0, filters.limit);
      }
    }
    
    // Sort by createdAt (newest first)
    return posts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPostsData.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPostsData.values()).find(
      (post) => post.slug === slug,
    );
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostIdCounter++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const post: BlogPost = { ...insertPost, id, createdAt, updatedAt };
    this.blogPostsData.set(id, post);
    return post;
  }

  async getRelatedBlogPosts(postId: number): Promise<BlogPost[]> {
    // In a real app, you'd match by tags or categories
    // For simplicity, just return other posts
    return Array.from(this.blogPostsData.values())
      .filter(post => post.id !== postId)
      .slice(0, 5); // Limit to 5 related posts
  }

  // Order methods
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const order: Order = { ...insertOrder, id, createdAt, updatedAt };
    this.ordersData.set(id, order);
    return order;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.ordersData.get(id);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    const orders = Array.from(this.ordersData.values())
      .filter(order => order.userId === userId);
    
    // For each order, attach its items
    const result = [];
    
    for (const order of orders) {
      const items = Array.from(this.orderItemsData.values())
        .filter(item => item.orderId === order.id);
      
      // For each item, attach its product info
      const itemsWithProducts = [];
      
      for (const item of items) {
        const product = await this.getProduct(item.productId);
        
        itemsWithProducts.push({
          ...item,
          product: product ? {
            name: product.name,
            imageUrl: product.imageUrl
          } : undefined
        });
      }
      
      result.push({
        ...order,
        items: itemsWithProducts
      });
    }
    
    // Sort by createdAt (newest first)
    return result.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createOrderItem(insertItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const item: OrderItem = { ...insertItem, id };
    this.orderItemsData.set(id, item);
    return item;
  }

  // Additional methods
  async seedDatabase(): Promise<void> {
    // Create categories
    const categoriesData: InsertCategory[] = [
      {
        name: "Áo bóng đá",
        slug: "ao-bong-da",
        description: "Áo đấu chính hãng",
        imageUrl: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Giày bóng đá",
        slug: "giay-bong-da",
        description: "Giày đá bóng chuyên dụng",
        imageUrl: "https://images.unsplash.com/photo-1511886929837-354d1a99fc32?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Bóng",
        slug: "bong",
        description: "Bóng thi đấu & tập luyện",
        imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=60"
      },
      {
        name: "Phụ kiện",
        slug: "phu-kien",
        description: "Găng tay, băng bảo vệ & hơn thế",
        imageUrl: "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=500&auto=format&fit=crop&q=60"
      }
    ];
    
    const categories: Category[] = [];
    for (const categoryData of categoriesData) {
      categories.push(await this.createCategory(categoryData));
    }
    
    // Create products
    const productsData: InsertProduct[] = [
      {
        name: "Áo Manchester United 2023/24",
        slug: "ao-manchester-united-2023-24",
        description: "Áo đấu sân nhà chính hãng Manchester United mùa giải 2023/24",
        price: "1550000",
        discountPrice: "1250000",
        categoryId: categories[0].id,
        imageUrl: "https://images.unsplash.com/photo-1511746315387-c4a76990fdce?w=500&auto=format&fit=crop&q=60",
        imageUrls: [],
        inStock: true,
        featured: true,
        isNew: false,
        brand: "Adidas",
        variants: {
          size: ["S", "M", "L", "XL"],
          color: ["Đỏ"]
        }
      },
      {
        name: "Nike Mercurial Superfly 9",
        slug: "nike-mercurial-superfly-9",
        description: "Giày đá bóng chuyên nghiệp Nike Mercurial Superfly 9 Elite",
        price: "2500000",
        discountPrice: null,
        categoryId: categories[1].id,
        imageUrl: "https://images.unsplash.com/photo-1575386753795-a2bf6a6f8b87?w=500&auto=format&fit=crop&q=60",
        imageUrls: [],
        inStock: true,
        featured: true,
        isNew: false,
        brand: "Nike",
        variants: {
          size: ["39", "40", "41", "42", "43", "44"],
          color: ["Xanh", "Đen"]
        }
      },
      {
        name: "Adidas Al Rihla Pro",
        slug: "adidas-al-rihla-pro",
        description: "Bóng thi đấu chuyên nghiệp Adidas Al Rihla Pro - Trái bóng chính thức World Cup 2022",
        price: "950000",
        discountPrice: null,
        categoryId: categories[2].id,
        imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500&auto=format&fit=crop&q=60",
        imageUrls: [],
        inStock: true,
        featured: true,
        isNew: true,
        brand: "Adidas",
        variants: {
          size: ["5"]
        }
      },
      {
        name: "Reusch Arrow Pro G3",
        slug: "reusch-arrow-pro-g3",
        description: "Găng tay thủ môn chuyên nghiệp Reusch Arrow Pro G3",
        price: "1400000",
        discountPrice: "1190000",
        categoryId: categories[3].id,
        imageUrl: "https://images.unsplash.com/photo-1602919545767-54b776c4c2e5?w=500&auto=format&fit=crop&q=60",
        imageUrls: [],
        inStock: true,
        featured: true,
        isNew: false,
        brand: "Reusch",
        variants: {
          size: ["7", "8", "9", "10"]
        }
      },
      {
        name: "Áo Barcelona 2023/24",
        slug: "ao-barcelona-2023-24",
        description: "Áo đấu sân nhà chính hãng Barcelona mùa giải 2023/24",
        price: "1350000",
        discountPrice: null,
        categoryId: categories[0].id,
        imageUrl: "https://images.unsplash.com/photo-1511886929837-354d1a99fc32?w=500&auto=format&fit=crop&q=60",
        imageUrls: [],
        inStock: true,
        featured: true,
        isNew: false,
        brand: "Nike",
        variants: {
          size: ["S", "M", "L", "XL"],
          color: ["Xanh đỏ"]
        }
      },
      {
        name: "Puma Future Z 1.4",
        slug: "puma-future-z-1-4",
        description: "Giày đá bóng mới nhất 2023 Puma Future Z 1.4 dành cho các cầu thủ chuyên nghiệp",
        price: "2150000",
        discountPrice: null,
        categoryId: categories[1].id,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
        imageUrls: [],
        inStock: true,
        featured: false,
        isNew: true,
        brand: "Puma",
        variants: {
          size: ["39", "40", "41", "42", "43", "44"],
          color: ["Đen", "Trắng"]
        }
      },
      {
        name: "Áo Liverpool 2023/24",
        slug: "ao-liverpool-2023-24",
        description: "Áo đấu sân nhà mùa mới Liverpool 2023/24",
        price: "1290000",
        discountPrice: null,
        categoryId: categories[0].id,
        imageUrl: "https://images.unsplash.com/photo-1565303337137-59748c162f76?w=500&auto=format&fit=crop&q=60",
        imageUrls: [],
        inStock: true,
        featured: false,
        isNew: true,
        brand: "Nike",
        variants: {
          size: ["S", "M", "L", "XL"],
          color: ["Đỏ"]
        }
      },
      {
        name: "Nike Academy Team Backpack",
        slug: "nike-academy-team-backpack",
        description: "Balo thể thao đa năng Nike Academy Team Backpack",
        price: "890000",
        discountPrice: null,
        categoryId: categories[3].id,
        imageUrl: "https://images.unsplash.com/photo-1553588542-24a2586f1be1?w=500&auto=format&fit=crop&q=60",
        imageUrls: [],
        inStock: true,
        featured: false,
        isNew: true,
        brand: "Nike",
        variants: {
          color: ["Đen", "Xanh"]
        }
      }
    ];
    
    for (const productData of productsData) {
      await this.createProduct(productData);
    }
    
    // Create blog posts
    const blogPostsData: InsertBlogPost[] = [
      {
        title: "Top 10 giày đá bóng tốt nhất cho sân cỏ nhân tạo",
        slug: "top-10-giay-da-bong-tot-nhat-cho-san-co-nhan-tao",
        content: "Khám phá những mẫu giày đá bóng được các cầu thủ chuyên nghiệp đánh giá cao nhất cho sân cỏ nhân tạo năm 2023. Từ Nike Mercurial đến Adidas Predator, bài viết sẽ giúp bạn lựa chọn đôi giày phù hợp nhất.",
        imageUrl: "https://images.unsplash.com/photo-1511886929837-354d1a99fc32?w=500&auto=format&fit=crop&q=60",
        userId: 1
      },
      {
        title: "Bí quyết chọn áo đấu phù hợp với thể trạng và phong cách",
        slug: "bi-quyet-chon-ao-dau-phu-hop-voi-the-trang-va-phong-cach",
        content: "Hướng dẫn chi tiết cách chọn size áo đấu, chất liệu và kiểu dáng phù hợp với từng loại hình thể và phong cách chơi bóng. Bạn sẽ biết cách chọn áo đấu vừa đẹp vừa thoải mái khi thi đấu.",
        imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500&auto=format&fit=crop&q=60",
        userId: 1
      },
      {
        title: "Cách bảo quản và vệ sinh giày đá bóng kéo dài tuổi thọ",
        slug: "cach-bao-quan-va-ve-sinh-giay-da-bong-keo-dai-tuoi-tho",
        content: "Những mẹo đơn giản nhưng hiệu quả giúp bảo quản giày đá bóng luôn như mới và kéo dài tuổi thọ trong điều kiện sử dụng thường xuyên. Từ cách vệ sinh đến cách bảo quản đúng cách.",
        imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=500&auto=format&fit=crop&q=60",
        userId: 1
      }
    ];
    
    for (const blogPostData of blogPostsData) {
      await this.createBlogPost(blogPostData);
    }
    
    // Create admin user
    await this.createUser({
      username: "admin",
      password: "$2b$10$XpC5o8pRbG9i4liJAEWSBeSXnUE/Q/8CVRHIC5ZZyA9XQA4g2Yp3m.5e85e5d24e7e1e3c9a96c9b69813c83", // password: admin123
      email: "admin@footballshop.com",
      fullName: "Admin User",
      phone: "0123456789",
      address: "123 Admin Street"
    });
    
    // Add some reviews
    const reviewsData: InsertReview[] = [
      {
        productId: 1, // Manchester United shirt
        userId: 1,
        rating: 5,
        comment: "Chất liệu áo rất tốt, form áo chuẩn. Rất hài lòng với sản phẩm!"
      },
      {
        productId: 2, // Nike Mercurial
        userId: 1,
        rating: 4,
        comment: "Giày rất nhẹ và ôm chân, cảm giác bóng tốt. Tuy nhiên hơi đắt một chút."
      },
      {
        productId: 3, // Adidas ball
        userId: 1,
        rating: 5,
        comment: "Bóng chính hãng, rất đáng đồng tiền bỏ ra. Đường may chắc chắn."
      }
    ];
    
    for (const reviewData of reviewsData) {
      await this.createReview(reviewData);
      await this.updateProductRating(reviewData.productId);
    }
  }
}

export const storage = new MemStorage();
