"use client";

import { FormEvent, useState } from "react";
import type { RecipeResponse } from "@/lib/schemas/recipe";

function parseIngredients(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function HomePage() {
  const [ingredientsText, setIngredientsText] = useState("");
  const [cookTimeMinutes, setCookTimeMinutes] = useState("30");
  const [dietPreference, setDietPreference] = useState<"veg" | "non_veg" | "both">("both");
  const [proteinTargetGrams, setProteinTargetGrams] = useState("");
  const [additionalPreferences, setAdditionalPreferences] = useState("");
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setRecipe(null);

    const ingredients = parseIngredients(ingredientsText);
    const cookTime = Number(cookTimeMinutes);
    const proteinTarget = proteinTargetGrams.trim() === "" ? undefined : Number(proteinTargetGrams);
    const extraPreferences = additionalPreferences.trim();

    if (!ingredients.length) {
      setError("Please provide at least one ingredient.");
      return;
    }

    if (!Number.isInteger(cookTime) || cookTime <= 0) {
      setError("Cook time must be a positive whole number of minutes.");
      return;
    }

    if (
      proteinTarget !== undefined &&
      (!Number.isInteger(proteinTarget) || proteinTarget <= 0 || proteinTarget > 300)
    ) {
      setError("Protein target must be blank or a whole number between 1 and 300.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ingredients,
          cookTimeMinutes: cookTime,
          dietPreference,
          proteinTargetGrams: proteinTarget,
          additionalPreferences: extraPreferences === "" ? undefined : extraPreferences
        })
      });

      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload?.error ?? "Failed to generate recipe.");
      }

      setRecipe(payload as RecipeResponse);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unknown request error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Smart meal planning</p>
        <h1>Smart Recipe Generator</h1>
        <p className="hero-text">
          Add ingredients, set your time and preferences, and get a detailed meal plan in seconds.
        </p>
      </section>

      <section className="card form-card">
        <form onSubmit={onSubmit}>
          <label htmlFor="ingredients">Ingredients (comma-separated)</label>
          <textarea
            id="ingredients"
            rows={4}
            placeholder="chicken, garlic, lemon, olive oil, rice"
            value={ingredientsText}
            onChange={(event) => setIngredientsText(event.target.value)}
          />

          <label htmlFor="cook-time">Time to cook (minutes)</label>
          <input
            id="cook-time"
            type="number"
            min={1}
            max={240}
            value={cookTimeMinutes}
            onChange={(event) => setCookTimeMinutes(event.target.value)}
          />

          <div className="form-grid">
            <div>
              <label htmlFor="diet-preference">Diet preference</label>
              <select
                id="diet-preference"
                value={dietPreference}
                onChange={(event) => setDietPreference(event.target.value as "veg" | "non_veg" | "both")}
              >
                <option value="veg">Veg</option>
                <option value="non_veg">Non Veg</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div>
              <label htmlFor="protein-target">Protein target (grams, optional)</label>
              <input
                id="protein-target"
                type="number"
                min={1}
                max={300}
                placeholder="e.g. 35"
                value={proteinTargetGrams}
                onChange={(event) => setProteinTargetGrams(event.target.value)}
              />
            </div>
          </div>

          <label htmlFor="additional-preferences">Additional preferences (optional)</label>
          <textarea
            id="additional-preferences"
            rows={3}
            placeholder="e.g. low spice, no peanuts, Indian style flavors, one-pot meal"
            value={additionalPreferences}
            onChange={(event) => setAdditionalPreferences(event.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate recipe"}
          </button>
          {error ? <p className="error">{error}</p> : null}
        </form>
      </section>

      {recipe ? (
        <section className="card recipe-card">
          <h2 className="recipe-title">{recipe.title}</h2>
          <div className="meta-row">
            <span className="pill">Servings: {recipe.servings}</span>
            <span className="pill">Total time: {recipe.totalTimeMinutes} min</span>
            <span className="pill">Calories: {recipe.caloriesPerServing} kcal/serving</span>
            <span className="pill">Protein: {recipe.proteinGramsPerServing} g/serving</span>
          </div>

          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3>Detailed steps</h3>
          <ol>
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          {recipe.additionalIngredientsOrSpices?.length ? (
            <>
              <h3>Additional ingredients / spices needed</h3>
              <ul>
                {recipe.additionalIngredientsOrSpices.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </>
          ) : null}

          {recipe.tips?.length ? (
            <>
              <h3>Tips</h3>
              <ul>
                {recipe.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
