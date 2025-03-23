import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { Product, InsertProduct, Category, InsertCategory, 
         InsertReview, BlogPost, InsertBlogPost, Order, InsertOrder,
         InsertOrderItem } from "@shared/schema";
import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error fetching category" });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      let { category, brand, minPrice, maxPrice, sort, q, featured, isNew, limit } = req.query;
      
      const products = await storage.getProducts({
        categorySlug: category as string | undefined,
        brands: brand ? (Array.isArray(brand) ? brand as string[] : [brand as string]) : undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy: sort as string | undefined,
        searchQuery: q as string | undefined,
        featured: featured === 'true',
        isNew: isNew === 'true',
        limit: limit ? Number(limit) : undefined
      });
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  app.get("/api/products/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  });

  app.get("/api/products/related/:slug", async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const relatedProducts = await storage.getRelatedProducts(product.id, product.categoryId);
      res.json(relatedProducts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching related products" });
    }
  });

  app.get("/api/products/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.json([]);
      }
      
      const products = await storage.searchProducts(q as string);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error searching products" });
    }
  });

  // Reviews routes
  app.get("/api/products/:id/reviews", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews" });
    }
  });

  app.post("/api/products/:id/reviews", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to leave a review" });
    }

    try {
      const productId = parseInt(req.params.id);
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const reviewData: InsertReview = {
        productId,
        userId: req.user.id,
        rating: req.body.rating,
        comment: req.body.comment
      };

      const review = await storage.createReview(reviewData);
      
      // Update product rating
      await storage.updateProductRating(productId);
      
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ message: "Error creating review" });
    }
  });

  // Blog posts routes
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const { category, tag, limit } = req.query;
      
      const posts = await storage.getBlogPosts({
        category: category as string | undefined,
        tag: tag as string | undefined,
        limit: limit ? Number(limit) : undefined
      });
      
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog posts" });
    }
  });

  app.get("/api/blog-posts/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Error fetching blog post" });
    }
  });

  app.get("/api/blog-posts/related/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      const relatedPosts = await storage.getRelatedBlogPosts(post.id);
      res.json(relatedPosts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching related blog posts" });
    }
  });

  // Orders routes
  app.post("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to create an order" });
    }

    try {
      const orderData: InsertOrder = {
        userId: req.user.id,
        status: req.body.status || "pending",
        totalAmount: req.body.totalAmount,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        paymentStatus: req.body.paymentStatus || "pending"
      };

      const order = await storage.createOrder(orderData);
      
      // Create order items
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          const orderItem: InsertOrderItem = {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            variantData: item.variantData || null
          };
          
          await storage.createOrderItem(orderItem);
        }
      }
      
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: "Error creating order" });
    }
  });

  app.get("/api/user/orders", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to view orders" });
    }

    try {
      const orders = await storage.getUserOrders(req.user.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to view an order" });
    }

    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if the order belongs to the user
      if (order.userId !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ message: "You don't have permission to view this order" });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Error fetching order" });
    }
  });

  // For testing purpose - seed the database
  app.post("/api/seed", async (req, res) => {
    try {
      await storage.seedDatabase();
      res.json({ message: "Database seeded successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error seeding database" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
