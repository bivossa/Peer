import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertConnectionSchema, 
  insertForumPostSchema,
  insertForumCommentSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });
    
    const user = await storage.getUser(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    return res.json(user);
  });
  
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      return res.status(500).json({ message: "Could not create user" });
    }
  });
  
  app.get("/api/users/:id/nearby", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });
    
    const maxDistance = req.query.distance ? parseInt(req.query.distance as string) : 10;
    const nearbyUsers = await storage.getNearbyUsers(id, maxDistance);
    
    return res.json(nearbyUsers);
  });
  
  // Connection routes
  app.post("/api/connections", async (req: Request, res: Response) => {
    try {
      const connectionData = insertConnectionSchema.parse(req.body);
      
      const existingConnection = await storage.getConnection(
        connectionData.userId, 
        connectionData.targetUserId
      );
      
      if (existingConnection) {
        return res.status(409).json({ message: "Connection already exists" });
      }
      
      const connection = await storage.createConnection(connectionData);
      return res.status(201).json(connection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid connection data", errors: error.errors });
      }
      return res.status(500).json({ message: "Could not create connection" });
    }
  });
  
  app.get("/api/users/:id/matches", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });
    
    const matches = await storage.getUserMatches(id);
    return res.json(matches);
  });
  
  // Forum routes
  app.get("/api/forum/categories", async (_req: Request, res: Response) => {
    const categories = await storage.getForumCategories();
    return res.json(categories);
  });
  
  app.get("/api/forum/posts", async (req: Request, res: Response) => {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    const sortBy = req.query.sortBy as string;
    
    let posts;
    if (sortBy === "popular") {
      posts = await storage.getForumPostsByPopularity();
    } else {
      posts = await storage.getForumPosts(categoryId);
    }
    
    return res.json(posts);
  });
  
  app.get("/api/forum/posts/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid post ID" });
    
    const post = await storage.getForumPostById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    
    return res.json(post);
  });
  
  app.post("/api/forum/posts", async (req: Request, res: Response) => {
    try {
      const postData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost(postData);
      return res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      return res.status(500).json({ message: "Could not create post" });
    }
  });
  
  app.get("/api/forum/posts/:id/comments", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid post ID" });
    
    const comments = await storage.getForumComments(id);
    return res.json(comments);
  });
  
  app.post("/api/forum/posts/:id/comments", async (req: Request, res: Response) => {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ message: "Invalid post ID" });
    
    try {
      const commentData = insertForumCommentSchema.parse({
        ...req.body,
        postId,
      });
      
      const comment = await storage.createForumComment(commentData);
      return res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      return res.status(500).json({ message: "Could not create comment" });
    }
  });
  
  app.post("/api/forum/posts/:id/vote", async (req: Request, res: Response) => {
    const postId = parseInt(req.params.id);
    if (isNaN(postId)) return res.status(400).json({ message: "Invalid post ID" });
    
    const { userId, isUpvote } = req.body;
    if (typeof userId !== "number" || typeof isUpvote !== "boolean") {
      return res.status(400).json({ message: "Invalid vote data" });
    }
    
    try {
      const post = await storage.voteOnPost(postId, userId, isUpvote);
      return res.json(post);
    } catch (error) {
      return res.status(500).json({ message: "Could not vote on post" });
    }
  });
  
  // Course routes
  app.get("/api/courses/categories", async (_req: Request, res: Response) => {
    const categories = await storage.getCourseCategories();
    return res.json(categories);
  });
  
  app.get("/api/courses", async (req: Request, res: Response) => {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    const featured = req.query.featured === "true";
    
    let courses;
    if (featured) {
      courses = await storage.getFeaturedCourses();
    } else {
      courses = await storage.getCourses(categoryId);
    }
    
    return res.json(courses);
  });
  
  app.get("/api/courses/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid course ID" });
    
    const course = await storage.getCourseById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    
    return res.json(course);
  });
  
  // Professional routes
  app.get("/api/professionals/specialties", async (_req: Request, res: Response) => {
    const specialties = await storage.getProfessionalSpecialties();
    return res.json(specialties);
  });
  
  app.get("/api/professionals", async (req: Request, res: Response) => {
    const specialtyId = req.query.specialtyId ? parseInt(req.query.specialtyId as string) : undefined;
    
    let location;
    if (req.query.lat && req.query.lng && req.query.radius) {
      location = {
        lat: parseFloat(req.query.lat as string),
        lng: parseFloat(req.query.lng as string),
        radius: parseFloat(req.query.radius as string),
      };
    }
    
    const professionals = await storage.getProfessionals(specialtyId, location);
    return res.json(professionals);
  });
  
  app.get("/api/professionals/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid professional ID" });
    
    const professional = await storage.getProfessionalById(id);
    if (!professional) return res.status(404).json({ message: "Professional not found" });
    
    return res.json(professional);
  });

  const httpServer = createServer(app);
  return httpServer;
}
