import type { RecipeRequest } from "@/lib/schemas/recipe";

export function buildRecipePrompt(input: RecipeRequest): string {
  const desiredIngredientsInstruction = input.ingredients.length
    ? `Use these desired ingredients if possible:\n${input.ingredients.map((item) => `- ${item}`).join("\n")}`
    : "No desired ingredients were provided. Choose ingredients that fit the user's other preferences.";

  const dietInstruction =
    input.dietPreference === "veg"
      ? "Vegetarian only. Do not include meat, poultry, or fish."
      : input.dietPreference === "non_veg"
        ? "Non-vegetarian is allowed."
        : "Vegetarian and non-vegetarian ingredients are both allowed.";

  const proteinInstruction =
    typeof input.proteinTargetGrams === "number"
      ? `Target approximately ${input.proteinTargetGrams}g total protein for the full recipe.`
      : "No protein target is required.";

  const additionalPreferencesInstruction = input.additionalPreferences
    ? `Additional user preferences: ${input.additionalPreferences}`
    : "No additional preferences.";

  return `
You are a helpful cooking assistant.
Create one recipe.
${desiredIngredientsInstruction}

Constraints:
- Maximum total cooking time: ${input.cookTimeMinutes} minutes
- Diet preference: ${input.dietPreference}
- ${dietInstruction}
- ${proteinInstruction}
- ${additionalPreferencesInstruction}
- Keep steps practical and beginner-friendly
- Prioritize using provided ingredients first
- If any key ingredient or spice is missing, list it in "additionalIngredientsOrSpices"
- Return ONLY valid JSON
- JSON shape:
{
  "title": "string",
  "servings": number,
  "totalTimeMinutes": number,
  "caloriesPerServing": number,
  "proteinGramsPerServing": number,
  "ingredients": ["string"],
  "steps": ["string"],
  "tips": ["string"], // optional
  "additionalIngredientsOrSpices": ["string"] // optional, only if needed
}
`;
}
