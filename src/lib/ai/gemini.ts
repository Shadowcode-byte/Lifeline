import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not configured.");
}

const ai = new GoogleGenAI({
  apiKey,
});

const MODELS = [
  "gemini-3.8-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash-lite",
] as const;

const REQUEST_TIMEOUT_MS = 12000;

function cleanJSON(text: string) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/\s*```$/, "")
    .trim();
}

function isFallbackEligible(error: unknown) {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase();

  return (
    message.includes("503") ||
    message.includes("unavailable") ||
    message.includes("high demand") ||
    message.includes("timeout") ||
    message.includes("timed out") ||
    message.includes("429") ||
    message.includes("resource_exhausted")
  );
}

async function generateWithTimeout(
  model: string,
  prompt: string
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const request = ai.models.generateContent({
    model,
    contents: prompt,
  });

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(
        new Error(
          `Model ${model} timed out after ${REQUEST_TIMEOUT_MS}ms`
        )
      );
    }, REQUEST_TIMEOUT_MS);
  });

  try {
    return await Promise.race([request, timeout]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

export async function generateStructuredJSON<T>(
  prompt: string
): Promise<T> {
  let lastError: unknown;

  for (const model of MODELS) {
    try {
      const response = await generateWithTimeout(
        model,
        prompt
      );

      const text = response.text?.trim();

      if (!text) {
        throw new Error(
          `${model} returned an empty response.`
        );
      }

      const cleaned = cleanJSON(text);

      return JSON.parse(cleaned) as T;
    } catch (error) {
      lastError = error;

      console.warn(
        `[LifeLine AI] ${model} failed. Trying fallback if available.`
      );

      if (!isFallbackEligible(error)) {
        throw error;
      }
    }
  }

  throw (
    lastError ??
    new Error("All LifeLine AI models failed.")
  );
}