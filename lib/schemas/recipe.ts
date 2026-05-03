import { z } from "zod";

export const recipeRequestSchema = z.object({
  ingredients: z.array(z.string().min(1)).default([]),
  cookTimeMinutes: z.number().int().positive().max(240),
  dietPreference: z.enum(["veg", "non_veg", "both"]),
  proteinTargetGrams: z.number().int().positive().max(300).optional(),
  additionalPreferences: z.string().trim().min(1).max(500).optional()
});

export const recipeResponseSchema = z.object({
  title: z.string().min(1),
  servings: z.number().int().positive().max(12),
  totalTimeMinutes: z.number().int().positive().max(240),
  caloriesPerServing: z.number().int().positive().max(3000),
  proteinGramsPerServing: z.number().positive().max(300),
  ingredients: z.array(z.string().min(1)).min(1),
  steps: z.array(z.string().min(1)).min(1),
  tips: z.array(z.string().min(1)).optional(),
  additionalIngredientsOrSpices: z.array(z.string().min(1)).optional()
});

export type RecipeRequest = z.infer<typeof recipeRequestSchema>;
export type RecipeResponse = z.infer<typeof recipeResponseSchema>;
