import { pgTable, text, serial, integer, boolean, timestamp, unique, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User profiles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  interests: text("interests").array(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// User connections/matches (for the social matching feature)
export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  targetUserId: integer("target_user_id").notNull().references(() => users.id),
  status: text("status").notNull(), // "liked", "matched", "rejected"
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    uniqUserTarget: unique().on(table.userId, table.targetUserId),
  };
});

export const insertConnectionSchema = createInsertSchema(connections).omit({
  id: true,
  createdAt: true,
});

// Forum categories
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
});

export const insertForumCategorySchema = createInsertSchema(forumCategories).omit({
  id: true,
});

// Forum posts
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  categoryId: integer("category_id").notNull().references(() => forumCategories.id),
  upvotes: integer("upvotes").default(0).notNull(),
  downvotes: integer("downvotes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  upvotes: true,
  downvotes: true,
  createdAt: true,
});

// Forum comments
export const forumComments = pgTable("forum_comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  postId: integer("post_id").notNull().references(() => forumPosts.id),
  upvotes: integer("upvotes").default(0).notNull(),
  downvotes: integer("downvotes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertForumCommentSchema = createInsertSchema(forumComments).omit({
  id: true,
  upvotes: true,
  downvotes: true,
  createdAt: true,
});

// Courses
export const courseCategories = pgTable("course_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const insertCourseCategorySchema = createInsertSchema(courseCategories).omit({
  id: true,
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").notNull().references(() => courseCategories.id),
  duration: text("duration").notNull(),
  price: integer("price").notNull(), // in cents
  rating: doublePrecision("rating").default(0),
  ratingCount: integer("rating_count").default(0),
  image: text("image").notNull(),
  featured: boolean("featured").default(false),
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  rating: true,
  ratingCount: true,
});

// Healthcare professionals
export const professionalSpecialties = pgTable("professional_specialties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const insertProfessionalSpecialtySchema = createInsertSchema(professionalSpecialties).omit({
  id: true,
});

export const professionals = pgTable("professionals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialtyId: integer("specialty_id").notNull().references(() => professionalSpecialties.id),
  bio: text("bio").notNull(),
  address: text("address").notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  rating: doublePrecision("rating").default(0),
  ratingCount: integer("rating_count").default(0),
  avatar: text("avatar").notNull(),
  experience: text("experience").notNull(),
  languages: text("languages").array().notNull(),
  specializations: text("specializations").array().notNull(),
});

export const insertProfessionalSchema = createInsertSchema(professionals).omit({
  id: true,
  rating: true,
  ratingCount: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Connection = typeof connections.$inferSelect;
export type InsertConnection = z.infer<typeof insertConnectionSchema>;

export type ForumCategory = typeof forumCategories.$inferSelect;
export type InsertForumCategory = z.infer<typeof insertForumCategorySchema>;

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;

export type ForumComment = typeof forumComments.$inferSelect;
export type InsertForumComment = z.infer<typeof insertForumCommentSchema>;

export type CourseCategory = typeof courseCategories.$inferSelect;
export type InsertCourseCategory = z.infer<typeof insertCourseCategorySchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type ProfessionalSpecialty = typeof professionalSpecialties.$inferSelect;
export type InsertProfessionalSpecialty = z.infer<typeof insertProfessionalSpecialtySchema>;

export type Professional = typeof professionals.$inferSelect;
export type InsertProfessional = z.infer<typeof insertProfessionalSchema>;

// Clinical condition categories
export const clinicalCategories = pgTable("clinical_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
});

export const insertClinicalCategorySchema = createInsertSchema(clinicalCategories).omit({
  id: true,
});

// Clinical conditions with images
export const clinicalConditions = pgTable("clinical_conditions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  symptoms: text("symptoms").notNull(),
  categoryId: integer("category_id").notNull().references(() => clinicalCategories.id),
  image: text("image").notNull(),
  treatmentInfo: text("treatment_info"),
  severity: text("severity").notNull(), // "low", "medium", "high"
  commonness: text("commonness").notNull(), // "rare", "occasional", "common"
});

export const insertClinicalConditionSchema = createInsertSchema(clinicalConditions).omit({
  id: true,
});

export type ClinicalCategory = typeof clinicalCategories.$inferSelect;
export type InsertClinicalCategory = z.infer<typeof insertClinicalCategorySchema>;

export type ClinicalCondition = typeof clinicalConditions.$inferSelect;
export type InsertClinicalCondition = z.infer<typeof insertClinicalConditionSchema>;
