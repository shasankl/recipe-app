import { recipeResponseSchema, type RecipeRequest, type RecipeResponse } from "@/lib/schemas/recipe";
import { buildRecipePrompt } from "@/lib/ai/prompts";

const DEFAULT_MODEL = "gpt-4o-mini";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export async function generateRecipe(input: RecipeRequest): Promise<RecipeResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY. Add it to your environment variables.");
  }

  const model = process.env.OPENAI_MODEL ?? DEFAULT_MODEL;
  const prompt = buildRecipePrompt(input);

  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "You return concise, valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.6
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`AI provider request failed: ${res.status} ${errorText}`);
  }

  const payload = await res.json();
  const content = payload?.choices?.[0]?.message?.content;

  if (!content || typeof content !== "string") {
    throw new Error("AI response did not contain recipe content.");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(content);
  } catch {
    throw new Error("AI response was not valid JSON.");
  }

  const validated = recipeResponseSchema.safeParse(parsedJson);
  if (!validated.success) {
    throw new Error("AI response did not match expected recipe schema.");
  }

  return validated.data;
}
