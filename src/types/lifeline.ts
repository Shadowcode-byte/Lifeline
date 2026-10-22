export type Urgency = "low" | "medium" | "high" | "critical";

export interface SituationAnalysis {
  intent: string;
  urgency: Urgency;
  constraints: string[];
  goal: string;
}

export interface SituationContext {
  summary: string;
  assumptions: string[];
  missingInformation: string[];
  priorities: string[];
}

export interface ResolutionPlan {
  strategy: string;
  steps: {
    id: number;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }[];
}

export interface ProposedAction {
  id: number;
  title: string;
  description: string;
  status: "proposed";
}

export interface ActionResult {
  actions: ProposedAction[];
  finalResponse: string;
}

export interface LifeLineResolution {
  problem: string;
  analysis: SituationAnalysis;
  context: SituationContext;
  plan: ResolutionPlan;
  result: ActionResult;
}