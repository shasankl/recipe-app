import { NextResponse } from "next/server";
import { generateRecipe } from "@/lib/ai/client";
import { recipeRequestSchema } from "@/lib/schemas/recipe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = recipeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input. Provide ingredients and a cook time in minutes." },
        { status: 400 }
      );
    }

    const recipe = await generateRecipe(parsed.data);
    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
