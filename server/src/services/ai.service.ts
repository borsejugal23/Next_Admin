import { InferenceClient } from "@huggingface/inference";
import { ProductQuery } from "../types/product-query.types";

const hf = process.env.HF_TOKEN
  ? new InferenceClient(process.env.HF_TOKEN)
  : null;

// Works on HF free-tier router; override via HF_MODEL in .env
const HF_MODEL =
  process.env.HF_MODEL ?? "meta-llama/Llama-3.1-8B-Instruct";

const QUERY_SYSTEM_PROMPT = `You convert natural-language product questions into a JSON query object for a MongoDB product catalog.

Return ONLY valid JSON matching this schema:
{
  "operation": "search" | "count",
  "includeProducts": boolean,
  "search": string (optional, free-text keywords),
  "filters": {
    "category": string (optional),
    "brand": string (optional),
    "price": { "min": number, "max": number },
    "rating": { "min": number, "max": number },
    "stock": { "min": number, "max": number },
    "discountPercentage": { "min": number, "max": number },
    "availabilityStatus": string (optional)
  },
  "sort": { "field": "price" | "rating" | "title" | "stock" | "discountPercentage", "order": "asc" | "desc" },
  "limit": number (default 5 for search, omit for count)
}

Rules:
- Use "count" when the user asks how many products exist.
- Use "search" for listing or recommending products.
- Set includeProducts to true only when the user wants to see product details.
- Keep limit at 5 unless the user asks for more.
- Categories use kebab-case (e.g. "mens-shoes", "skin-care", "smartphones").
- Do not invent fields outside the schema.
- Output raw JSON only, no markdown or explanation.`;

const ANSWER_SYSTEM_PROMPT = `You are a helpful e-commerce product assistant.

Answer using ONLY the backend data provided. Do not invent products, prices, or ratings.
Keep answers concise (2-4 sentences for counts, short bullet list for products).
If no products were found, suggest broadening the search.`;

function extractJson(content: string): ProductQuery {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = fenced ? fenced[1].trim() : trimmed;
  const objectMatch = jsonText.match(/\{[\s\S]*\}/);

  if (!objectMatch) {
    throw new Error("AI response did not contain JSON");
  }

  return JSON.parse(objectMatch[0]) as ProductQuery;
}

function getResponseContent(response: {
  choices: Array<{ message?: { content?: string | null } }>;
}): string {
  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Empty AI response");
  }

  return content;
}

export function isAIEnabled(): boolean {
  return Boolean(hf);
}

export async function parseQueryWithAI(message: string): Promise<ProductQuery> {
  if (!hf) {
    throw new Error("Hugging Face is not configured (HF_TOKEN missing)");
  }

  const response = await hf.chatCompletion({
    model: HF_MODEL,
    messages: [
      { role: "system", content: QUERY_SYSTEM_PROMPT },
      { role: "user", content: message },
    ],
    max_tokens: 400,
    temperature: 0,
  });

  return extractJson(getResponseContent(response));
}

export async function generateProductAnswer(
  message: string,
  result: unknown,
): Promise<string> {
  if (!hf) {
    throw new Error("Hugging Face is not configured (HF_TOKEN missing)");
  }

  const response = await hf.chatCompletion({
    model: HF_MODEL,
    messages: [
      { role: "system", content: ANSWER_SYSTEM_PROMPT },
      {
        role: "user",
        content: `User question:\n${message}\n\nBackend result:\n${JSON.stringify(result)}`,
      },
    ],
    max_tokens: 300,
    temperature: 0.3,
  });

  return getResponseContent(response);
}
