"use client";

import { BrainCircuit } from "lucide-react";

type Urgency = "low" | "medium" | "high" | "critical";

export type SituationAnalysis = {
  intent: string;
  urgency: Urgency;
  constraints: string[];
  goal: string;
};

type SituationIntelligenceProps = {
  analysis: SituationAnalysis | null;
  understandingWorking: boolean;
};

export default function SituationIntelligence({
  analysis,
  understandingWorking,
}: SituationIntelligenceProps) {
  return (
    <section className="w-full min-w-0 overflow-hidden rounded-[26px] border border-white/[0.075] bg-white/[0.025] p-4 sm:p-5">
      <div className="mb-5 flex min-w-0 items-center gap-2">
        <BrainCircuit
          size={15}
          className="shrink-0 text-[#00A8E8]"
        />

        <span className="min-w-0 text-[11px] font-medium text-white/65">
          Situation intelligence
        </span>
      </div>

      <div className="w-full min-w-0 space-y-3">
        <IntelligenceItem
          label="Intent"
          value={
            analysis?.intent ??
            (understandingWorking
              ? "Analyzing..."
              : "Waiting")
          }
        />

        <IntelligenceItem
          label="Urgency"
          value={
            analysis?.urgency ??
            (understandingWorking
              ? "Detecting..."
              : "Waiting")
          }
          accent={
            analysis?.urgency === "critical" ||
            analysis?.urgency === "high"
          }
        />

        <IntelligenceItem
          label="Goal"
          value={
            analysis?.goal ??
            (understandingWorking
              ? "Defining..."
              : "Waiting")
          }
        />
      </div>
    </section>
  );
}

function IntelligenceItem({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border border-white/[0.05] bg-black/10 px-3.5 py-3">
      <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <span className="shrink-0 text-[10px] text-white/32 sm:pt-0.5">
          {label}
        </span>

        <span
          className={`min-w-0 max-w-full break-words text-left text-[10px] leading-[1.55] [overflow-wrap:anywhere] sm:max-w-[72%] sm:text-right ${
            accent
              ? "text-[#FF2E88]/85"
              : "text-white/60"
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}