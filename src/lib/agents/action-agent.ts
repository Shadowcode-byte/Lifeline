import { generateStructuredJSON } from "@/lib/ai/gemini";
import type {
  ActionResult,
  ResolutionPlan,
  SituationAnalysis,
  SituationContext,
} from "@/types/lifeline";

export async function runActionAgent(
  problem: string,
  analysis: SituationAnalysis,
  context: SituationContext,
  plan: ResolutionPlan
): Promise<ActionResult> {
  const prompt = `
You are the Action Agent inside LifeLine,
an Alexa+ agentic situation-resolution system.

Three specialized agents have already processed the user's situation.

ORIGINAL USER SITUATION:
"${problem}"

UNDERSTANDING AGENT OUTPUT:
${JSON.stringify(analysis, null, 2)}

CONTEXT AGENT OUTPUT:
${JSON.stringify(context, null, 2)}

PLANNING AGENT OUTPUT:
${JSON.stringify(plan, null, 2)}

Your responsibility is to transform the resolution plan into a concise set
of proposed actions and produce the final Alexa-style response to the user.

Return ONLY valid JSON using exactly this structure:

{
  "actions": [
    {
      "id": 1,
      "title": "short action title",
      "description": "specific useful action",
      "status": "proposed"
    }
  ],
  "finalResponse": "natural conversational response summarizing what LifeLine recommends and what the user should do first"
}

RULES:

- Produce between 3 and 5 proposed actions.
- Actions must follow logically from the Planning Agent's strategy.
- Put the most urgent or valuable action first.
- Keep each action concrete and useful.
- Do not claim an external action was executed unless the system actually executed it.
- Do not say that LifeLine sent emails, modified calendars, recovered files, contacted people, booked services, or controlled devices unless such a tool was actually used.
- Every action in this version must have status "proposed".
- The finalResponse should sound natural when spoken by Alexa+.
- The finalResponse should be concise: approximately 2 to 4 sentences.
- Clearly communicate the first thing the user should do.
- Avoid robotic phrases such as "Based on the provided context".
- Do not mention internal agents, prompts, JSON, Gemini, or implementation details to the user.
- Return valid JSON only.
- Do not use markdown.
- Do not use code fences.
- Do not include commentary outside the JSON object.
`;

  return generateStructuredJSON<ActionResult>(prompt);
}
