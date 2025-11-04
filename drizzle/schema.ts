import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * GymAI Pro - Database Schema
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User Profile - Informações de perfil do usuário para personalização de treinos
 */
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  age: int("age"),
  weight: int("weight"), // em kg
  height: int("height"), // em cm
  biotype: mysqlEnum("biotype", ["ectomorfo", "mesomorfo", "endomorfo"]),
  experience: mysqlEnum("experience", ["iniciante", "intermediario", "avancado"]),
  objective: mysqlEnum("objective", ["hipertrofia", "emagrecimento", "resistencia", "funcional"]),
  daysPerWeek: int("daysPerWeek"), // 1, 3, 5
  preferredExerciseType: mysqlEnum("preferredExerciseType", ["funcional", "maquinario", "peso_livre", "cardio", "hiit"]),
  injuries: text("injuries"), // JSON array of injury descriptions
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

/**
 * Exercises - Biblioteca de exercícios
 */
export const exercises = mysqlTable("exercises", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  muscleGroup: varchar("muscleGroup", { length: 100 }).notNull(), // peito, costas, pernas, ombros, braços, etc
  exerciseType: mysqlEnum("exerciseType", ["funcional", "maquinario", "peso_livre", "cardio", "hiit"]).notNull(),
  difficulty: mysqlEnum("difficulty", ["facil", "intermediario", "dificil"]).notNull(),
  instructions: text("instructions"),
  icon: varchar("icon", { length: 255 }), // URL ou nome do ícone
  videoUrl: varchar("videoUrl", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;

/**
 * Workouts - Treinos gerados
 */
export const workouts = mysqlTable("workouts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  workoutType: mysqlEnum("workoutType", ["full_body", "abc", "abcde", "push_pull_legs"]).notNull(),
  durationMinutes: int("durationMinutes"),
  difficulty: mysqlEnum("difficulty", ["facil", "intermediario", "dificil"]).notNull(),
  generatedByAI: boolean("generatedByAI").default(true).notNull(),
  content: text("content"), // JSON com estrutura do treino
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = typeof workouts.$inferInsert;

/**
 * Workout Sessions - Sessões de treino realizadas
 */
export const workoutSessions = mysqlTable("workout_sessions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  workoutId: int("workoutId"),
  date: timestamp("date").defaultNow().notNull(),
  durationMinutes: int("durationMinutes"),
  exercisesCompleted: int("exercisesCompleted"),
  totalExercises: int("totalExercises"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type InsertWorkoutSession = typeof workoutSessions.$inferInsert;

/**
 * Progress Tracking - Rastreamento de progresso
 */
export const progressTracking = mysqlTable("progress_tracking", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  weight: int("weight"), // em kg
  bodyFat: int("bodyFat"), // em percentual
  measurements: text("measurements"), // JSON com medidas (peito, cintura, braço, etc)
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProgressTracking = typeof progressTracking.$inferSelect;
export type InsertProgressTracking = typeof progressTracking.$inferInsert;