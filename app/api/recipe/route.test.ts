import { describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/recipe/route";

vi.mock("@/lib/ai/client", () => ({
  generateRecipe: vi.fn(async () => ({
    title: "Quick Garlic Pasta",
    servings: 2,
    totalTimeMinutes: 20,
    caloriesPerServing: 520,
    proteinGramsPerServing: 22,
    ingredients: ["pasta", "garlic", "olive oil", "salt"],
    steps: ["Boil pasta", "Saute garlic", "Toss together"]
  }))
}));

describe("POST /api/recipe", () => {
  it("returns 200 on valid payload", async () => {
    const request = new Request("http://localhost/api/recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cookTimeMinutes: 20,
        dietPreference: "non_veg",
        proteinTargetGrams: 35,
        additionalPreferences: "minimal oil and medium spice"
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  it("returns 400 on invalid payload", async () => {
    const request = new Request("http://localhost/api/recipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cookTimeMinutes: 0,
        dietPreference: "both"
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
