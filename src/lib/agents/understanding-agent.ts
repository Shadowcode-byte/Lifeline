import { generateStructuredJSON } from "@/lib/ai/gemini";
import type { SituationAnalysis } from "@/types/lifeline";

export async function runUnderstandingAgent(
  problem: string
): Promise<SituationAnalysis> {
  const prompt = `
You are the Understanding Agent inside LifeLine,
an Alexa+ agentic situation-resolution system.

Your responsibility is to understand the user's situation before
any planning or action occurs.

USER SITUATION:
"${problem}"

Analyze the situation carefully.

Identify:

1. The user's real intent.
2. How urgent the situation is.
3. Important constraints that may affect resolution.
4. The desired outcome.

Return ONLY valid JSON using exactly this structure:

{
  "intent": "clear description of what the user needs",
  "urgency": "low | medium | high | critical",
  "constraints": [
    "constraint 1",
    "constraint 2"
  ],
  "goal": "clear desired outcome"
}

RULES:

- Do not invent specific facts the user did not provide.
- You may identify reasonable constraints implied by the situation.
- Keep the intent concise but meaningful.
- Use "critical" only when immediate action is genuinely required.
- Constraints must be practical and relevant.
- The goal should describe the outcome, not the individual steps.
- Return valid JSON only.
- Do not use markdown.
- Do not use code fences.
- Do not include commentary outside the JSON object.
`;

  return generateStructuredJSON<SituationAnalysis>(prompt);
}