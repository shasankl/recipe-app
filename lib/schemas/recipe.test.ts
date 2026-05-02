import { describe, expect, it } from "vitest";
import { recipeRequestSchema, recipeResponseSchema } from "@/lib/schemas/recipe";

describe("recipe schemas", () => {
  it("accepts valid request payload", () => {
    const payload = {
      ingredients: ["eggs", "spinach", "salt"],
      cookTimeMinutes: 15,
      dietPreference: "veg" as const,
      proteinTargetGrams: 25,
      additionalPreferences: "low spice and no peanuts"
    };

    expect(recipeRequestSchema.safeParse(payload).success).toBe(true);
  });

  it("rejects invalid request payload", () => {
    const payload = {
      ingredients: [],
      cookTimeMinutes: 0,
      dietPreference: "both" as const
    };

    expect(recipeRequestSchema.safeParse(payload).success).toBe(false);
  });

  it("accepts valid recipe response payload", () => {
    const payload = {
      title: "Spinach Scramble",
      servings: 2,
      totalTimeMinutes: 15,
      ingredients: ["eggs", "spinach", "salt"],
      steps: ["Crack eggs", "Saute spinach", "Combine and cook"],
      tips: ["Serve immediately"],
      additionalIngredientsOrSpices: ["black pepper", "chili flakes"]
    };

    expect(recipeResponseSchema.safeParse(payload).success).toBe(true);
  });
});
