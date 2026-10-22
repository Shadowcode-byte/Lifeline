import { runUnderstandingAgent } from "@/lib/agents/understanding-agent";
import { runContextAgent } from "@/lib/agents/context-agent";
import { runPlanningAgent } from "@/lib/agents/planning-agent";
import { runActionAgent } from "@/lib/agents/action-agent";

import type {
  ActionResult,
  ResolutionPlan,
  SituationAnalysis,
  SituationContext,
} from "@/types/lifeline";

export type AgentStage =
  | "understanding"
  | "context"
  | "planning"
  | "actions";

export type StageStatus =
  | "waiting"
  | "working"
  | "complete"
  | "failed";

export interface StageState {
  understanding: StageStatus;
  context: StageStatus;
  planning: StageStatus;
  actions: StageStatus;
}

export interface OrchestrationResult {
  success: boolean;
  problem: string;

  stages: StageState;

  analysis: SituationAnalysis | null;
  context: SituationContext | null;
  plan: ResolutionPlan | null;
  result: ActionResult | null;

  failedStage: AgentStage | null;
  error: string | null;
}

function initialStages(): StageState {
  return {
    understanding: "waiting",
    context: "waiting",
    planning: "waiting",
    actions: "waiting",
  };
}

function readableError(error: unknown): string {
  const message =
    error instanceof Error ? error.message : String(error);

  if (
    message.includes("503") ||
    message.includes("UNAVAILABLE") ||
    message.toLowerCase().includes("high demand")
  ) {
    return "The AI provider is temporarily experiencing high demand.";
  }

  if (
    message.toLowerCase().includes("timeout") ||
    message.toLowerCase().includes("timed out")
  ) {
    return "The AI provider took too long to respond.";
  }

  return "This agent could not complete its task.";
}

export async function resolveSituation(
  problem: string
): Promise<OrchestrationResult> {
  const stages = initialStages();

  let analysis: SituationAnalysis | null = null;
  let context: SituationContext | null = null;
  let plan: ResolutionPlan | null = null;
  let result: ActionResult | null = null;

  // --------------------------------------------------
  // Stage 1 — Understanding
  // --------------------------------------------------

  stages.understanding = "working";

  try {
    analysis = await runUnderstandingAgent(problem);
    stages.understanding = "complete";
  } catch (error) {
    stages.understanding = "failed";

    return {
      success: false,
      problem,
      stages,
      analysis,
      context,
      plan,
      result,
      failedStage: "understanding",
      error: readableError(error),
    };
  }

  // --------------------------------------------------
  // Stage 2 — Context
  // --------------------------------------------------

  stages.context = "working";

  try {
    context = await runContextAgent(problem, analysis);
    stages.context = "complete";
  } catch (error) {
    stages.context = "failed";

    return {
      success: false,
      problem,
      stages,
      analysis,
      context,
      plan,
      result,
      failedStage: "context",
      error: readableError(error),
    };
  }

  // --------------------------------------------------
  // Stage 3 — Planning
  // --------------------------------------------------

  stages.planning = "working";

  try {
    plan = await runPlanningAgent(
      problem,
      analysis,
      context
    );

    stages.planning = "complete";
  } catch (error) {
    stages.planning = "failed";

    return {
      success: false,
      problem,
      stages,
      analysis,
      context,
      plan,
      result,
      failedStage: "planning",
      error: readableError(error),
    };
  }

  // --------------------------------------------------
  // Stage 4 — Actions
  // --------------------------------------------------

  stages.actions = "working";

  try {
    result = await runActionAgent(
      problem,
      analysis,
      context,
      plan
    );

    stages.actions = "complete";
  } catch (error) {
    stages.actions = "failed";

    return {
      success: false,
      problem,
      stages,
      analysis,
      context,
      plan,
      result,
      failedStage: "actions",
      error: readableError(error),
    };
  }

  // --------------------------------------------------
  // Complete
  // --------------------------------------------------

  return {
    success: true,
    problem,
    stages,
    analysis,
    context,
    plan,
    result,
    failedStage: null,
    error: null,
  };
}