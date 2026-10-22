import { generateStructuredJSON } from "@/lib/ai/gemini";
import type {
  ResolutionPlan,
  SituationAnalysis,
  SituationContext,
} from "@/types/lifeline";

export async function runPlanningAgent(
  problem: string,
  analysis: SituationAnalysis,
  context: SituationContext
): Promise<ResolutionPlan> {
  const prompt = `
You are the Planning Agent inside LifeLine,
an Alexa+ agentic situation-resolution system.

Two specialized agents have already processed the situation.

ORIGINAL USER SITUATION:
"${problem}"

UNDERSTANDING AGENT OUTPUT:
${JSON.stringify(analysis, null, 2)}

CONTEXT AGENT OUTPUT:
${JSON.stringify(context, null, 2)}

Your responsibility is to create a practical resolution strategy.

Build a plan that:

1. Directly addresses the user's goal.
2. Respects the identified constraints.
3. Follows the priorities identified by the Context Agent.
4. Handles uncertainty without pretending unknown information is confirmed.
5. Prioritizes actions that are realistic and immediately useful.

Return ONLY valid JSON using exactly this structure:

{
  "strategy": "short description of the overall resolution strategy",
  "steps": [
    {
      "id": 1,
      "title": "short action-oriented title",
      "description": "clear explanation of this step",
      "priority": "low | medium | high"
    }
  ]
}

RULES:

- Produce between 3 and 5 steps.
- Put the most urgent or valuable steps first.
- Every step must contribute directly to resolving the situation.
- Avoid generic advice when a more concrete step is possible.
- Do not claim that LifeLine has performed an external action unless it actually has.
- Do not invent access to calendars, files, email, devices, accounts, or services.
- If external information is required, phrase the step as verification or user action.
- Keep titles concise.
- Keep descriptions practical.
- Return valid JSON only.
- Do not use markdown.
- Do not use code fences.
- Do not include commentary outside the JSON object.
`;

  return generateStructuredJSON<ResolutionPlan>(prompt);
}