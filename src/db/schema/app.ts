// Import relation helper and database column types
import { relations } from 'drizzle-orm';
import { pgTable, timestamp, varchar, integer } from 'drizzle-orm/pg-core';

// Reusable timestamp columns for all tables
const timestamps = {
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

// Departments table - stores academic departments
export const departments = pgTable('departments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(), // Auto-incrementing ID
  code: varchar('code', { length: 50 }).notNull(), // Department code (e.g., "CS")
  name: varchar('name', { length: 255 }).notNull(), // Department name (e.g., "Computer Science")
  description: varchar('description', { length: 255 }), // Optional department description
  ...timestamps, // Add createdAt and updatedAt
});

// Subjects table - stores courses/subjects within departments
export const subjects = pgTable('subjects', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(), // Auto-incrementing ID
  departmentId: integer('department_id')
    .notNull()
    .references(() => departments.id, { onDelete: 'restrict' }), // Link to department (prevent deletion if subjects exist)
  name: varchar('name', { length: 255 }).notNull(), // Subject name (e.g., "Database Design")
  code: varchar('code', { length: 50 }).notNull().unique(), // Subject code (e.g., "CS201") - must be unique
  description: varchar('description', { length: 255 }), // Optional subject description
  ...timestamps, // Add createdAt and updatedAt
});

// One-to-many relation: One department has many subjects
export const departmentRelations = relations(departments, ({ many }) => ({
  subjects: many(subjects),
}));

// Inverse relation: One subject belongs to one department
export const subjectsRelation = relations(subjects, ({ one }) => ({
  department: one(departments, {
    fields: [subjects.departmentId],
    references: [departments.id],
  }),
}));

// Type definitions for TypeScript - infer types from table schema
export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;

export type Subject = typeof subjects.$inferSelect;
export type NewSubject = typeof subjects.$inferInsert;

// After you are done writing this, run npm run db:generate, then run npm run db:migrate to create the tables in the database.
