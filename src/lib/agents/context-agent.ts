import { generateStructuredJSON } from "@/lib/ai/gemini";
import type {
  SituationAnalysis,
  SituationContext,
} from "@/types/lifeline";

export async function runContextAgent(
  problem: string,
  analysis: SituationAnalysis
): Promise<SituationContext> {
  const prompt = `
You are the Context Agent inside LifeLine,
an Alexa+ agentic situation-resolution system.

The Understanding Agent has already analyzed the user's situation.

ORIGINAL USER SITUATION:
"${problem}"

UNDERSTANDING AGENT OUTPUT:
${JSON.stringify(analysis, null, 2)}

Your job is NOT to solve the problem yet.

Your job is to organize the context required for intelligent planning.

Determine:

1. A concise summary of the situation.
2. Reasonable assumptions that can safely guide planning.
3. Important information that is still missing.
4. The most important priorities the resolution should optimize for.

Return ONLY valid JSON using exactly this structure:

{
  "summary": "concise contextual summary",
  "assumptions": [
    "reasonable assumption 1",
    "reasonable assumption 2"
  ],
  "missingInformation": [
    "important missing information 1",
    "important missing information 2"
  ],
  "priorities": [
    "priority 1",
    "priority 2"
  ]
}

RULES:

- Do not invent facts and present them as confirmed.
- Put uncertain but useful inferences under "assumptions".
- Put facts that would materially improve the plan under "missingInformation".
- Priorities should focus on outcomes such as urgency, feasibility, safety, time, or preserving progress.
- Do not create the action plan yet.
- Keep every item concise and useful.
- Avoid unnecessary questions.
- Return valid JSON only.
- Do not use markdown.
- Do not use code fences.
- Do not include commentary outside the JSON object.
`;

  return generateStructuredJSON<SituationContext>(prompt);
}